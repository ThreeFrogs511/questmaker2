import { NextResponse } from "next/server";
import { sql } from "@/server/connexion";
import { cookies } from "next/headers";
import { fetchQuests } from "@/lib/quests/fetchQuests";
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
        return NextResponse.json(r);

      case "/merchant":
        r = await fetchInventoryData(sql, userId);
        return NextResponse.json(r);

      case "/inventory":
        r = await fetchInventoryData(sql, userId);
        return NextResponse.json(r);

      case "/merchant/sell":
        r = await fetchInventoryData(sql, userId);
        return NextResponse.json(r);

      case "/campaignRunning":
        r = await fetchPlayerCampaignData(sql, userId);
        return NextResponse.json(r);

      default:
        r = await sql`
        SELECT
          u.user_id, u.email, u.profile_completed, u.tutorial_completed, u.last_chapter_done,
          c.character_id, c.username, c.xp, c.hp, c.user_class, c.lvl, c.race, c.gender,
          c.str, c.dex, c.con, c.int, c.wis, c.cha, c.ac, c.damage_taken,
          c.dopamine, c.dopamine_consumed, c.coins
        FROM users u
        LEFT JOIN characters c ON u.user_id = c.user_id
        WHERE u.user_id = ${userId}`;

      if (!r || r.length === 0)
        return NextResponse.json({ err: "pas d'user existant" });

      return NextResponse.json({
        authenticated: true,
        user: {
          user_id: Number(r[0].user_id),
          email: r[0].email,
          profile_completed: r[0].profile_completed,
          tutorial_completed: r[0].tutorial_completed,
          last_chapter_done: r[0].last_chapter_done !== null ? Number(r[0].last_chapter_done) : null,
        },
        character: {
          character_id: r[0].character_id != null ? Number(r[0].character_id) : null,
          username: r[0].username,
          xp: Number(r[0].xp),
          hp: Number(r[0].hp),
          user_class: r[0].user_class,
          lvl: Number(r[0].lvl),
          race: r[0].race,
          gender: r[0].gender,
          str: Number(r[0].str),
          dex: Number(r[0].dex),
          con: Number(r[0].con),
          int: Number(r[0].int),
          wis: Number(r[0].wis),
          cha: Number(r[0].cha),
          ac: Number(r[0].ac),
          damage_taken: Number(r[0].damage_taken),
          dopamine: Number(r[0].dopamine),
          dopamine_consumed: Number(r[0].dopamine_consumed),
          coins: Number(r[0].coins),
        },
      });

    }

  } catch (err) {
    return NextResponse.json({ err: (err as Error).message });
  }
}
