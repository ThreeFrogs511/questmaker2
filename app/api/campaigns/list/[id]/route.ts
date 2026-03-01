import { sql } from "@/server/connexion";
import { NextResponse } from "next/server";

export async function GET(
request: Request,
{ params }: { params: Promise<{ id: string }> }) 
{
  try {
    const {id} = await params;
    if (!id) return NextResponse.json({err:"no user id found"});

    const r = await sql`SELECT last_campaign_done FROM users WHERE id= ${id}`;
    const campaign_id = r[0].last_campaign_done;
    let currentCampaign;
    if (campaign_id === null) {
      currentCampaign= await sql`SELECT * FROM dnd_campaign_index WHERE chapter = 1`;
    } else {
      const lastCampaign = await sql`SELECT chapter FROM dnd_campaign_index WHERE mongo_id = ${campaign_id}`;
      const newChapter = parseInt(lastCampaign[0].chapter)+1;
      currentCampaign = await sql`SELECT * FROM dnd_campaign_index WHERE chapter = ${newChapter}`
    };

    return NextResponse.json(currentCampaign[0]);
  } catch (err) {
    return NextResponse.json({ error: err });
  }
}
