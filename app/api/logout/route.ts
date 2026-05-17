import { NextResponse } from 'next/server';
import { sql } from '@/server/connexion';
import { cookies } from "next/headers";




export async function DELETE(
    request: Request,
) {

    try {
        const cookie = await cookies();

        cookie.delete('session');
        cookie.delete('csrf');
        cookie.delete('auth');
        return NextResponse.json({success: true});

    } catch (err) {
        return NextResponse.json({error: String(err)});

    }

}