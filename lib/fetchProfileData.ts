import postgres from "postgres";

export async function fetchProfileData(sql: postgres.Sql<{}>, userId: number) {
  const r = await sql`
            SELECT user_id, email FROM users
            WHERE user_id = ${userId}`;

  if (!r || r.length === 0)
    return { err: "pas d'user existant" };


  // returning the successful response with the user object
  return {
    authenticated: true,
    user: r[0],
  };
}
