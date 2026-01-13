import { NextResponse } from 'next/server';
import { sql } from '@/server/connexion';
import { cookies } from "next/headers";


export async function GET() {

    try {

        // cookies
        const cookieStore = await cookies();
        const token:any = cookieStore.get("session")?.value;

        // checking if the token exists
        if (!token) return NextResponse.json({error: 'no logged session'});


        // fetching the session and handling errors
        const sessionRows = await sql `
        SELECT user_id
        FROM sessions
        WHERE token = ${token}
        AND expires_at > NOW();`;

        const userId = sessionRows?.[0]?.user_id;
        if (!userId) return NextResponse.json({ error: "invalid or expired session" });

        // fetching user's data and handling errors
        const userRows = await sql`
        SELECT id, username, email, xp, hp, user_class, lvl, race, gender,
        str, dex, con, int, wis, cha, ac, damage_taken, dopamine, dopamine_consumed, profile_completed
        FROM users
        WHERE id = ${userId}`;

        if (!userRows || userRows.length === 0) {
            return NextResponse.json({ error: "user not found" });
        };


        // returning the successful response with the user object
        return NextResponse.json({
            authenticated: true,
            user: userRows[0]
        });

    } catch (err) {
        console.log(err)
        return NextResponse.json({error: 'internal error'});
    }
}

