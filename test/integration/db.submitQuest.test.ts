import test from "node:test";
import assert from "node:assert/strict";
import postgres from "postgres";
import * as jose from "jose";
import { NextRequest } from "next/server";
import { POST } from "../../app/api/quests/route";
import { sql } from "@/server/connexion";

type Payload = {
  body: string;
  completed?: boolean;
};

async function makeTestJwt(userId: number): Promise<string> {
  const secret = new TextEncoder().encode(process.env.JWT_SECRET ?? "test-jwt-secret-for-ci");
  return new jose.SignJWT({
    userId,
    email: "test@test.com",
    isCompleted: true,
    tutorialCompleted: true,
    lastChapterDone: null,
    accessLevel: "user",
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("1h")
    .sign(secret);
}

function makeReq(payload: Payload, jwt?: string) {
  const headers: Record<string, string> = { "content-type": "application/json" };
  if (jwt) headers["cookie"] = `auth=${jwt}`;
  return new NextRequest("http://localhost/api/quests", {
    method: "POST",
    headers,
    body: JSON.stringify(payload),
  });
}

test.after(async () => {
  await sql.end({ timeout: 5 });
});

test("POST /api/quests rejects missing auth token", async () => {
  const res = await POST(makeReq({ body: "x", completed: false }));
  assert.equal(res.status, 200);

  const json = await res.json();
  assert.equal(json.err, "Not authenticated");
});

test("POST /api/quests rejects missing completed", async () => {
  const jwt = await makeTestJwt(1);
  const res = await POST(makeReq({ body: "x" }, jwt));
  assert.equal(res.status, 200);

  const json = await res.json();
  assert.equal(json.err, "error while sending quest completion state");
});

test("POST /api/quests rejects empty body", async () => {
  const jwt = await makeTestJwt(1);
  const res = await POST(makeReq({ body: "   ", completed: false }, jwt));
  assert.equal(res.status, 200);

  const json = await res.json();
  assert.equal(json.err, "quests can not be empty");
});

test("POST /api/quests inserts row when input is valid", async () => {
  const url = process.env.DATABASE_URL;
  assert.ok(url, "DATABASE_URL missing");

  const jwt = await makeTestJwt(1);
  const db = postgres(url, { ssl: false });

  try {
    const res = await POST(makeReq({ body: "test value", completed: false }, jwt));
    assert.equal(res.status, 200);

    const json = await res.json();
    if (json.error) throw new Error(`API error: ${json.error}`);

    assert.equal(json.success, true);
    assert.equal(json.quest.body, "test value");
    assert.equal(json.quest.completed, false);
    assert.equal(json.quest.user_id, 1);

    const rows = await db`
      SELECT quest_id, body, completed, user_id
      FROM quests
      WHERE quest_id = ${json.quest.quest_id}
    `;
    assert.equal(rows.length, 1);
    assert.equal(rows[0].body, "test value");
    assert.equal(rows[0].completed, false);
    assert.equal(rows[0].user_id, 1);

    await db`DELETE FROM quests WHERE quest_id = ${json.quest.quest_id}`;
  } finally {
    await db.end({ timeout: 5 });
  }
});
