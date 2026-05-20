import { NextResponse } from "next/server";
import { sql } from "@/server/connexion";
import bcrypt from "bcrypt";
import { cookies } from "next/headers";
import validateLoginInput from "@/lib/validateLoginInput";
import * as jose from "jose";

//login the user
export async function POST(request: Request) {
  try {
    const data = await request.json();
    validateLoginInput(data.email, data.user_password);

    // the 'sql' template tag protects the database from sql injection
    const row = await sql`SELECT * FROM users WHERE email = ${data.email}`;

    //if no email found
    if (row.length === 0) return NextResponse.json({ err: "user not found" });

    const currentUser = row[0];

    // checking if there's a match between the password input and the hashed password
    const match = await bcrypt.compare(
      data.user_password,
      currentUser.user_password,
    );

    if (!match) return NextResponse.json({ err: "Wrong email or password" });

    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const alg = "HS256";

    const payload = {
      userId: currentUser.id,
      email: currentUser.email,
      isCompleted: currentUser.profile_completed,
    };

    const jwt = await new jose.SignJWT(payload)
      .setProtectedHeader({ alg })
      .setIssuedAt()
      .setExpirationTime("7d")
      .sign(secret);

    // cookie creation
    (await cookies()).set({
      name: "auth",
      value: jwt,
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });
  
    // cleaning the user object, removing the password client-side
    const { user_password, email, ...safeUser } = currentUser;

    return NextResponse.json({ userData: safeUser, success: true });
  } catch (err) {
    return NextResponse.json({ err: (err as Error).message });
  }
}
