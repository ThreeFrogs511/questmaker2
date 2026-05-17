import { NextResponse } from "next/server";
import { sql } from "@/server/connexion";
import bcrypt from "bcrypt";
import { cookies } from "next/headers";
import crypto from "crypto";
import validateRegistrationInput from "@/lib/validateRegistrationInput";
import * as jose from "jose";

interface PayloadType {
  userId: number;
  email: string;
  isCompleted: boolean;
}
// when the user finish their profile after signing up
export async function PATCH(request: Request) {
  try {
    const cookieStore = await cookies();
    // const token = cookieStore.get("session")?.value;
    const jwt = cookieStore.get("auth")?.value;

    // checking if the token exists
    if (!jwt) return NextResponse.json({ err: "Not authenticated" });

    const secretKey = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload }: { payload: PayloadType } = await jose.jwtVerify(
      jwt,
      secretKey,
    );
    const id: number = payload.userId;
    const email: string = payload.email;

    const data = await request.json();

    if (!id || !email) return NextResponse.json({ error: "User not found" });

    const result = await sql`
    UPDATE users SET
      race = ${data.race},
      user_class = ${data.user_class},
      str = ${data.str},
      dex = ${data.dex},
      con = ${data.con},
      int = ${data.int},
      wis = ${data.wis},
      cha = ${data.cha},
      username = ${data.username},
      gender = ${data.gender},
      lvl = ${1},
      xp = ${0},
      hp = ${data.hp},
      profile_completed = ${true},
      damage_taken = ${0},
      dopamine = ${data.dopamine},
      dopamine_consumed = ${0},
      ac = ${data.ac}
    WHERE id = ${id}
    `;

    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const alg = "HS256";

    const newPayload = {
      userId: id,
      email: email,
      isCompleted: true,
    };

    const newJwt = await new jose.SignJWT(newPayload)
      .setProtectedHeader({ alg })
      .setIssuedAt()
      .setExpirationTime("7d")
      .sign(secret);

    // cookie creation
    (await cookies()).set({
      name: "auth",
      value: newJwt,
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return NextResponse.json({ success: true, data: result, id: id});
  } catch (err) {
    return NextResponse.json({ error: String(err) });
  }
}
