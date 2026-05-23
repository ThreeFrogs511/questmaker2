"use server";
import { sql } from "@/server/connexion";
import * as jose from "jose";
import { cookies } from "next/headers";

interface PayloadType {
  userId: number;
  email: string;
  isCompleted: boolean;
}

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
      await sql`SELECT last_campaign_done FROM users WHERE id= ${userId}`;
    const campaign_id = r[0].last_campaign_done;
    let currentCampaign;

    if (campaign_id === null) {
      currentCampaign =
        await sql`SELECT * FROM dnd_campaign_index WHERE chapter = 1`;
    } else {
      const lastCampaign =
        await sql`SELECT chapter FROM dnd_campaign_index WHERE mongo_id = ${campaign_id}`;
      const newChapter = parseInt(lastCampaign[0].chapter) + 1;
      currentCampaign =
        await sql`SELECT * FROM dnd_campaign_index WHERE chapter = ${newChapter}`;
    }

    return currentCampaign[0];
  } catch (err) {
    return { err: "Internal error" };
  }
}
