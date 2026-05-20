import { NextResponse } from "next/server";
import { sql } from "@/server/connexion";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    if (!id) return NextResponse.json({ error: "id null" });

    const todos = await sql`
        SELECT t.id, t.body, t.completed, t.user_id
        FROM todo
        WHERE user_id = ${id}
        ORDER BY id DESC`;

    if (todos.length === 0) return NextResponse.json({ error: "No todos yet" });

    return NextResponse.json(todos);
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message });
  }
}

// compléter ou annuler la complétion d'une quête
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    if (!id) return NextResponse.json({ error: "id null" });

    const data = await request.json();

    if (data.completed === undefined)
      return NextResponse.json({ error: "Missing field: completed" });
    if (!data.taskUserId || !data.currentUser || !data.currentUser.id)
      return NextResponse.json({ error: "missing id" });
    if (data.taskUserId !== data.currentUser?.id)
      return NextResponse.json({
        error: "You are not authorized to use this action",
      });

    const result = await sql`
      WITH
        rl AS (
          SELECT count, window_start
          FROM quest_rate_limit
          WHERE user_id = ${data.currentUser.id}
        ),
        state AS (
          SELECT
            COALESCE((SELECT count        FROM rl), 0)    AS current_count,
            COALESCE((SELECT window_start FROM rl), NOW()) AS window_start
        ),
        derived AS (
          SELECT
            current_count,
            window_start,
            EXTRACT(EPOCH FROM (NOW() - window_start)) >= 3600 AS one_hour_passed,
            (
              current_count >= 5
              AND EXTRACT(EPOCH FROM (NOW() - window_start)) < 3600
              AND ${data.completed}::boolean
            ) AS is_limited
          FROM state
        ),
        todo_upd AS (
          UPDATE todo
          SET completed = ${data.completed}
          WHERE id = ${id}
            AND NOT (SELECT is_limited FROM derived)
          RETURNING id
        ),
        rl_values AS (
          SELECT
            CASE
              WHEN NOT ${data.completed}::boolean            THEN GREATEST(current_count - 1, 0)
              WHEN current_count >= 5 AND one_hour_passed    THEN 1
              ELSE                                                current_count + 1
            END AS new_count,
            CASE
              WHEN NOT ${data.completed}::boolean THEN window_start
              ELSE                                    NOW()
            END AS new_window_start
          FROM derived
          WHERE EXISTS (SELECT 1 FROM todo_upd)
        ),
        rl_upd AS (
          INSERT INTO quest_rate_limit (user_id, count, window_start)
          SELECT ${data.currentUser.id}, new_count, new_window_start FROM rl_values
          ON CONFLICT (user_id) DO UPDATE
            SET count        = EXCLUDED.count,
                window_start = EXCLUDED.window_start
        ),
        coins_upd AS (
          UPDATE users
          SET coins = GREATEST(
            coins + CASE WHEN ${data.completed}::boolean THEN 1 ELSE -1 END,
            0
          )
          WHERE id = ${data.currentUser.id}
            AND EXISTS (SELECT 1 FROM todo_upd)
          RETURNING coins
        )
      SELECT
        (SELECT is_limited FROM derived)    AS is_limited,
        (SELECT id          FROM todo_upd)  AS todo_id,
        (SELECT coins       FROM coins_upd) AS coins
    `;

    if (result[0].is_limited) throw new Error("limit");
    if (!result[0].todo_id)   throw new Error("Server error. Please try later.");

    return NextResponse.json({ success: true, coins: result[0].coins });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    if (id === undefined) throw new Error("Undefined user id");

    await sql`
      DELETE FROM todo
      WHERE id = ${id}`;

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: String(error) });
  }
}
