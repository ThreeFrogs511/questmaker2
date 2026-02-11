import { sql } from "@/server/connexion";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const data = await request.json();

    if (!data.user_id) throw new Error("no user found");
    if (data.completed === null || data.completed === undefined)
      throw new Error("error while sending quest completion state");
    if (!data.body || data.body.trim() === "")
      throw new Error("quests can not be empty");

    const result = await sql`
      INSERT INTO todo (body, completed, user_id)
      VALUES (${data.body}, ${data.completed}, ${data.user_id})
      RETURNING id, body, completed, user_id
    `;

    // returns the newly inserted entry/quest
    const insertedQuest = result[0];

    if (!insertedQuest) throw new Error("error while submitting the quest");

    return NextResponse.json({ success: true, quest: insertedQuest });
  } catch (err: unknown) {
    if (err instanceof Error) {
      return NextResponse.json({ error: err.message });
    }
    return NextResponse.json({ error: String(err) });
  }
}
