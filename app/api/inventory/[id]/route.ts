import { MongoClient, ObjectId } from "mongodb";
import { NextResponse } from 'next/server';
import { sql } from '@/server/connexion';

async function fetchingAllItems() {
    const client = new MongoClient(process.env.MONGODB_URI as string);
    await client.connect();

    const db = client.db(process.env.MONGODB_DB);
    const collection = db.collection("items");

    // const objectId = new ObjectId(id);
    const allItems = collection.find();

    await client.close();

    return allItems;
}



export async function GET(
request: Request,
{ params }: { params: Promise<{ id: string }> }) 
{

    try {
        const {id} = await params;
        if (!id) return NextResponse.json({error:"no id found"});

        const data = await sql`SELECT * FROM user_inventory WHERE user_id = ${id}`

        return NextResponse.json(data);

    } catch (err) {
        return NextResponse.json({error: "internal error"});
    }


}