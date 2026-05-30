"use server";
import { sql } from "@/server/connexion";
import bcrypt from "bcrypt";
import { cookies } from "next/headers";
import validateLoginInput from "@/lib/validateLoginInput";
import * as jose from "jose";
import { User } from "@/types/types";

export async function loginUser(
  email: string,
  password: string,
): Promise<{ success: true; userData: User } | { err: string }> {
  try {
    validateLoginInput(email, password);

    const row = await sql`SELECT * FROM users WHERE email = ${email}`;
    if (row.length === 0) return { err: "User not found" };

    const currentUser = row[0];

    const match = await bcrypt.compare(password, currentUser.password);
    if (!match) return { err: "Wrong email or password" };

    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const alg = "HS256";

    const jwt = await new jose.SignJWT({
      userId: currentUser.user_id,
      email: currentUser.email,
      isCompleted: currentUser.profile_completed,
      tutorialCompleted: currentUser.tutorial_completed,
      lastChapterDone: currentUser.last_chapter_done
    })
      .setProtectedHeader({ alg })
      .setIssuedAt()
      .setExpirationTime("7d")
      .sign(secret);

    (await cookies()).set({
      name: "auth",
      value: jwt,
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    const { password: _pw, ...safeUser } = currentUser;
    return { success: true, userData: safeUser as User };
  } catch (err) {
    return { err: (err as Error).message };
  }
}
