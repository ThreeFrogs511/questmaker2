"use server";
import { sql } from "@/server/connexion";
import { checkAuth } from "@/lib/auth/checkAuth";

type Statuses = "" | "Active" | "Archived";

export async function fetchQuests(
  page: number = 1,
  status: Statuses,
  filter: string[],
) {
  try {
    const userId = await checkAuth();

    const statusesOn =
      status === "Active" || status === "Archived" ? true : false;

    let r;

    //we fetch only 15 quests per page for performance purposes
    const numberOfQuestsPerPage = 15;
    const offset = page * numberOfQuestsPerPage - numberOfQuestsPerPage;


    r = await sql`
          WITH qst AS (
            SELECT quest_id, body, completed, user_id     
            FROM quests 
            WHERE user_id = ${userId} 
            ${
              statusesOn
                ? sql`AND completed = (
            CASE WHEN ${status} = 'Active' 
            THEN FALSE 
            WHEN ${status} = 'Archived' 
            THEN TRUE 
            END)`
                : sql``
            }
            
          )
          SELECT quest_id, body, completed, user_id, (SELECT count(*) FROM qst) AS count FROM qst 
          ORDER BY quest_id DESC 
          ${sql`OFFSET ${offset}`} LIMIT ${numberOfQuestsPerPage}`;

    if (!r) return { err: "Error while fetching user's quests" };
    if (r.length === 0) return { success: true, quests: [], pages: 1 };

    const numberOfPages = Math.ceil(r[0].count / numberOfQuestsPerPage);
    const allQuests = r.map((n) => {
      return {
        quest_id: Number(n.quest_id),
        body: String(n.body),
        completed: Boolean(n.completed),
        user_id: Number(n.user_id),
      };
    });

    return {
      success: true,
      quests: allQuests,
      count:r[0].count,
    };
  } catch (err) {
    console.log((err as Error).message);
    return { err: "Internal error. Please try again." };
  }
}
