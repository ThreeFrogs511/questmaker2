import { NextResponse } from "next/server";
import { sql } from "@/server/connexion";
import { cookies } from "next/headers";
import crypto from "crypto";
import bcrypt from "bcrypt";

// checking if edit input are valid
async function validateProfileEditInput(
  email: string,
  currentPassword: string | null,
  newPassword: string | null,
  id: string,
) {
  const emailRegex =
    /^(?=.{1,254}$)(?=.{1,64}@)[A-Za-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[A-Za-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?\.)+[A-Za-z]{2,63}$/;
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~€£¥§°])[A-Za-z\d!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~€£¥§°]{12,}$/;

  if (!email) throw new Error("You must have a email adress");

  if (!emailRegex.test(email)) throw new Error("Invalid email");

  if (currentPassword && !newPassword)
    throw new Error("You must fill all the password inputs");

  if (!currentPassword && newPassword)
    throw new Error("You must fill all the password inputs");

  //checking if the currentPassword input is correct
  const r = await sql`SELECT user_password FROM users WHERE id = ${id}`;

  if (currentPassword) {
      if (r[0].rowCount === 0) throw new Error("Erreur id");
  const match = await bcrypt.compare(currentPassword ?? "", r[0].user_password);
  if (!match) throw new Error("Wrong password");

  }



  if (newPassword && !passwordRegex.test(newPassword))
    throw new Error(
      "Invalid password: at least 12+ chars, 1 uppercase, 1 lowercase, 1 digit, 1 special character.",
    );
}

//checking csrf token
async function checkTokenCSRF(request: Request) {
  // getting csrf cookie
  const cookieStore = await cookies();
  const cookieToken = cookieStore.get("csrf")?.value;

  //header cookie
  const headerToken = request.headers.get("X-CSRF-Token");

  if (!cookieToken || !headerToken)
    throw new Error("You are not allowed to do this action");
  if (headerToken !== cookieToken)
    throw new Error("You are not allowed to do this action");
};

// editing the profil
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const data = await request.json();
    if (!id) throw new Error("no user id found");

    const email = data.email.trim();
    const currentPassword = data.currentPassword
      ? data.currentPassword.trim()
      : null;
    const newPassword = data.newPassword ? data.newPassword.trim() : null;

    //middlewares
    await checkTokenCSRF(request);
    await validateProfileEditInput(email, data.currentPassword, data.newPassword, id);

    let r;
    if (!currentPassword && !newPassword) {
      r =
        await sql`UPDATE users SET email = ${data.email} WHERE id = ${id} RETURNING id`;
    } else {
      const hash = await bcrypt.hash(data.newPassword, 10);
      r =
        await sql`UPDATE users SET email = ${data.email}, user_password = ${hash}  WHERE id = ${id} RETURNING id`;
    }

    if (r[0].rowCount <= 0) throw new Error("internal error");

    return NextResponse.json({ newEmail: data.email, success: true });
  } catch (err: any) {
    return NextResponse.json({ success: false, err: err.message });
  }
}

//fetching email
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    if (!id) throw new Error("no user id found");

    const r = await sql`SELECT email FROM users WHERE id = ${id}`;
    if (!r[0].email) throw new Error("no email found");

    return NextResponse.json({ success: true, email: r[0].email });
  } catch (err: any) {
    return NextResponse.json({ success: false, err: err.message });
  }
}
