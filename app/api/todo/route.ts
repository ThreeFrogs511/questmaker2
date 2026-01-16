import { sql } from '@/server/connexion';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {

  try {
    const data = await request.json();

    if (!data.user_id) return NextResponse.json({error:"pas de user id"});

    const result = await sql`
      INSERT INTO todo (body, completed, user_id)
      VALUES (${data.body}, ${data.completed}, ${data.user_id})
      RETURNING id, body, completed, user_id
    `;

    // returns the newly inserted entry/quest
    const insertedQuest = result[0]; 

    if (!insertedQuest) throw new Error("Not inserted");

    return NextResponse.json({ success: true, quest: insertedQuest});

  } catch(err) {
    return NextResponse.json({error: String(err)});
  }
}
