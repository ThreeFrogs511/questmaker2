import { NextResponse } from "next/server";
import { signupUser } from "@/lib/auth/signup";

export async function POST(request: Request) {
  const data = await request.json();
  const result = await signupUser(data.email, data.password, data.confirm);
  return NextResponse.json(result);
}
