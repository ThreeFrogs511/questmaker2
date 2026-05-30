import postgres from "postgres";
import { User } from "@/types/types";

export async function fetchQuests(sql: postgres.Sql<{}>, userId: number) {
  try {
    console.log(userId)
  const r = await sql`SELECT
        u.user_id AS global_user_id, u.email, u.profile_completed, u.tutorial_completed, u.last_chapter_done, 
        c.character_id, c.xp, c.hp, c.user_class, c.lvl, c.race, c.gender, c.username,
        c.str, c.dex, c.con, c.int, c.wis, c.cha, c.ac, c.damage_taken, c.dopamine, c.dopamine_consumed, c.coins, c.user_id,
        q.quest_id, q.body, q.completed, q.user_id AS quest_user_id
        FROM users u
        LEFT JOIN quests q
        ON u.user_id = q.user_id
        LEFT JOIN characters c
        ON u.user_id = c.user_id
        WHERE u.user_id = ${userId}`;


  if (!r || r.length === 0)
    return { err: "Error while fetching user's quests" };

  const allQuests = r.map((n) => {
    return {
      quest_id: n.quest_id,
      body: n.body,
      completed: n.completed,
      user_id: n.quest_user_id,
    };
  });

  return {
    authenticated: true,
    user: {
      user_id: Number(r[0].global_user_id),
      email: r[0].email,
      last_chapter_done: r[0].last_chapter_done !== null ? Number(r[0].last_chapter_done) : null,
      tutorial_completed: r[0].tutorial_completed,
      profile_completed: r[0].profile_completed,
    },
    character: {
      character_id: Number(r[0].character_id),
      username: r[0].username,
      xp: Number(r[0].xp),
      hp: Number(r[0].hp),
      user_class: r[0].user_class,
      lvl: Number(r[0].lvl),
      race: r[0].race,
      gender: r[0].gender,
      str: Number(r[0].str),
      dex: Number(r[0].dex),
      con: Number(r[0].con),
      int: Number(r[0].int),
      wis: Number(r[0].wis),
      cha: Number(r[0].cha),
      ac: Number(r[0].ac),
      damage_taken: Number(r[0].damage_taken),
      dopamine: Number(r[0].dopamine),
      dopamine_consumed: Number(r[0].dopamine_consumed),
      coins: Number(r[0].coins),
    },
    quests: allQuests,
  };
  } catch (err) {
    return err;
  }
}
