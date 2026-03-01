import { MongoClient, ObjectId } from "mongodb";
import { NextResponse } from "next/server";
import { sql } from "@/server/connexion";


export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    if (!id) return NextResponse.json({ error: "no user id found" });
    const item = await request.json();


    //fetching all inventory and user coins data
    const userInventory = await sql`SELECT i.inventory_id, i.slug, i.user_id AS inventory_user_id, i.quantity, 
    u.coins, u.id AS global_user_id FROM users u LEFT JOIN inventory i ON u.id = i.user_id WHERE u.id = ${id} ORDER BY inventory_id DESC`;

    let updateInventory;

    
    if (userInventory[0].coins<item.price) {
      return NextResponse.json({broke:true})
    };
    // checking if the user already possess the item in their inventory or not
    // updating if they have, inserting if not
    const match = userInventory.filter((n) => n.slug === item.slug);

    if (match.length > 0) {
      updateInventory = await sql`UPDATE inventory SET quantity = quantity + 1 WHERE slug = ${item.slug} 
      RETURNING inventory_id, slug, quantity::int4 AS quantity`;

      if (updateInventory[0].length <= 0) return NextResponse.json({ error: "error while updating inventory" });

      const newInventory = userInventory.map(n => {
        if (n.slug === item.slug) {
           return {
            ...n,
            quantity: Number(n.quantity) + 1 
           }
        } else {
            return n;
        }
      }).sort((a,b) => b.inventory_id - a.inventory_id);

      const q = await sql`UPDATE users set coins = coins-${item.price} WHERE id = ${id} RETURNING coins`

      return NextResponse.json({
        success: true,
        items: newInventory,
        coins:q[0].coins
      });

    } else {

        updateInventory =
        await sql`INSERT INTO inventory(slug, user_id, quantity) VALUES (${item.slug}, ${id}, 1) 
        RETURNING inventory_id, slug, quantity::int4 AS quantity`;
      
        if (updateInventory[0].length <= 0) return NextResponse.json({ error: "error while updating inventory" });
      
        userInventory.push(updateInventory[0]);
      
        const q = await sql`UPDATE users set coins = coins-${item.price} WHERE id = ${id} RETURNING coins`

        return NextResponse.json({
            success: true,
            items: userInventory,
            coins: q[0].coins
        });
    };
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    if (!id) return NextResponse.json({ error: "no id found" });

    const item = await request.json();
    const slug = item.slug;

    if (Number(item.quantity) <= 1) {
      await sql`DELETE FROM inventory WHERE slug = ${item.slug} AND user_id = ${id}`;
    } else {
      await sql`UPDATE inventory SET quantity = quantity - 1 WHERE slug = ${slug} AND user_id = ${id}`;
    }

    const q = await sql`UPDATE users set coins = coins + ${item.price} WHERE id = ${id} RETURNING coins`;

    const list = await sql`SELECT * FROM inventory WHERE user_id = ${id} ORDER BY inventory_id DESC`

    return NextResponse.json({list:list, success:true, coins: q[0].coins});
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message});
  }
}
