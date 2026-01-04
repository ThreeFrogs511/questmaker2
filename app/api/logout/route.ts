import { NextResponse } from 'next/server';
import { sql } from '@/server/connexion';
import bcrypt from "bcrypt";
import { cookies } from "next/headers";
import crypto from "crypto";



export async function DELETE(
    request: Request,
) {

    try {
        const cookie = await cookies();
        const token:any = cookie.get("session")?.value;
        if (!token) return NextResponse.json({error: 'No sessions detected. Please login.'});

        const query = `DELETE FROM sessions WHERE token = $1`;
        await sql.unsafe(query, [token]); 

        cookie.delete('session');
        return NextResponse.json({success: true});

    } catch (err) {
        return NextResponse.json({error: String(err)});

    }

}