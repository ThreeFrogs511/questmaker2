import { NextResponse } from "next/server";
import { sql } from "@/server/connexion";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    if (!id) return NextResponse.json({ error: "no user id found" });

    const { xp, damage_taken, dopamine_consumed, coins } = await request.json();

    await sql`
      UPDATE characters
      SET xp = ${xp},
          damage_taken = ${damage_taken},
          dopamine_consumed = ${dopamine_consumed},
          coins = ${coins}
      WHERE user_id = ${id}
    `;

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message });
  }
}
