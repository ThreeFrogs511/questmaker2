"use server";
import { sql } from "@/server/connexion";
import { cookies } from "next/headers";
import * as jose from "jose";
import { PayloadType } from "@/types/types";

export async function fetchQuests() {
  try {
    // cookies
    const cookieStore = await cookies();
    // const token = cookieStore.get("session")?.value;
    const jwt = cookieStore.get("auth")?.value;

    // checking if the token exists
    if (!jwt) return { err: "Not authenticated" };

    const secretKey = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload }: { payload: PayloadType } = await jose.jwtVerify(
      jwt,
      secretKey,
    );
    const userId: number = payload.userId;

    if (!userId) return { err: "No user id attached" };

    const r = await sql`SELECT * from quests WHERE user_id = ${userId}`;

    if (!r) return { err: "Error while fetching user's quests" };
    if (r.length === 0) return { success: true, quests: [] };

    const allQuests = r.map((n) => {
      return {
        quest_id: n.quest_id,
        body: n.body,
        completed: n.completed,
        user_id: n.user_id,
      };
    });

    return {
      success: true,
      quests: allQuests,
    };
  } catch (err) {
    return {err:"Internal error. Please try again."}
  }
}
