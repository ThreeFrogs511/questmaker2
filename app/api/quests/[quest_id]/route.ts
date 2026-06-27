import { NextResponse } from "next/server";
import { sql } from "@/server/connexion";
import { checkAuth } from "@/lib/auth/checkAuth";

export async function GET(
  request: Request,
  { params: _params }: { params: Promise<{ quest_id: string }> },
) {
  try {
    const userId = await checkAuth(request);

    const quests = await sql`
        SELECT quest_id, body, completed, user_id
        FROM quests
        WHERE user_id = ${userId}
        ORDER BY quest_id DESC`;

    if (quests.length === 0) return NextResponse.json({ error: "No quests yet" });

    return NextResponse.json(quests);
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ quest_id: string }> },
) {
  try {
    const userId = await checkAuth(request);
    const { quest_id } = await params;

    if (!quest_id) return NextResponse.json({ error: "id null" });

    const data = await request.json();

    if (data.completed === undefined)
      return NextResponse.json({ error: "Missing field: completed" });

    const result = await sql`
      WITH
        rl AS (
          SELECT count, window_start
          FROM quest_rate_limit
          WHERE user_id = ${userId}
        ),
        state AS (
          SELECT
            COALESCE((SELECT count        FROM rl), 0)     AS current_count,
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
        quest_upd AS (
          UPDATE quests
          SET completed = ${data.completed}
          WHERE quest_id = ${quest_id}
            AND NOT (SELECT is_limited FROM derived)
          RETURNING quest_id
        ),
        rl_values AS (
          SELECT
            CASE
              WHEN NOT ${data.completed}::boolean         THEN GREATEST(current_count - 1, 0)
              WHEN current_count >= 5 AND one_hour_passed THEN 1
              ELSE                                             current_count + 1
            END AS new_count,
            CASE
              WHEN NOT ${data.completed}::boolean THEN window_start
              ELSE                                    NOW()
            END AS new_window_start
          FROM derived
          WHERE EXISTS (SELECT 1 FROM quest_upd)
        ),
        rl_upd AS (
          INSERT INTO quest_rate_limit (user_id, count, window_start)
          SELECT ${userId}, new_count, new_window_start FROM rl_values
          ON CONFLICT (user_id) DO UPDATE
            SET count        = EXCLUDED.count,
                window_start = EXCLUDED.window_start
        ),
        coins_upd AS (
          UPDATE characters
          SET coins = GREATEST(
            coins + CASE WHEN ${data.completed}::boolean THEN 1 ELSE -1 END,
            0
          )
          WHERE user_id = ${userId}
            AND EXISTS (SELECT 1 FROM quest_upd)
          RETURNING coins
        )
      SELECT
        (SELECT is_limited FROM derived)    AS is_limited,
        (SELECT quest_id   FROM quest_upd)  AS quest_id,
        (SELECT coins      FROM coins_upd)  AS coins
    `;

    if (result[0].is_limited) throw new Error("limit");
    if (!result[0].quest_id)  throw new Error("Server error. Please try later.");

    return NextResponse.json({ success: true, coins: Number(result[0].coins) });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ quest_id: string }> },
) {
  try {
    const userId = await checkAuth(request);
    const { quest_id } = await params;
    if (quest_id === undefined) throw new Error("Undefined quest id");

    await sql`
      DELETE FROM quests
      WHERE quest_id = ${quest_id}
      AND user_id = ${userId}`;

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: String(error) });
  }
}
