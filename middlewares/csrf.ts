import crypto from "crypto";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function generateCsrfToken() {

    const newToken = crypto.randomBytes(32).toString("hex");

    (await cookies()).set({
      name: "csrf",
      value: newToken,
      httpOnly: false,
      secure: true,
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 30,
    });
  
  
}
