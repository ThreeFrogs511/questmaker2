"use server";
import { sql } from "@/server/connexion";
import { cookies } from "next/headers";
import { PayloadType, Item as ItemType } from "@/types/types";
import * as jose from "jose";

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

    const cookie = (await cookies()).get("auth");
    const jwt = cookie?.value;
    if (!jwt) return {err:"Authentification error"};
    const secretKey = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload }: { payload: PayloadType } = await jose.jwtVerify(
      jwt,
      secretKey,
    );
    const userId = payload.userId;
    if (!userId) return {err:"Authentification error"}

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
    console.log((err as Error).message)
    return { err: "Internal error"};
  }
}
