import { cookies } from "next/headers";
import { NextRequest } from "next/server";
import { PayloadType } from "@/types/types";
import * as jose from "jose";

export async function checkAuth(request?: Request) {
  const jwt = request
    ? (request as NextRequest).cookies.get("auth")?.value
    : (await cookies()).get("auth")?.value;

  if (!jwt) throw new Error("Not authenticated");

  const secretKey = new TextEncoder().encode(process.env.JWT_SECRET);
  const { payload }: { payload: PayloadType } = await jose.jwtVerify(
    jwt,
    secretKey,
  );
  const userId: number = payload.userId;
  return userId;
};
