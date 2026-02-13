import { NextResponse } from "next/server";
import { sql } from "@/server/connexion";
import { cookies } from "next/headers";

export async function GET() {
  try {
    // cookies
    const cookieStore = await cookies();
    const token = cookieStore.get("session")?.value;

    // checking if the token exists
    if (!token) return NextResponse.json({err:"pas de cookie "});

    // fetching the session and handling errors
    const sessionRows = await sql`
        SELECT user_id
        FROM sessions
        WHERE token = ${token}
        AND expires_at > NOW();`;

    const userId = sessionRows?.[0]?.user_id;
    if (!userId) return NextResponse.json({err:"pas de user id"});

    // fetching user's data and handling errors
    const userRows = await sql`
        SELECT id, username, xp, hp, user_class, lvl, race, gender,
        str, dex, con, int, wis, cha, ac, damage_taken, dopamine, dopamine_consumed, profile_completed, coins
        FROM users
        WHERE id = ${userId}`;

    if (!userRows || userRows.length === 0) return NextResponse.json({err:"pas d'user existant"});
    

    // returning the successful response with the user object
    return NextResponse.json({
      authenticated: true,
      user: userRows[0],
    });
  } catch (err) {
    return NextResponse.json({ err: (err as Error).message }, { status: 401 });
  }
}


