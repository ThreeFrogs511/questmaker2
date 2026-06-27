import { MongoClient, ObjectId } from "mongodb";
import { NextResponse } from "next/server";
import { checkAuth } from "@/lib/auth/checkAuth";

async function fetchingCampaign(id: string) {
  const client = new MongoClient(process.env.MONGODB_URI as string);
  await client.connect();

  const db = client.db(process.env.MONGODB_DB);
  const collection = db.collection(
    process.env.MONGODB_COLLECTION_CAMPAIGNS as string,
  );

  const objectId = new ObjectId(id);
  const currentCampaign = await collection.findOne({ _id: objectId });

  await client.close();

  return currentCampaign;
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await checkAuth(request);
    const { id } = await params;
    if (!id) return NextResponse.json({ error: "no id found" });

    const data = await fetchingCampaign(id);
    if (!data) return NextResponse.json({ error: "no campaign found" });

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message });
  }
}
