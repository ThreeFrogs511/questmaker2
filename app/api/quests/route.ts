import { sql } from "@/server/connexion";
import { NextResponse, NextRequest } from "next/server";
import { checkAuth } from "@/lib/auth/checkAuth";

export async function POST(request: NextRequest) {
  try {
    const user_id = await checkAuth(request);
    const data = await request.json();

    if (data.completed === null || data.completed === undefined)
      throw new Error("error while sending quest completion state");
    if (!data.body || data.body.trim() === "")
      throw new Error("quests can not be empty");

    const result = await sql`
      INSERT INTO quests (body, completed, user_id)
      VALUES (${data.body}, ${data.completed}, ${user_id})
      RETURNING quest_id, body, completed, user_id
    `;

    const insertedQuest = result[0];

    if (!insertedQuest) throw new Error("error while submitting the quest");

    return NextResponse.json({ success: true, quest: insertedQuest });
  } catch (err) {
    return NextResponse.json({ err: (err as Error).message });
  }
}
