"use server";
import { sql } from "@/server/connexion";
import { Item as ItemType, Character } from "@/types/types";
import { checkAuth } from "@/lib/auth/checkAuth";
import movesets from '@/assets/movesets.json';

export async function updatePlayerDataAfterWeaponUse(item:ItemType, character:Character) {
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


    //equip or desequip
    let movesetToBeInserted;
    if (!item.equipped) {
        movesetToBeInserted = movesets.find(n => {
            n.for?.includes(item.slug ?? "");
        });
    } else {
        movesetToBeInserted = movesets.find(n => {
            if (character?.race === "Felinois") {
                return n.name === "scratch"
            } else {
                return n.name === "scratch"
            }
        });
    }

    if (!movesetToBeInserted) return {err:"Error while fetching move data"};

    const r = await sql`WITH 
    updt_inv AS (
    UPDATE inventory set equipped = NOT equipped
    WHERE character_id = (SELECT character_id FROM characters WHERE user_id = ${userId}) AND slug = ${item.slug}
    RETURNING equipped),

    skills AS (
    DELETE FROM movesets 
    WHERE character_id = (SELECT character_id from characters WHERE user_id = ${userId})
    AND type = "basic_skill" OR type = "weapon_skill"),

    add_move AS (
    INSERT INTO movesets(type, name, modifier, lvl_required, dopamine_required, dmg, character_id) 
    VALUES (${movesetToBeInserted.type}, ${movesetToBeInserted.name}, ${movesetToBeInserted.modifier}, ${movesetToBeInserted.lvl_required}, ${movesetToBeInserted.dopamine_required}, ${movesetToBeInserted.dmg}, (SELECT character_id from characters WHERE user_id = ${userId})
    RETURNING moveset_id)
    )

    SELECT * FROM movesets WHERE character_id = (SELECT character_id from characters WHERE user_id = ${userId}) AND moveset_id = (SELECT moveset_id FROM add_move)

    `;

    if (!r[0]) return {err:"No associated character found"};

    return {success:true, moveset:r[0]};

  } catch (err) {
    // console.log((err as Error).message)
    return { err: "Internal error"};
  }
}
