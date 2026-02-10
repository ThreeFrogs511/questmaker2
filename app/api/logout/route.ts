import { NextResponse } from 'next/server';
import { sql } from '@/server/connexion';
import { cookies } from "next/headers";




export async function DELETE(
    request: Request,
) {

    try {
        const cookie = await cookies();
        const token:string | undefined = cookie.get("session")?.value;
        if (!token) return NextResponse.json({error: 'No sessions detected. Please login.'});

        await sql`DELETE FROM sessions WHERE token = ${token}`;

        cookie.delete('session');
        cookie.delete('csrf');
        return NextResponse.json({success: true});

    } catch (err) {
        return NextResponse.json({error: String(err)});

    }

}