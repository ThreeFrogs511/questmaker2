"use server";
import { sql } from "@/server/connexion";
import { cookies } from "next/headers";
import * as jose from "jose";
import { PayloadType } from "@/types/types";

export default async function fetchAllData(pathname: string) {
  try {
    // cookies
    const cookieStore = await cookies();
    // const token = cookieStore.get("session")?.value;
    const jwt = cookieStore.get("auth")?.value;

    // checking if the token exists
    if (!jwt) return { err: "Not authenticated" };

    const secretKey = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload }: { payload: PayloadType } = await jose.jwtVerify(
      jwt,
      secretKey,
    );
    const userId: number = payload.userId;
    const email: string = payload.email;

    if (!userId || !email) return { err: "No user id attached" };

    if (!pathname) return { err: "Wrong URL" };
    // fetching user's data and handling errors
    const r = await sql`SELECT
          u.user_id, u.email, u.profile_completed, u.tutorial_completed, u.last_chapter_done,
          c.character_id, c.username, c.xp, c.hp, c.user_class, c.lvl, c.race, c.gender,
          c.str, c.dex, c.con, c.int, c.wis, c.cha, c.ac, c.damage_taken,
          c.dopamine, c.dopamine_consumed, c.coins,
          i.slug, i.user_id AS inventory_user_id, i.quantity::int4 AS quantity, i.item_type as type, i.equipped,
        (SELECT json_agg(row_to_json(t)) FROM (SELECT * FROM movesets m where m.character_id = c.character_id 
        ) t   ) as movesets
        FROM users u
        LEFT JOIN characters c ON u.user_id = c.user_id
        LEFT JOIN inventory i ON u.user_id = i.user_id
        WHERE u.user_id = ${userId}
        `;
// console.log(r)
    const inventory = r
      .filter((n) => n.quantity > 0)
      .map((n) => ({
        slug: n.slug,
        user_id: n.inventory_user_id,
        quantity: Number(n.quantity),
        type: n.type,
        equipped: n.equipped,
      }));

      console.log(inventory)
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
    return { err: (err as Error).message };
  }
}
