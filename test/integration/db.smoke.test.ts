import test from "node:test";
import assert from "node:assert/strict";
import postgres from "postgres";

test("db: can connect and query", async () => {
  const url = process.env.DATABASE_URL;
  assert.ok(url, "DATABASE_URL missing");

  const sql = postgres(url, { ssl: false });
  const rows = await sql`SELECT 1 as ok`;
  await sql.end();

  assert.equal(rows[0].ok, 1);
});
