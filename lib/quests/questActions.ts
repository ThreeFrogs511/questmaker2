"use server";
import { sql } from "@/server/connexion";
import { checkAuth } from "@/lib/auth/checkAuth";
import { ListType } from "@/types/types";




export async function insertQuest(body: string, isCompleted:boolean) {
  try {
    const user_id = await checkAuth();

    if (body === null || body === undefined)
      throw new Error("error while sending quest completion state");
    if (!body || body.trim() === "") throw new Error("quests can not be empty");

    const result = await sql`
      INSERT INTO quests (body, completed, user_id)
      VALUES (${body}, ${isCompleted}, ${user_id})
      RETURNING quest_id, body, completed, user_id
    `;

    const insertedQuest = result[0];

    if (!insertedQuest) throw new Error("error while submitting the quest");

    return {
      success: true,
      quest: {
        quest_id: Number(insertedQuest.quest_id),
        body: String(insertedQuest.body),
        completed: Boolean(insertedQuest.completed),
        user_id: Number(insertedQuest.user_id),
      },
    };
  } catch (err) {
    return { err: (err as Error).message };
  }
}

export async function completeQuest(quest_id: number, isCompleted: boolean) {
  try {
    const RATE_LIMIT = 500;
    const userId = await checkAuth();

    if (!quest_id) throw new Error("no quest id found");

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
              current_count >= ${RATE_LIMIT}
              AND EXTRACT(EPOCH FROM (NOW() - window_start)) < 3600
              AND ${isCompleted}::boolean
            ) AS is_limited
          FROM state
        ),
        quest_upd AS (
          UPDATE quests
          SET completed = ${isCompleted}
          WHERE quest_id = ${quest_id}
            AND NOT (SELECT is_limited FROM derived)
          RETURNING quest_id
        ),
        rl_values AS (
          SELECT
            CASE
              WHEN NOT ${isCompleted}::boolean         THEN GREATEST(current_count - 1, 0)
              WHEN current_count >= ${RATE_LIMIT} AND one_hour_passed THEN 1
              ELSE                                             current_count + 1
            END AS new_count,
            CASE
              WHEN NOT ${isCompleted}::boolean THEN window_start
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
            coins + CASE WHEN ${isCompleted}::boolean THEN 1 ELSE -1 END,
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
    if (!result[0].quest_id) throw new Error("Server error. Please try later.");

    return { success: true, coins: Number(result[0].coins) };
  } catch (error) {
    return { error: (error as Error).message };
  }
}

export async function deleteQuest(quest_id: number, cursor: number) {
  try {
    const userId = await checkAuth();
    if (!quest_id|| !cursor) return { err: "Undefined quest" };

    const r = await sql`
    WITH 
    fetch_cursor AS (
    SELECT * FROM quests 
    WHERE user_id = ${userId} AND quest_id = ${cursor - 1} LIMIT 1
    ),
    delete_quest AS (
      DELETE FROM quests
      WHERE quest_id = ${quest_id}
      AND user_id = ${userId}
    )
    SELECT * FROM fetch_cursor`;


    return { success: true, lastQuest: r[0] as ListType };
  } catch (err) {
    console.log((err as Error).message);
    return { err: "An unexpected error occurred. Please try again." };
  }
}
