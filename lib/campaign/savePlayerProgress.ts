"use server";
import { sql } from "@/server/connexion";
import * as jose from "jose";
import { cookies } from "next/headers";
import { PayloadType } from "@/types/types";
import { Character, Item, Moveset } from "@/types/types";

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

    const userId = Number(payload.userId);

    if (!tempPlayerData || !tempPlayerData.character_id || !userId)
      throw new Error("no user found");

    const formattedInventoryArrayForSql = tempInventory.map((n) => {
      return {
        slug: n.slug,
        user_id: userId,
        quantity: n.quantity,
        item_type: n.type,
        equipped: n.equipped ?? false,
      };
    });

    const formattedMovesetsArrayForSql = tempMovesets.map((n) => {
      return {
        type: n.type,
        name: n.name,
        character_id: n.character_id,
        is_skill_activated: n.is_skill_activated ?? false,
      };
    })
    .filter(n => n.type !== "action")
    .filter(n => n.name !== undefined)

   //we update the player's data : character, movesets, inventory (if it's not empty)
    let r;
    if (formattedInventoryArrayForSql.length <= 0) {
      console.log("empty inventory")
      r = await sql`WITH 
      updt_user AS (
      update users set tutorial_completed = TRUE WHERE user_id = ${userId}
      ),
      updt_char AS (
        UPDATE characters SET 
            user_class  = ${tempPlayerData.user_class},
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
            WHERE character_id = ${tempPlayerData.character_id} AND user_id = ${userId}
            RETURNING user_id
        ),
        dlt_inv AS (DELETE from inventory WHERE user_id = ${userId}),

        reset_mvst AS (DELETE FROM movesets WHERE character_id = ${tempPlayerData.character_id}),

        insert_mvst AS (INSERT INTO movesets ${sql(formattedMovesetsArrayForSql, 'type', 'name', 'character_id', 'is_skill_activated')} 
        ON CONFLICT (name, character_id)
        DO UPDATE
        SET is_skill_activated = EXCLUDED.is_skill_activated
        )

        SELECT user_id FROM updt_char`;
    } else {
      console.log("normal inventory")
      r = await sql`WITH  
      updt_user AS (
      update users set tutorial_completed = TRUE WHERE user_id = ${userId}
      ),
      updt_char AS (
        UPDATE characters SET 
            user_class  = ${tempPlayerData.user_class},
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
            WHERE character_id = ${tempPlayerData.character_id} AND user_id = ${userId}
            RETURNING user_id
        ),

        reset_inv AS (DELETE from inventory WHERE user_id = ${userId}
        ),

        reset_mvst AS (DELETE FROM movesets WHERE character_id = ${tempPlayerData.character_id}),

        insert_mvst AS (INSERT INTO movesets ${sql(formattedMovesetsArrayForSql, 'type', 'name', 'character_id', 'is_skill_activated')} 
        ON CONFLICT (name, character_id)
        DO UPDATE
        SET is_skill_activated = EXCLUDED.is_skill_activated
        )
        
        INSERT INTO inventory ${sql(formattedInventoryArrayForSql, 'slug', 'user_id', 'quantity', 'item_type', 'equipped')} 
        ON CONFLICT (slug, user_id)
        DO UPDATE
        SET quantity= EXCLUDED.quantity, equipped = EXCLUDED.equipped
        RETURNING user_id
       `;
    }

    if (!r[0]) throw new Error("Error while logging data");

    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const alg = "HS256";

    const newJwt = await new jose.SignJWT({
      ...payload,
      tutorialCompleted: true,
      lastChapterDone: 1
    })
      .setProtectedHeader({ alg })
      .setIssuedAt()
      .setExpirationTime("7d")
      .sign(secret);

    (await cookies()).set({
      name: "auth",
      value: newJwt,
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return { success: true };
  } catch (err) {
    console.log((err as Error).message);
    return { err: (err as Error).message };
  }
}
