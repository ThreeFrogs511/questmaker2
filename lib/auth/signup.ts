"use server";
import { sql } from "@/server/connexion";
import bcrypt from "bcrypt";
import { cookies } from "next/headers";
import validateRegistrationInput from "@/lib/validateRegistrationInput";
import * as jose from "jose";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

export async function signupUser(
  email: string,
  password: string,
  confirm: string,
): Promise<{ success: true; id: number } | { err: string }> {
  try {
    const r = validateRegistrationInput(email, password, confirm);

    if (!r?.inputValid) {
      return { err: r?.err ?? "Invalid input" };
    }

    const hash = await bcrypt.hash(password, 10);

    const result = await sql`
      INSERT INTO users (email, password, last_chapter_done)
      VALUES (${email}, ${hash},0)
      RETURNING user_id
    `;

    const insertedId = result[0]?.user_id;

    if (!insertedId) return { err: "Internal error, please try again" };

    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const alg = "HS256";

    const jwt = await new jose.SignJWT({
      userId: insertedId,
      email: email,
      isCompleted: false,
      tutorialCompleted: false,
      lastChapterDone: null,
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

    return { success: true, id: insertedId };
  } catch (err: unknown) {
    if (isRecord(err)) {
      const code = err["code"];
      const constraint = err["constraint"] ?? err["constraint_name"];
      if (code === "23505" && constraint === "unique_email") {
        return { err: "Email already in use" };
      }
    }
    console.error(err);
    return { err: (err as Error).message };
  }
}
