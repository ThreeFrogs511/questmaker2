import { NextResponse } from "next/server";
import { sql } from "@/server/connexion";
import { cookies } from "next/headers";
import bcrypt from "bcrypt";
import * as jose from "jose";
import { checkAuth } from "@/lib/auth/checkAuth";



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
  const r = await sql`SELECT password FROM users WHERE user_id = ${id}`;

  if (currentPassword) {
    if (r[0].rowCount === 0) throw new Error("Erreur id");
    const match = await bcrypt.compare(
      currentPassword ?? "",
      r[0].password,
    );
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
}


// editing the profil
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const userId = await checkAuth(request);
    const { id } = await params;
    const data = await request.json();
    if (!id) return NextResponse.json({ err: "no user id found" });
    if (userId !== parseInt(id)) return NextResponse.json({ err: "Not authorized" }, { status: 401 });

    const email = data.email.trim();
    const currentPassword = data.currentPassword
      ? data.currentPassword.trim()
      : null;
    const newPassword = data.newPassword ? data.newPassword.trim() : null;

    //middlewares
    await checkTokenCSRF(request);
    await validateProfileEditInput(
      email,
      data.currentPassword,
      data.newPassword,
      id,
    );

    let r;
    if (!currentPassword && !newPassword) {
      r =
        await sql`UPDATE users SET email = ${data.email} WHERE user_id = ${id} RETURNING id`;
    } else {
      // hashing the new password
      const hash = await bcrypt.hash(data.newPassword, 10);
      r =
        await sql`UPDATE users SET email = ${data.email}, password = ${hash}  WHERE user_id = ${id} RETURNING id`;
    }

    if (r[0].rowCount <= 0) return NextResponse.json({ err: "internal error" });

    //storing the new email in the jwt token
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const alg = "HS256";

    const payload = {
      userId: id,
      email: data.email,
      isCompleted: true,
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

    return NextResponse.json({ newEmail: data.email, success: true });
  } catch (err) {
    return NextResponse.json({ success: false, err: (err as Error).message });
  }
}

//fetching email
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const userId = await checkAuth(request);
    const { id } = await params;
    if (!id) return NextResponse.json({ err: "no user id found" });
    if (userId !== parseInt(id)) return NextResponse.json({ err: "Not authorized" }, { status: 401 });

    const r = await sql`SELECT email FROM users WHERE user_id = ${id}`;
    if (!r[0].email) return NextResponse.json({ err: "no email found" });



    return NextResponse.json({ success: true, email: r[0].email });
  } catch (err) {
    return NextResponse.json({ success: false, err: (err as Error).message });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const userId = await checkAuth(request);
    const { id } = await params;
    if (!id) return NextResponse.json({ error: "Undefined user id" });
    if (userId !== parseInt(id)) return NextResponse.json({ error: "Not authorized" }, { status: 401 });

    await sql`
      DELETE FROM users
      WHERE user_id = ${userId}`;

    const cookie = await cookies();
    cookie.delete("auth");
    cookie.delete("csrf");

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: String(error) });
  }
}
