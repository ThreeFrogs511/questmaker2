import postgres from "postgres";
import { NextResponse } from "next/server";
import * as jose from "jose";
import { cookies } from "next/headers";

export async function fetchQuests(sql: postgres.Sql<{}>, userId: number) {
  const r = await sql`SELECT
        u.id AS global_user_id, u.email, u.username, u.xp, u.hp, u.user_class, u.lvl, u.race, u.gender,
        u.str, u.dex, u.con, u.int, u.wis, u.cha, u.ac,
        u.damage_taken, u.dopamine, u.dopamine_consumed, u.profile_completed, u.coins, u.last_campaign_done,
        t.id, t.body, t.completed, t.user_id
        FROM users u
        LEFT JOIN todo t
        ON u.id = t.user_id
        WHERE u.id = ${userId}`;

  if (!r || r.length === 0)
    return NextResponse.json({ err: "Error while fetching user's quests" });

  const allQuests = r.map((n) => {
    return {
      id: n.id,
      body: n.body,
      completed: n.completed,
      user_id: n.user_id,
    };
  });


  return NextResponse.json({
    authenticated: true,
    user: {
      id: r[0].global_user_id,
      email: r[0].email,
      username: r[0].username,
      xp: r[0].xp,
      hp: r[0].hp,
      user_class: r[0].user_class,
      lvl: r[0].lvl,
      race: r[0].race,
      gender: r[0].gender,
      str: r[0].str,
      dex: r[0].dex,
      con: r[0].con,
      int: r[0].int,
      wis: r[0].wis,
      cha: r[0].cha,
      ac: r[0].ac,
      damage_taken: r[0].damage_taken,
      dopamine: r[0].dopamine,
      dopamine_consumed: r[0].dopamine_consumed,
      profile_completed: r[0].profile_completed,
      coins: r[0].coins,
      last_campaign_done: r[0].last_campaign_done,
    },
    todos: allQuests,
  });
}
