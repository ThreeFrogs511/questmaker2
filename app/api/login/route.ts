import { NextResponse } from 'next/server';
import { sql } from '@/server/connexion';
import bcrypt from "bcrypt";
import { cookies } from "next/headers";
import crypto from "crypto";



export async function POST(
request: Request) {

  try {

    const data = await request.json();
    const row = await sql`SELECT * FROM users WHERE email = ${data.email}`;

    if (row.length === 0) return NextResponse.json({err : 'user not found'});

    const currentUser = row[0];
    // de-hashing
    const match = await bcrypt.compare(data.user_password, currentUser.user_password);

    if (!match) {
      return NextResponse.json({err : 'Wrong email or password'});
    } else {
        // if match, we create the session with a unique token
        const token = crypto.randomBytes(32).toString("hex");

        // token and session insert
        await sql`
            INSERT INTO sessions (token, user_id, expires_at)
            VALUES (${token}, ${currentUser.id}, NOW() + INTERVAL '7 days')
        `;

        // cookie creation
        (await cookies()).set({
        name: "session",
        value: token,
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7   // 7 jours
    });
      return NextResponse.json({userData : currentUser, success : true});
    };

  } catch (err) {
          return NextResponse.json({error : String(err)});
  }
};