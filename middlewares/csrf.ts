import crypto from "crypto";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function generateCsrfToken(
  request: NextRequest,
  res: NextResponse,
) {
  // const newToken = crypto.randomBytes(32).toString("hex");

  // (await cookies()).set({
  //   name: "csrf",
  //   value: newToken,
  //   httpOnly: false,
  //   secure: true,
  //   sameSite: "strict",
  //   path: "/",
  //   maxAge: 60 * 30,
  // });

  res.cookies.set({
    name: "csrf",
    value: crypto.randomUUID(),
    httpOnly: false,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 30,
  });
}
