import { NextResponse } from 'next/server';
import { sql } from '@/server/connexion';
import { cookies } from "next/headers";
// import crypto from "crypto";




export async function GET() {

try {
const cookieStore = await cookies();
const token:any = cookieStore.get("session")?.value;

if (token===null) return NextResponse.json({error: 'no logged session'});

const sessionRows = await sql `
    SELECT user_id
    FROM sessions
    WHERE token = ${token}
    AND expires_at > NOW();`;

const userRows = await sql`
    SELECT id, username, email, xp, hp, user_class, lvl, race, gender,
           str, dex, con, int, wis, cha, ac, damage_taken, dopamine, dopamine_consumed, profile_completed
    FROM users
    WHERE id = ${sessionRows[0].user_id}`;

return NextResponse.json({
    authenticated: true,
    user: userRows[0]
});
} catch (err) {
    return NextResponse.json({error: String(err)});
}
    
}

