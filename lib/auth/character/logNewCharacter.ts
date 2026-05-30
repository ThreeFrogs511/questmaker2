"use server";
import { sql } from "@/server/connexion";
import { cookies } from "next/headers";
import * as jose from "jose";
import { Character } from "@/types/types";
import { PayloadType } from "@/types/types";


export default async function logNewCharacter(data: Character) {
  try {
    const cookieStore = await cookies();
    const jwt = cookieStore.get("auth")?.value;

    // checking if the token exists
    if (!jwt) return { err: "Not authenticated" };

    const secretKey = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload }: { payload: PayloadType } = await jose.jwtVerify(
      jwt,
      secretKey,
    );
    const user_id: number = payload.userId;
    const email: string = payload.email;

    if (!user_id || !email) return { err: "User not found" };

    const result = await sql`
      INSERT INTO characters (user_class, username, race, gender, hp, dopamine, ac, str, dex, con, int, wis, cha, user_id)
      VALUES (${data.user_class}, ${data.username}, ${data.race}, ${data.gender}, ${data.hp}, ${data.dopamine}, ${data.ac}, ${data.str}, ${data.dex}, ${data.con}, ${data.int}, ${data.wis}, ${data.cha}, ${user_id})
      RETURNING character_id
    `;

    
    await sql`UPDATE users SET profile_completed = true WHERE user_id = ${user_id}`;
    console.log(result)
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const alg = "HS256";

    const newPayload = {
      userId: user_id,
      email: email,
      isCompleted: true,
      tutorialCompleted:false,
      lastChapterDone:null
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

    return { success: true };
  } catch (err) {
    const error = String((err as Error).message)
    return { err: error };
  }
}
