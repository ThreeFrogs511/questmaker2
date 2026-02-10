import { NextResponse } from "next/server";
import { sql } from "@/server/connexion";
import bcrypt from "bcrypt";
import { cookies } from "next/headers";
import crypto from "crypto";
import validateRegistrationInput from "@/middlewares/validateRegistrationInput";

//middleware
// function validateRegistrationInput(
//   email: string,
//   password: string,
//   confirm: string,
// ) {
//   const emailRegex =
//     /^(?=.{1,254}$)(?=.{1,64}@)[A-Za-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[A-Za-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?\.)+[A-Za-z]{2,63}$/;
//   const passwordRegex =
//     /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~€£¥§°])[A-Za-z\d!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~€£¥§°]{12,}$/;

//   if (!email || !password || !confirm) throw new Error("All fields required");

//   if (!emailRegex.test(email)) throw new Error("Invalid email");

//   if (password !== confirm) throw new Error("Password mismatch");

//   if (!passwordRegex.test(password))
//     throw new Error(
//       "Invalid password: at least 12+ chars, 1 uppercase, 1 lowercase, 1 digit, 1 special character.",
//     );
// }

// returns true if the error thrown is an object
function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}
// sign up
export async function POST(request: Request) {
  try {
    const data = await request.json();

    validateRegistrationInput(data.email, data.password, data.confirm);

    // hashing
    const hash = await bcrypt.hash(data.password, 10);

    // executing the query
    const result = await sql`
      INSERT INTO users (email, user_password, profile_completed)
      VALUES (${data.email}, ${hash}, ${false})
      RETURNING id
      `;

    const insertedId = result[0]?.id;

    if (!insertedId) throw new Error("Internal error, please try again");

    // we create the session with a unique token
    const token = crypto.randomBytes(32).toString("hex");

      // first, we make sure expired sessions are deleted
    await sql`DELETE FROM sessions WHERE expires_at <= now();`;

    // token and session insert
    await sql`
            INSERT INTO sessions (token, user_id, expires_at)
            VALUES (${token}, ${insertedId}, NOW() + INTERVAL '7 days')`;

    // cookie creation
    (await cookies()).set({
      name: "session",
      value: token,
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return NextResponse.json({ success: true, id: insertedId });
  } catch (err: unknown) {
    //handles email duplicates
    if (isRecord(err)) {
      const code = err["code"];
      const constraint = err["constraint"] ?? err["constraint_name"];

      if (code === "23505" && constraint === "users_email_unique") {
        return NextResponse.json({ err: "Email already in use" });
      }
    }

    return NextResponse.json({ err: String(err) });
  }
}
