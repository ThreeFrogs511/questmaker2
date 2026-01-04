import { sql } from '@/server/connexion';
import { NextResponse } from 'next/server';

export async function GET() {
  const todos = await sql`SELECT * FROM todo ORDER BY id DESC`;
  return NextResponse.json(todos);
}


export async function POST(request: Request) {

  try {
    const data = await request.json();

    const result = await sql`
      INSERT INTO todo (body, completed, user_id)
      VALUES (${data.body}, ${data.completed}, ${data.user_id})
      RETURNING id, body, completed
    `;

    // returns the newly inserted entry/quest
    const insertedQuest = result[0]; 

    if (!insertedQuest) throw new Error("Not inserted");

    return NextResponse.json({ success: true, quest: insertedQuest});

  } catch(err) {
    return NextResponse.json({error: String(err)});
  }
}
