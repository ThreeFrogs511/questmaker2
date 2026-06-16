"use server";
import { sql } from "@/server/connexion";
import * as jose from "jose";
import { cookies } from "next/headers";
import { PayloadType } from "@/types/types";

export default async function fetchCampaign() {
  try {
    // const {userId} = await params;
    const cookie = (await cookies()).get("auth");
    const jwt = cookie?.value;

    // if no token, redirect to title screen
    if (!jwt) return {err :"No token"};

    const secretKey = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload }: { payload: PayloadType } = await jose.jwtVerify(
      jwt,
      secretKey,
    );
    
    if (!payload || !payload?.userId) return { err: "no user found" };
    let userId = payload.userId;

    const r =
      await sql`SELECT last_chapter_done FROM users WHERE user_id = ${userId}`;
    const lastChapter= r[0].last_chapter_done;
    let currentCampaign;

    if (lastChapter<=0) {
      currentCampaign =
        await sql`SELECT * FROM dnd_campaign_index WHERE chapter = 1`;
    } else {
      currentCampaign =
        await sql`SELECT * FROM dnd_campaign_index WHERE chapter = ${lastChapter+1}`;
    }

    return currentCampaign[0];
  } catch (err) {
    return { err: "Internal error" };
  }
}
