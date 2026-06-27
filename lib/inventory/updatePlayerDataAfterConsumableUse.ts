"use server";
import { sql } from "@/server/connexion";
import { Item as ItemType } from "@/types/types";
import { checkAuth } from "@/lib/auth/checkAuth";

export async function updatePlayerDataAfterConsumableUse(item:ItemType) {
  try {
    if (
      !item ||
      !item.slug||
      !item.quantity ||
      !item.effectTarget ||
      !item.effectValue ||
      !item.effectType
    )
      return {err:"Invalid item data"};

    const userId = await checkAuth();

    type dynamicQueryObjectType = {
      target: number;
    };
    const target = item.effectTarget as keyof dynamicQueryObjectType;
    const value = Number(item.effectValue);
    const effect = item.effectType;


    const r = await sql`WITH updt_inv AS (
    UPDATE inventory SET quantity = quantity - 1 WHERE character_id = (SELECT character_id FROM characters WHERE user_id = ${userId}) AND slug = ${item.slug}),

    dlt_inv AS (DELETE FROM inventory WHERE character_id = (SELECT character_id FROM characters WHERE user_id = ${userId}) AND slug = ${item.slug} AND quantity <= 1),

    updt_char AS (
    UPDATE characters SET ${sql(target)} = CASE
    WHEN ${effect} = 'reduce' THEN GREATEST(0, ${sql(target)} - ${value})
    ELSE ${sql(target)} + ${value}
    END
    WHERE user_id = ${userId}
    )

    SELECT * FROM characters WHERE user_id = ${userId} AND character_id = (SELECT character_id FROM characters WHERE user_id = ${userId})
    `;

    if (!r[0]) return {err:"No associated character found"};

    return {success:true, character:r[0]};

  } catch (err) {
    // console.log((err as Error).message)
    return { err: "Internal error"};
  }
}
