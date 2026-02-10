import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import crypto from "crypto";

export async function GET(request: Request) {
  try {
    const token = crypto.randomBytes(32).toString("hex");

    (await cookies()).set({
      name: "csrf",
      value: token,
      httpOnly: false,
      secure: true,
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 30,
    });

    return NextResponse.json({success:true})
  } catch (err) {
    return NextResponse.json({ err: (err as Error).message }, { status: 401 });
  }
}
