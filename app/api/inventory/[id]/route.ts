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


    //fetching all inventory and character coins data
    const userInventory = await sql`
      SELECT i.slug, i.user_id AS inventory_user_id, i.quantity,
             c.coins, u.user_id AS global_user_id
      FROM users u
      LEFT JOIN characters c ON u.user_id = c.user_id
      LEFT JOIN inventory i ON u.user_id = i.user_id
      WHERE u.user_id = ${id}`;

    let updateInventory;

    
    if (userInventory[0].coins<item.price) {
      return NextResponse.json({broke:true})
    };
    // checking if the user already possess the item in their inventory or not
    // updating if they have, inserting if not
    const match = userInventory.filter((n) => n.slug === item.slug);

    if (match.length > 0) {
      updateInventory = await sql`UPDATE inventory SET quantity = quantity + 1 WHERE slug = ${item.slug} 
      RETURNING slug, quantity::int4 AS quantity`;

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

      const q = await sql`UPDATE characters SET coins = coins - ${item.price} WHERE user_id = ${id} RETURNING coins`

      return NextResponse.json({
        success: true,
        items: newInventory,
        coins: Number(q[0].coins),
      });

    } else {

        updateInventory =
        await sql`INSERT INTO inventory(slug, user_id, quantity) VALUES (${item.slug}, ${id}, 1) 
        RETURNING slug, quantity::int4 AS quantity`;
      
        if (updateInventory[0].length <= 0) return NextResponse.json({ error: "error while updating inventory" });
      
        userInventory.push(updateInventory[0]);
      
        const q = await sql`UPDATE characters SET coins = coins - ${item.price} WHERE user_id = ${id} RETURNING coins`

        return NextResponse.json({
            success: true,
            items: userInventory,
            coins: Number(q[0].coins),
        });
    };
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    if (!id) return NextResponse.json({ error: "no user id found" });

    const { inventory } = await request.json();

    if (!Array.isArray(inventory)) {
      return NextResponse.json({ error: "invalid inventory payload" });
    }

    // Update quantities for all remaining items
    for (const item of inventory) {
      await sql`UPDATE inventory SET quantity = ${item.quantity} WHERE slug = ${item.slug} AND user_id = ${id}`;
    }

    // Delete items that were fully consumed (no longer in the inventory)
    if (inventory.length > 0) {
      const slugs = inventory.map((i: { slug: string }) => i.slug);
      await sql`DELETE FROM inventory WHERE user_id = ${id} AND slug != ALL(${slugs})`;
    } else {
      await sql`DELETE FROM inventory WHERE user_id = ${id}`;
    }

    return NextResponse.json({ success: true });
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

    const q = await sql`UPDATE characters SET coins = coins + ${item.price} WHERE user_id = ${id} RETURNING coins`;

    const list = await sql`SELECT * FROM inventory WHERE user_id = ${id} `

    return NextResponse.json({ list: list, success: true, coins: Number(q[0].coins) });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message});
  }
}
