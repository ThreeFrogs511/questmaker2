import postgres from "postgres";
import { NextResponse } from "next/server";

export async function fetchInventoryData(
  sql: postgres.Sql<{}>,
  userId: number,
) {
  const r =
    await sql`SELECT u.id as global_user_id, u.profile_completed, u.coins, u.dopamine_consumed, u.damage_taken, u.hp, u.dopamine, i.inventory_id, i.slug, 
          i.user_id as inventory_user_id, i.quantity::int4 AS quantity FROM users u LEFT JOIN inventory i ON u.id = i.user_id WHERE u.id = ${userId}`;

  if (!r || r.length === 0)
    return NextResponse.json({ err: "pas d'user existant" });

  const inventory = r.map((n) => {
    return {
      inventory_id: n.inventory_id,
      slug: n.slug,
      quantity: n.quantity,
    };
  });
  // returning the successful response with the user object
  return NextResponse.json({
    authenticated: true,
    user: {
      id: r[0].global_user_id,
      coins: r[0].coins,
      dopamine_consumed: r[0].dopamine_consumed,
      damage_taken: r[0].damage_taken,
      hp: r[0].hp,
      dopamine: r[0].dopamine,
      profile_completed: r[0].profile_completed,
    },
    inventory: inventory,
  });
}
