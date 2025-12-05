import { sql } from '@/server/connexion';
import { NextResponse } from 'next/server';

export async function GET() {

    try {

        const list = await sql`SELECT * FROM dnd_campaign_index ORDER BY id ASC`;
        return NextResponse.json(list);

    } catch(err) {
        return NextResponse.json({'error': err});
    }

}
