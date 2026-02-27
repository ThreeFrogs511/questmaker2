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
        await sql`SELECT u.coins, u.id AS global_user_id, t.id, t.body, t.completed, t.user_id FROM users u LEFT JOIN todo t ON u.id = t.user_id WHERE u.id = ${userId}`;

     
      if (!r || r.length === 0)
        return NextResponse.json({ err: "pas d'user existant pour les quêtes" });
      console.log(r)
      return NextResponse.json({
        authenticated: true,
        user: { id: r[0].global_user_id, coins: r[0].coins },
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
