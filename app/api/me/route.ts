import { NextResponse } from "next/server";
import { sql } from "@/server/connexion";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  try {
    // cookies
    const cookieStore = await cookies();
    const token = cookieStore.get("session")?.value;

    // checking if the token exists
    if (!token) return NextResponse.json({ err: "pas de cookie " });

    // fetching the session and handling errors
    const sessionRows = await sql`
        SELECT user_id
        FROM sessions
        WHERE token = ${token}
        AND expires_at > NOW();`;

    const userId = sessionRows?.[0]?.user_id;
    console.log("userId:", userId);
    if (!userId) return NextResponse.json({ err: "pas de user id" });

    const { pathname } = await request.json();

    if (!pathname) return NextResponse.json({ err: "wrong URL" });
    // fetching user's data and handling errors
    let r;
    if (pathname === "/journal") {
      r =
        await sql`SELECT u.coins, u.profile_completed, u.id AS global_user_id, t.id, t.body, t.completed, t.user_id 
        FROM users u LEFT JOIN todo t ON u.id = t.user_id WHERE u.id = ${userId}`;

      if (!r || r.length === 0)
        return NextResponse.json({
          err: "pas d'user existant pour les quêtes",
        });
      console.log(r);
      return NextResponse.json({
        authenticated: true,
        user: {
          id: r[0].global_user_id,
          coins: r[0].coins,
          profile_completed: r[0].profile_completed,
        },
        todos: r,
      });
    } else if (pathname === "/profileSettings") {
      r = await sql`
        SELECT id, username, xp, hp, user_class, lvl, race, gender,
        str, dex, con, int, wis, cha, ac, damage_taken, dopamine, dopamine_consumed, profile_completed, coins, last_campaign_done, email
        FROM users
        WHERE id = ${userId}`;

      if (!r || r.length === 0)
        return NextResponse.json({ err: "pas d'user existant" });

      // returning the successful response with the user object
      return NextResponse.json({
        authenticated: true,
        user: r[0],
      });
    } else if (pathname === "/merchant" || pathname === "/inventory" || pathname === "/merchant/sell") {
      r =
        await sql`SELECT u.id as global_user_id, u.profile_completed, u.coins, u.dopamine_consumed, u.damage_taken, u.hp, u.dopamine, i.inventory_id, i.slug, 
        i.user_id as inventory_user_id, i.quantity::int4 AS quantity FROM users u LEFT JOIN inventory i ON u.id = i.user_id WHERE u.id = ${userId}`;

      if (!r || r.length === 0)
        return NextResponse.json({ err: "pas d'user existant" });

      const inventory = r.map((n) => {
        return {
          inventory_id: n.inventory_id,
          slug: n.slug,
          quantity: n.quantity,
        };
      });
      // returning the successful response with the user object
      return NextResponse.json({
        authenticated: true,
        user: {
          id: r[0].global_user_id,
          coins: r[0].coins,
          dopamine_consumed: r[0].dopamine_consumed,
          damage_taken: r[0].damage_taken,
          hp: r[0].hp,
          dopamine: r[0].dopamine,
          profile_completed: r[0].profile_completed,
        },
        inventory: inventory,
      });
    } else if (pathname.includes("/campaignRunning")) {
      r = await sql`
        SELECT u.id, u.username, u.xp, u.hp, u.user_class, u.lvl, u.race, u.gender,
        u.str, u.dex, u.con, u.int, u.wis, u.cha, u.ac, u.damage_taken, u.dopamine, 
        u.dopamine_consumed, u.profile_completed, u.coins, u.last_campaign_done,
        i.inventory_id, i.slug, 
        i.user_id as inventory_user_id, i.quantity::int4 AS quantity
        FROM users u 
        LEFT JOIN
        inventory i ON u.id = i.user_id 
        WHERE u.id = ${userId}`;

      const inventory = r.map((n) => {
        return {
          inventory_id: n.inventory_id,
          slug: n.slug,
          quantity: n.quantity,
        };
      });

      // returning the successful response with the user object
      return NextResponse.json({
        authenticated: true,
        user: {
          username: r[0].username,
          id: r[0].global_user_id,
          coins: r[0].coins,
          dopamine_consumed: r[0].dopamine_consumed,
          damage_taken: r[0].damage_taken,
          hp: r[0].hp,
          dopamine: r[0].dopamine,
          profile_completed: r[0].profile_completed,
          str: r[0].str,
          dex: r[0].dex,
          con: r[0].con,  
          int: r[0].int,
          wis: r[0].wis,
          cha: r[0].cha,
          ac: r[0].ac,  
          last_campaign_done: r[0].last_campaign_done,
        },
        inventory: inventory,
      });

    } else {
      r = await sql`
        SELECT id, username, xp, hp, user_class, lvl, race, gender,
        str, dex, con, int, wis, cha, ac, damage_taken, dopamine, dopamine_consumed, profile_completed, coins, last_campaign_done
        FROM users
        WHERE id = ${userId}`;

      if (!r || r.length === 0)
        return NextResponse.json({ err: "pas d'user existant" });

      // returning the successful response with the user object
      return NextResponse.json({
        authenticated: true,
        user: r[0],
      });
    }
  } catch (err) {
    return NextResponse.json({ err: (err as Error).message });
  }
}
