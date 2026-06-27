import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { PayloadType } from "@/types/types";
import * as jose from "jose";

//check if a user is allowed to perform an API call
//protection against malicious api calls
export async function checkAuth() {
  const cookieStore = await cookies();
  const jwt = cookieStore.get("auth")?.value;

  if (!jwt) throw new Error("Not authenticated");

  const secretKey = new TextEncoder().encode(process.env.JWT_SECRET);
  const { payload }: { payload: PayloadType } = await jose.jwtVerify(
    jwt,
    secretKey,
  );
  const userId: number = payload.userId;
  return userId;
};
