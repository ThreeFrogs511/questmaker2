import crypto from "crypto";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function generateCsrfToken() {

  const cookieStore = await cookies();
  const token = cookieStore.get("csrf")?.value;

  // checking if the csrf token exists
  if (!token) {
    const newToken = crypto.randomBytes(32).toString("hex");

    (await cookies()).set({
      name: "csrf",
      value: newToken,
      httpOnly: false,
      secure: true,
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });
  }
  
}
