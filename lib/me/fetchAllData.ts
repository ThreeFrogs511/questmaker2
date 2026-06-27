"use server";
import { sql } from "@/server/connexion";
import { checkAuth } from "@/lib/auth/checkAuth";

export default async function fetchAllData() {
  try {
    const userId = await checkAuth();

    // fetching user's data and handling errors
    const r = await sql`SELECT
          u.user_id, u.email, u.profile_completed, u.tutorial_completed, u.last_chapter_done,
          c.character_id, c.username, c.xp, c.hp, c.user_class, c.lvl, c.race, c.gender,
          c.str, c.dex, c.con, c.int, c.wis, c.cha, c.ac, c.damage_taken,
          c.dopamine, c.dopamine_consumed, c.coins,
          i.slug, i.character_id AS inventory_character_id, i.quantity::int4 AS quantity, i.item_type as type, i.equipped,
        (SELECT json_agg(row_to_json(t)) FROM (SELECT * FROM movesets m where m.character_id = c.character_id
        ) t   ) as movesets
        FROM users u
        LEFT JOIN characters c ON u.user_id = c.user_id
        LEFT JOIN inventory i ON c.character_id = i.character_id
        WHERE u.user_id = ${userId}
        `;

    const inventory = r
      .filter((n) => n.quantity > 0)
      .map((n) => ({
        slug: n.slug,
        character_id: n.inventory_character_id,
        quantity: Number(n.quantity),
        type: n.type,
        equipped: n.equipped,
      }));

    if (!r || r.length === 0) return { err: "pas d'user existant" };

    return {
      authenticated: true,
      user: {
        user_id: Number(r[0].user_id),
        email: r[0].email,
        profile_completed: r[0].profile_completed,
        tutorial_completed: r[0].tutorial_completed,
        last_chapter_done:
          r[0].last_chapter_done !== null
            ? Number(r[0].last_chapter_done)
            : null,
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
      movesets: r[0].movesets,
      inventory: inventory.length === 0 ? [] : inventory,
    };
  } catch (err) {
    console.log((err as Error).message)
    return { err: "Server error. Please try again later." };
  }
}
