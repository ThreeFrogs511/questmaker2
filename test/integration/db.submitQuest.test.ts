import test from "node:test";
import assert from "node:assert/strict";
import postgres from "postgres";
import { POST } from "../../app/api/todo/route";

function makeReq(payload: any) {
  return new Request("http://localhost/api/todo", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload),
  });
}

test("POST /api/todo rejects missing user_id", async () => {
  const res = await POST(makeReq({ body: "x", completed: false }));
  assert.equal(res.status, 200);

  const json = await res.json();
  assert.equal(json.error, "no user found");
});

test("POST /api/todo rejects missing completed", async () => {
  const res = await POST(makeReq({ body: "x", user_id: 1 }));
  assert.equal(res.status, 200);

  const json = await res.json();
  assert.equal(json.error, "error while sending quest completion state");
});

test("POST /api/todo rejects empty body", async () => {
  const res = await POST(makeReq({ body: "   ", completed: false, user_id: 1 }));
  assert.equal(res.status, 200);

  const json = await res.json();
  assert.equal(json.error, "quests can not be empty");
});

test("POST /api/todo inserts row when input is valid", async () => {
  const url = process.env.DATABASE_URL;
  assert.ok(url, "DATABASE_URL missing");

  const db = postgres(url, { ssl: false });

  await db`
    CREATE TABLE IF NOT EXISTS todo (
      id SERIAL PRIMARY KEY,
      body TEXT NOT NULL,
      completed BOOLEAN NOT NULL,
      user_id INTEGER NOT NULL
    )
  `;

  const res = await POST(makeReq({ body: "test value", completed: false, user_id: 1 }));
  assert.equal(res.status, 200);

  const json = await res.json();

  // diagnostic propre si ton handler a catch une erreur interne
  if (json.error) throw new Error(`API error: ${json.error}`);

  assert.equal(json.success, true);
  assert.equal(json.quest.body, "test value");
  assert.equal(json.quest.completed, false);
  assert.equal(json.quest.user_id, 1);

  const rows =
    await db`SELECT id, body, completed, user_id FROM todo WHERE id = ${json.quest.id}`;
  assert.equal(rows.length, 1);
  assert.equal(rows[0].body, "test value");
  assert.equal(rows[0].completed, false);
  assert.equal(rows[0].user_id, 1);

  await db.end();
});
