import { MongoClient, ObjectId } from "mongodb";


async function fetchingCampaign(id:string) {
    const client = new MongoClient(process.env.MONGODB_URI as string);
    await client.connect();

    const db = client.db(process.env.MONGODB_DB);
    const collection = db.collection(process.env.MONGODB_COLLECTION_CAMPAIGNS as string);

    const objectId = new ObjectId(id);
    const currentCampaign = await collection.findOne({_id: objectId});

    await client.close();

    return currentCampaign;
  }


export async function GET(
request: Request,
{ params }: { params: Promise<{ id: string }> }) 
{

    try {
        const {id} = await params;

        if (!id) throw new Error('No campaign id selected');

        const data = await fetchingCampaign(id);
        return Response.json(data);

    } catch (err) {
        return Response.json(`error : ${err}`);
    }


}