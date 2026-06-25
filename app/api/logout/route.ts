import { NextResponse } from 'next/server';
import { cookies } from "next/headers";




export async function DELETE(
    request: Request,
) {

    try {
        const cookie = await cookies();

        cookie.delete('csrf');
        cookie.delete('auth');
        return NextResponse.json({success: true});

    } catch (err) {
        return NextResponse.json({error: String(err)});

    }

}