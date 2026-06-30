import test from "node:test";
import assert from "node:assert/strict";
import postgres from "postgres";
import * as jose from "jose";
import { NextRequest } from "next/server";
import { PATCH } from "../../app/api/quests/[quest_id]/route";
import { sql } from "@/server/connexion";

async function makeTestJwt(userId: number): Promise<string> {
  const secret = new TextEncoder().encode(
    process.env.JWT_SECRET ?? "test-jwt-secret-for-ci",
  );
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

function makeReq(
  questId: string,
  body: object,
  jwt?: string,
): [NextRequest, { params: Promise<{ quest_id: string }> }] {
  const headers: Record<string, string> = { "content-type": "application/json" };
  if (jwt) headers["cookie"] = `auth=${jwt}`;
  return [
    new NextRequest(`http://localhost/api/quests/${questId}`, {
      method: "PATCH",
      headers,
      body: JSON.stringify(body),
    }),
    { params: Promise.resolve({ quest_id: questId }) },
  ];
}

test.after(async () => {
  await sql.end({ timeout: 5 });
});

test("PATCH /api/quests/:id rejects missing auth", async () => {
  const [req, ctx] = makeReq("1", { completed: true });
  const res = await PATCH(req, ctx);
  const json = await res.json();
  assert.equal(json.error, "Not authenticated");
});

test("PATCH /api/quests/:id rejects missing completed field", async () => {
  const jwt = await makeTestJwt(1);
  const [req, ctx] = makeReq("1", {}, jwt);
  const res = await PATCH(req, ctx);
  const json = await res.json();
  assert.equal(json.error, "Missing field: completed");
});

test("PATCH /api/quests/:id marks quest as completed", async () => {
  const url = process.env.DATABASE_URL;
  assert.ok(url, "DATABASE_URL missing");
  const db = postgres(url, { ssl: false });

  try {
    const [quest] = await db`
      INSERT INTO quests (body, completed, user_id)
      VALUES ('complete test', false, 10)
      RETURNING quest_id
    `;
    await db`
      INSERT INTO characters (user_id, coins)
      VALUES (10, 5)
      ON CONFLICT (user_id) DO UPDATE SET coins = 5
    `;

    const jwt = await makeTestJwt(10);
    const [req, ctx] = makeReq(String(quest.quest_id), { completed: true }, jwt);
    const res = await PATCH(req, ctx);
    const json = await res.json();

    assert.equal(json.success, true);
    assert.equal(json.coins, 6);

    const [row] = await db`SELECT completed FROM quests WHERE quest_id = ${quest.quest_id}`;
    assert.equal(row.completed, true);
  } finally {
    await db`DELETE FROM quests WHERE user_id = 10`;
    await db`DELETE FROM characters WHERE user_id = 10`;
    await db`DELETE FROM quest_rate_limit WHERE user_id = 10`;
    await db.end({ timeout: 5 });
  }
});

test("PATCH /api/quests/:id rejects when rate limit is hit", async () => {
  const url = process.env.DATABASE_URL;
  assert.ok(url, "DATABASE_URL missing");
  const db = postgres(url, { ssl: false });

  try {
    const [quest] = await db`
      INSERT INTO quests (body, completed, user_id)
      VALUES ('rate limit test', false, 11)
      RETURNING quest_id
    `;
    await db`
      INSERT INTO characters (user_id, coins) VALUES (11, 0)
      ON CONFLICT (user_id) DO UPDATE SET coins = 0
    `;
    await db`
      INSERT INTO quest_rate_limit (user_id, count, window_start)
      VALUES (11, 500, NOW())
      ON CONFLICT (user_id) DO UPDATE SET count = 500, window_start = NOW()
    `;

    const jwt = await makeTestJwt(11);
    const [req, ctx] = makeReq(String(quest.quest_id), { completed: true }, jwt);
    const res = await PATCH(req, ctx);
    const json = await res.json();

    assert.equal(json.error, "limit");
  } finally {
    await db`DELETE FROM quests WHERE user_id = 11`;
    await db`DELETE FROM characters WHERE user_id = 11`;
    await db`DELETE FROM quest_rate_limit WHERE user_id = 11`;
    await db.end({ timeout: 5 });
  }
});
