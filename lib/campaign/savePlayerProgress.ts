"use server";
import { sql } from "@/server/connexion";
import * as jose from "jose";
import { cookies } from "next/headers";
import { PayloadType } from "@/types/types";
import { Character, Item, Moveset } from "@/types/types";

interface tempCampaignDataPayload {
  tempPlayerData: Character;
  tempInventory: Item[];
  tempMovesets: Moveset[];
  originalInventory: Item[];
  originalMovesets: Moveset[];
}

export default async function savePlayerProgress(
  tempPlayerData: Character,
  tempInventory: Item[],
  tempMovesets: Moveset[],
  originalInventory: Item[],
  originalMovesets: Moveset[],
) {
  try {
    const cookie = (await cookies()).get("auth");
    const jwt = cookie?.value;
    // if no token, redirect to title screen
    if (!jwt) throw new Error("No token");

    const secretKey = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload }: { payload: PayloadType } = await jose.jwtVerify(
      jwt,
      secretKey,
    );

    const userId = payload.userId;

    //figuring out which items of the inventory are gone
    //to remove them in the sql database
    const itemsGone: [number][] | Array<number> = originalInventory
      .filter((i) => {
        let match = tempInventory.find((tempI) => i.slug === tempI.slug);
        if (!match) return i;
      })
      .map((n) => {
        return Number(n.inventory_id);
      });

    //formatting temporary inventory list for sql() function
    const formattedTempInvForSql: [number, number][] = tempInventory.map(
      (n) => {
        return [Number(n.inventory_id), Number(n.quantity)];
      },
    );

    let r;
    if (itemsGone.length <= 0) {
      r =
        await sql`WITH updt_char AS (UPDATE characters SET user_class  = ${tempPlayerData.user_class},
    username          = ${tempPlayerData.username},
    race              = ${tempPlayerData.race},
    gender            = ${tempPlayerData.gender},
    lvl               = ${tempPlayerData.lvl},
    xp                = ${tempPlayerData.xp},
    hp                = ${tempPlayerData.hp},
    damage_taken      = ${tempPlayerData.damage_taken},
    dopamine          = ${tempPlayerData.dopamine},
    dopamine_consumed = ${tempPlayerData.dopamine_consumed},
    ac                = ${tempPlayerData.ac},
    coins             = ${tempPlayerData.coins},
    str               = ${tempPlayerData.str},
    dex               = ${tempPlayerData.dex},
    con               = ${tempPlayerData.con},
    int               = ${tempPlayerData.int},
    wis               = ${tempPlayerData.wis},
    cha               = ${tempPlayerData.cha}
    WHERE character_id = ${tempPlayerData.character_id ?? null} AND user_id = ${userId}
    RETURNING user_id
    ),
    slct_invt AS (
    update inventory set quantity = (update_data.quantity)::int
    from (values ${sql(formattedTempInvForSql)}) as update_data (inventory_id, quantity)
    where inventory.inventory_id = (update_data.inventory_id)::int
    )

    SELECT user_id from updt_char`;
    } else {
      r =
        await sql`WITH updt_char AS (UPDATE characters SET user_class  = ${tempPlayerData.user_class},
    username          = ${tempPlayerData.username},
    race              = ${tempPlayerData.race},
    gender            = ${tempPlayerData.gender},
    lvl               = ${tempPlayerData.lvl},
    xp                = ${tempPlayerData.xp},
    hp                = ${tempPlayerData.hp},
    damage_taken      = ${tempPlayerData.damage_taken},
    dopamine          = ${tempPlayerData.dopamine},
    dopamine_consumed = ${tempPlayerData.dopamine_consumed},
    ac                = ${tempPlayerData.ac},
    coins             = ${tempPlayerData.coins},
    str               = ${tempPlayerData.str},
    dex               = ${tempPlayerData.dex},
    con               = ${tempPlayerData.con},
    int               = ${tempPlayerData.int},
    wis               = ${tempPlayerData.wis},
    cha               = ${tempPlayerData.cha}
    WHERE character_id = ${tempPlayerData.character_id ?? null} AND user_id = ${userId}
    RETURNING user_id
    ),
    slct_invt AS (
    update inventory set quantity = (update_data.quantity)::int
    from (values ${sql(formattedTempInvForSql)}) as update_data (inventory_id, quantity)
    where inventory.inventory_id = (update_data.inventory_id)::int
    ),
    dlt_empty_item AS (
    delete from inventory 
    where user_id = ${userId} and
    inventory_id in ${sql(itemsGone)}
    )

    SELECT user_id from updt_char`;
    }

    if (r[0].user_id) return { success: true };
  } catch (err) {
    return { err: (err as Error).message };
  }
}
