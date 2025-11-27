import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/server/connexion';
import bcrypt from "bcrypt";
import { cookies } from "next/headers";
import crypto from "crypto";



// completing the profile
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {

  try {
    const { id } = await params;
    const data = await request.json();

    if (!id) return NextResponse.json({error: "User id not found"});

    const query = `UPDATE users SET 
                  race = $1, 
                  user_class = $2, 
                  str=$3,
                  dex=$4,
                  con=$5,
                  int=$6,
                  wis=$7,
                  cha=$8,
                  username=$9,
                  gender=$10,
                  lvl=$11,
                  xp=$12,
                  hp=$13,
                  profile_completed = $14,
                  damage_taken=$15,
                  dopamine=$16,
                  dopamine_consumed=$17
                  WHERE id = ${id}`;
    const result = await sql.unsafe(
      query, [
        data.race, 
        data.user_class, 
        data.str, 
        data.dex, 
        data.con, 
        data.int, 
        data.wis, 
        data.cha, 
        data.username, 
        data.gender, 
        1, 
        0, 
        data.hp, 
        true, 
        0, 
        data.dopamine,
        0
      ]); 
    
    
    // when the users finish their account, we log them and
    // save their session with a token
    const token = crypto.randomBytes(32).toString("hex");
    
    // we insert a new session in the database
    // identified by the unique token
    await sql`
        INSERT INTO sessions (token, user_id, expires_at)
        VALUES (${token}, ${id}, NOW() + INTERVAL '7 days')
    `;
    
    // we create a cookie that'll save the session
    // and that'll be able to be found thanks to the token
    (await cookies()).set({
      name: "session",
      value: token,
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7 
    });

    return NextResponse.json({ success: true, data: result });

  } catch (err) {
    return NextResponse.json({error: String(err)});
  }
}
