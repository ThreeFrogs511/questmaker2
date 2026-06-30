import test from "node:test";
import assert from "node:assert/strict";
import postgres from "postgres";
import * as jose from "jose";
import { DELETE } from "../../app/api/quests/[quest_id]/route";
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
  jwt?: string,
): [Request, { params: Promise<{ quest_id: string }> }] {
  const headers: Record<string, string> = {};
  if (jwt) headers["cookie"] = `auth=${jwt}`;
  return [
    new Request(`http://localhost/api/quests/${questId}`, {
      method: "DELETE",
      headers,
    }),
    { params: Promise.resolve({ quest_id: questId }) },
  ];
}

test.after(async () => {
  await sql.end({ timeout: 5 });
});

test("DELETE /api/quests/:id rejects missing auth", async () => {
  const [req, ctx] = makeReq("1");
  const res = await DELETE(req, ctx);
  const json = await res.json();
  assert.equal(json.error, "Not authenticated");
});

test("DELETE /api/quests/:id deletes the quest", async () => {
  const url = process.env.DATABASE_URL;
  assert.ok(url, "DATABASE_URL missing");
  const db = postgres(url, { ssl: false });

  try {
    const [quest] = await db`
      INSERT INTO quests (body, completed, user_id)
      VALUES ('to delete', false, 20)
      RETURNING quest_id
    `;

    const jwt = await makeTestJwt(20);
    const [req, ctx] = makeReq(String(quest.quest_id), jwt);
    const res = await DELETE(req, ctx);
    const json = await res.json();

    assert.equal(json.success, true);

    const rows = await db`SELECT 1 FROM quests WHERE quest_id = ${quest.quest_id}`;
    assert.equal(rows.length, 0);
  } finally {
    await db`DELETE FROM quests WHERE user_id = 20`;
    await db.end({ timeout: 5 });
  }
});
