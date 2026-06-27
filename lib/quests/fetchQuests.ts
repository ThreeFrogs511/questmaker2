"use server";
import { sql } from "@/server/connexion";
import { checkAuth } from "@/lib/auth/checkAuth";

export async function fetchQuests(page:number, lastQuestId:number) {
  try {
    const userId = await checkAuth();

    // if (page===1) {
    //   const r = await sql`SELECT * FROM quests WHERE user_id = ${userId} ORDER BY quest_id DESC LIMIT 10`
    // } else if (page > 1) {
    //   const r = await sql`SELECT * FROM quests WHERE user_id = ${userId} AND quest_id < ${lastQuestId} ORDER BY quest_id DESC LIMIT 10`
    // }
// WITH all_quests AS (select ROW_NUMBER() OVER (order by quest_id desc) as quest_number, quest_id, body, completed, user_id from quests
// where user_id = 17
// order by quest_id
// desc
//   )
// SELECT * FROM all_quests WHERE quest_number BETWEEN 5 and 8

    const r = await sql`SELECT * from quests WHERE user_id = ${userId}`;

    if (!r) return { err: "Error while fetching user's quests" };
    if (r.length === 0) return { success: true, quests: [] };

    const allQuests = r.map((n) => {
      return {
        quest_id: n.quest_id,
        body: n.body,
        completed: n.completed,
        user_id: n.user_id,
      };
    });

    return {
      success: true,
      quests: allQuests,
    };
  } catch (err) {
    return {err:"Internal error. Please try again."}
  }
}
