"use server";
import { sql } from "@/server/connexion";
import { checkAuth } from "@/lib/auth/checkAuth";

export default async function fetchCampaign() {
  try {
    const userId = await checkAuth();

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
