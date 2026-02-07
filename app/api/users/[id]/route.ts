import { NextResponse } from "next/server";
import { sql } from "@/server/connexion";
import { cookies } from "next/headers";
import crypto from "crypto";



//updating the user's stats, after a campaign done for example
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const data = await request.json();

  if (!id) return NextResponse.json({ error: "User id not found" });

  // the 'sql' template tag protects the database from sql injection
  const result = await sql`
  UPDATE users SET
    race = ${data.race},
    user_class = ${data.user_class},
    str = ${data.str},
    dex = ${data.dex},
    con = ${data.con},
    int = ${data.int},
    wis = ${data.wis},
    cha = ${data.cha},
    username = ${data.username},
    gender = ${data.gender},
    lvl = ${data.lvl},
    xp = ${data.xp},
    hp = ${data.hp},
    profile_completed = ${true},
    damage_taken = ${data.damage_taken},
    dopamine = ${data.dopamine},
    dopamine_consumed = ${data.dopamine_consumed},
    ac = ${data.ac ?? 10}
  WHERE id = ${id}`;

  // if no user found, error
  if (result.count === 0) return NextResponse.json({ error: "no user found" });

  return NextResponse.json({ success: true });
}
// when the user finish their profile after signing up
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const data = await request.json();

    if (!id) return NextResponse.json({ error: "User id not found" });

    const result = await sql`
    UPDATE users SET
      race = ${data.race},
      user_class = ${data.user_class},
      str = ${data.str},
      dex = ${data.dex},
      con = ${data.con},
      int = ${data.int},
      wis = ${data.wis},
      cha = ${data.cha},
      username = ${data.username},
      gender = ${data.gender},
      lvl = ${1},
      xp = ${0},
      hp = ${data.hp},
      profile_completed = ${true},
      damage_taken = ${0},
      dopamine = ${data.dopamine},
      dopamine_consumed = ${0},
      ac = ${data.ac}
    WHERE id = ${id}
    `;

    // save their session with a token
    const token = crypto.randomBytes(32).toString("hex");

    // we insert a new session in the database
    // identified by the unique token
    await sql`
        INSERT INTO sessions (token, user_id, expires_at)
        VALUES (${token}, ${id}, NOW() + INTERVAL '7 days')
    `;

    // we create a cookie that'll save the session
    // and that'll be able to be found thanks to the token
    (await cookies()).set({
      name: "session",
      value: token,
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return NextResponse.json({ success: true, data: result });
  } catch (err) {
    return NextResponse.json({ error: String(err) });
  }
}
