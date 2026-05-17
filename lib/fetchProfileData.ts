import postgres from "postgres";
import { NextResponse } from "next/server";

export async function fetchProfileData(sql: postgres.Sql<{}>, userId: number) {
  const r = await sql`
            SELECT id, email FROM users
            WHERE id = ${userId}`;

  if (!r || r.length === 0)
    return NextResponse.json({ err: "pas d'user existant" });

  // returning the successful response with the user object
  return NextResponse.json({
    authenticated: true,
    user: r[0],
  });
}
