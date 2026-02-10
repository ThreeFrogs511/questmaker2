import { MongoClient, ObjectId } from "mongodb";
import { NextResponse } from 'next/server';


// async function fetchingCampaign(id:string) {
//     const client = new MongoClient(process.env.MONGODB_URI as string);
//     await client.connect();

//     const db = client.db(process.env.MONGODB_DB);
//     const collection = db.collection(process.env.MONGODB_COLLECTION_CAMPAIGNS as string);

//     const objectId = new ObjectId(id);
//     const currentCampaign = await collection.findOne({_id: objectId});

//     await client.close();

//     return currentCampaign;
//   }


async function fetchingCampaign(id: string) {
  console.log("[fetchingCampaign] start", {
    hasUri: Boolean(process.env.MONGODB_URI),
    db: process.env.MONGODB_DB,
    collection: process.env.MONGODB_COLLECTION_CAMPAIGNS,
    id,
    isObjectIdValid: ObjectId.isValid(id),
  });

  if (!process.env.MONGODB_URI) throw new Error("Missing env: MONGODB_URI");
  if (!process.env.MONGODB_DB) throw new Error("Missing env: MONGODB_DB");
  if (!process.env.MONGODB_COLLECTION_CAMPAIGNS) throw new Error("Missing env: MONGODB_COLLECTION_CAMPAIGNS");

  if (!ObjectId.isValid(id)) {
    console.error("[fetchingCampaign] invalid ObjectId", { id });
    return null;
  }

  const client = new MongoClient(process.env.MONGODB_URI);

  try {
    console.log("[fetchingCampaign] connecting...");
    await client.connect();
    console.log("[fetchingCampaign] connected");

    const db = client.db(process.env.MONGODB_DB);
    const collection = db.collection(process.env.MONGODB_COLLECTION_CAMPAIGNS);

    console.log("[fetchingCampaign] querying...");
    const objectId = new ObjectId(id);
    const currentCampaign = await collection.findOne({ _id: objectId });

    console.log("[fetchingCampaign] query result", { found: Boolean(currentCampaign) });
    return currentCampaign;
  } catch (err) {
    console.error("[fetchingCampaign] error", err);
    throw err;
  } finally {
    console.log("[fetchingCampaign] closing...");
    await client.close().catch((e) => console.error("[fetchingCampaign] close error", e));
    console.log("[fetchingCampaign] closed");
  }
}


export async function GET(
request: Request,
{ params }: { params: Promise<{ id: string }> }) 
{

    try {
        const {id} = await params;
        if (!id) return NextResponse.json({error:"no id found"});

        const data = await fetchingCampaign(id);
        if (!data) return NextResponse.json({error:"no campaign found"});

        return NextResponse.json(data);

    } catch (err) {
        return NextResponse.json({error: "internal error"});
    }


}