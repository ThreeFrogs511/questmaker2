import { NextResponse } from "next/server";
import { sql } from "@/server/connexion";
import { checkAuth } from "@/lib/auth/checkAuth";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const userId = await checkAuth();
    const { id } = await params;
    if (!id) return NextResponse.json({ error: "no user id found" });
    if (userId !== parseInt(id)) return NextResponse.json({ error: "Action not allowed" }, { status: 401 });

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
