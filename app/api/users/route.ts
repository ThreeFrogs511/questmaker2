import { NextResponse } from 'next/server';
import { sql } from '@/server/connexion';
import bcrypt from "bcrypt";



// creating the account but incomplete
export async function POST(
  request: Request
) {

  try {

    const data = await request.json();
    // hashing
    const hash = await bcrypt.hash(data.password, 10);


    // executing the query (no unsafe)
    const result = await sql`
    INSERT INTO users (email, user_password, profile_completed)
    VALUES (${data.email}, ${hash}, ${false})
    RETURNING id
    `;

    const insertedId = result[0]?.id;
    
    return NextResponse.json({ success: true, id:insertedId});

  } catch (err) {
    return NextResponse.json({ err: String(err)});
  }
}