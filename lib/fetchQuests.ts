import postgres from "postgres";
import { NextResponse } from "next/server";

export async function fetchQuests(sql: postgres.Sql<{}>, userId: number) {
    const r =
        await sql`SELECT 
        u.coins, u.profile_completed, u.id AS global_user_id, t.id, t.body, 
        t.completed, t.user_id 
        FROM users u 
        LEFT JOIN todo t 
        ON u.id = t.user_id 
        WHERE u.id = ${userId}`;

    if (!r || r.length === 0) return NextResponse.json({err: "Error while fetching user's quests"});

     return NextResponse.json({
        authenticated: true,
        user: {
          id: r[0].global_user_id,
          coins: r[0].coins,
          profile_completed: r[0].profile_completed,
        },
        todos: r,
      });
}
