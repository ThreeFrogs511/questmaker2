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

    // preparing the query
    const query = `INSERT INTO users (email, user_password, profile_completed) VALUES($1, $2, $3)
    RETURNING id`;
    
    // executing the query
    const result = await sql.unsafe(query, [
      data.email,
      hash,
      false
    ]);

    // storing and returning the newly created id 
    const insertedId = result[0].id; 
    
    return NextResponse.json({ success: true, id:insertedId});

  } catch (err) {
    return NextResponse.json({ err: String(err)});
  }
}