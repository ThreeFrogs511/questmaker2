import { NextResponse } from "next/server";
import { sql } from "@/server/connexion";
import { cookies } from "next/headers";
import { fetchQuests } from "@/lib/fetchQuests";
import { fetchProfileData } from "@/lib/fetchProfileData";
import { fetchPlayerCampaignData } from "@/lib/fetchPlayerCampaignData";
import { fetchInventoryData } from "@/lib/fetchInventoryData";
import * as jose from "jose";

interface PayloadType {
  userId: number;
  email: string;
  isCompleted: boolean;
};

export async function POST(request: Request) {
  try {
    // cookies
    const cookieStore = await cookies();
    // const token = cookieStore.get("session")?.value;
    const jwt = cookieStore.get("auth")?.value;

    // checking if the token exists
    if (!jwt) return NextResponse.json({ err: "Not authenticated" });

    const secretKey = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } : { payload: PayloadType } = await jose.jwtVerify(jwt, secretKey)
    const userId:number = payload.userId;
    const email:string = payload.email;

    if (!userId || !email) return NextResponse.json({ err: "No user id attached" });

    const { pathname } = await request.json();

    if (!pathname) return NextResponse.json({ err: "Wrong URL" });
    // fetching user's data and handling errors
    let r;


    switch (pathname) {

      case "/journal":
        r = await fetchQuests(sql, userId);
        return r;

      // case "/profileSettings":
      //   return NextResponse.json({user:{id:userId, email:email}, authenticated:true});


      case "/merchant":
        r = await fetchInventoryData(sql, userId);
        return r;

      case "/inventory":
        r = await fetchInventoryData(sql, userId);
        return r;

      case "/merchant/sell":
        r = await fetchInventoryData(sql, userId);
        return r;

      case "/campaignRunning":
        r = await fetchPlayerCampaignData(sql, userId);
        return r;

      default:
        r = await sql`
        SELECT id, email, username, xp, hp, user_class, lvl, race, gender,
        str, dex, con, int, wis, cha, ac, damage_taken, dopamine, dopamine_consumed, profile_completed, coins, last_campaign_done
        FROM users
        WHERE id = ${userId}`;

      if (!r || r.length === 0)
        return NextResponse.json({ err: "pas d'user existant" });

      // returning the successful response with the user object
      return NextResponse.json({
        authenticated: true,
        user: r[0],
      });

    }

  } catch (err) {
    return NextResponse.json({ err: (err as Error).message });
  }
}
