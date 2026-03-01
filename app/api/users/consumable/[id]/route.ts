import { NextResponse } from "next/server";
import { sql } from "@/server/connexion";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const data = await request.json();

    if (!id) return NextResponse.json({ error: "User id not found" });

    const ALLOWED = ["damage_taken", "dopamine_consumed"];
    const col = ALLOWED.find((n) => n === data.effectTarget);

    let r;
    switch (data.effectTarget) {
      case "damage_taken":
        r = await sql`UPDATE users SET damage_taken = (
          CASE
          WHEN damage_taken + ${data.effectValue} < 0 THEN 0
          ELSE damage_taken + ${data.effectValue} 
          END
        )
        WHERE id = ${id} 
        RETURNING damage_taken AS target`;
        break;

      case "dopamine_consumed":
        r = await sql`UPDATE users SET dopamine_consumed = (
          CASE
          WHEN dopamine_consumed + ${data.effectValue} < 0 THEN 0
          ELSE dopamine_consumed + ${data.effectValue} 
          END
        )
        WHERE id = ${id} 
        RETURNING dopamine_consumed AS target`;

      default:
        break;
    }

    if (!r || r[0].length <= 0)
      return NextResponse.json({ error: "error while updating database" });

    let i;
    if (Number(data.quantity) <= 1) {
      i =
        await sql`DELETE FROM inventory WHERE slug = ${data.slug} AND user_id = ${id} RETURNING slug`;
    } else {
      i =
        await sql`UPDATE inventory SET quantity = quantity - 1 WHERE slug = ${data.slug} AND user_id = ${id} RETURNING quantity`;
      if (!i || i[0].length <= 0)
        return NextResponse.json({ error: "error while updating database" });
    }

    const inventoryUpdated =
      await sql`SELECT * FROM inventory WHERE user_id = ${id}`;

    // if (inventoryUpdated[0].length <= 0) return NextResponse.json({error:"error while updating database"});

    return NextResponse.json({
      success: true,
      inventory: inventoryUpdated,
      effectTarget: r[0].target,
    });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message });
  }
}
