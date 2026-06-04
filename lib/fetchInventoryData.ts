import postgres from "postgres";

export async function fetchInventoryData(
  sql: postgres.Sql<{}>,
  userId: number,
) {
  const r = await sql`
    SELECT
      u.user_id, u.email, u.profile_completed, u.tutorial_completed, u.last_chapter_done,
      c.character_id, c.username, c.xp, c.hp, c.user_class, c.lvl, c.race, c.gender,
      c.str, c.dex, c.con, c.int, c.wis, c.cha, c.ac, c.damage_taken,
      c.dopamine, c.dopamine_consumed, c.coins,
      i.inventory_id, i.slug, i.user_id AS inventory_user_id, i.quantity::int4 AS quantity, i.item_type as type
    FROM users u
    LEFT JOIN characters c ON u.user_id = c.user_id
    LEFT JOIN inventory i ON u.user_id = i.user_id
    WHERE u.user_id = ${userId}
    ORDER BY inventory_id DESC`;

  if (!r || r.length === 0) return { err: "pas d'user existant" };

  const inventory = r
    .filter((n) => n.inventory_id !== null)
    .map((n) => ({
      inventory_id: Number(n.inventory_id),
      slug: n.slug,
      quantity: Number(n.quantity),
      type: n.type,
    }));

  return {
    authenticated: true,
    user: {
      user_id: Number(r[0].user_id),
      email: r[0].email,
      profile_completed: r[0].profile_completed,
      tutorial_completed: r[0].tutorial_completed,
      last_chapter_done:
        r[0].last_chapter_done !== null ? Number(r[0].last_chapter_done) : null,
    },
    character: {
      character_id:
        r[0].character_id != null ? Number(r[0].character_id) : null,
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
    inventory,
  };
}
