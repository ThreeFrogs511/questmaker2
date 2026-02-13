import test from "node:test";
import assert from "node:assert/strict";
import postgres from "postgres";
import { POST } from "../../app/api/todo/route";
import { sql } from "@/server/connexion";

type Payload = {
  body: string;
  completed?: boolean;
  user_id?: number;

}
// Fabrique une requête HTTP POST JSON, réutilisable par tous les tests.
// Objectif : simuler un appel client vers l’endpoint /api/todo avec un payload donné.
function makeReq(payload: Payload ) {
  return new Request("http://localhost/api/todo", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload),
  });
}

// Hook exécuté après l’ensemble des tests du fichier.
// Objectif : fermer la connexion Postgres globale utilisée par la route 
// (sinon le test peut rester bloqué sans aucun retour).
test.after(async () => {
  await sql.end({ timeout: 5 });
});

// Test 1 : vérifie que le serveur refuse une requête sans user_id.
// Objectif : confirmer la validation "user_id obligatoire" côté serveur.
test("POST /api/todo rejects missing user_id", async () => {
  const res = await POST(makeReq({ body: "x", completed: false }));
  assert.equal(res.status, 200);

  const json = await res.json();
  assert.equal(json.error, "no user found");
});

// Test 2 : vérifie que le serveur refuse une requête sans champ completed.
// Objectif : confirmer la validation "completed obligatoire" côté serveur.
test("POST /api/todo rejects missing completed", async () => {
  const res = await POST(makeReq({ body: "x", user_id: 1 }));
  assert.equal(res.status, 200);

  const json = await res.json();
  assert.equal(json.error, "error while sending quest completion state");
});

// Test 3 : vérifie que le serveur refuse une tâche vide.
// Objectif : confirmer la validation "body non vide" côté serveur.
test("POST /api/todo rejects empty body", async () => {
  const res = await POST(makeReq({ body: "   ", completed: false, user_id: 1 }));
  assert.equal(res.status, 200);

  const json = await res.json();
  assert.equal(json.error, "quests can not be empty");
});

// Test 4 : vérifie le cas : 
// requête valide → insertion en base → retour JSON cohérent.
// Objectif : prouver que l’endpoint insère réellement en DB et renvoie la ligne créée.
test("POST /api/todo inserts row when input is valid", async () => {
  // Vérifie que l’URL de DB est fournie.
  const url = process.env.DATABASE_URL;
  assert.ok(url, "DATABASE_URL missing");

  // Connexion DB dédiée au test .
  const db = postgres(url, { ssl: false });

  try {
    // Prépare la table si elle n’existe pas .
    await db`
      CREATE TABLE IF NOT EXISTS todo (
        id SERIAL PRIMARY KEY,
        body TEXT NOT NULL,
        completed BOOLEAN NOT NULL,
        user_id INTEGER NOT NULL
      )
    `;

    // Appelle la route avec un payload valide.
    const res = await POST(makeReq({ body: "test value", completed: false, user_id: 1 }));
    assert.equal(res.status, 200);

    // Lit la réponse et échoue explicitement si l’API renvoie une erreur.
    const json = await res.json();
    if (json.error) throw new Error(`API error: ${json.error}`);

    // Vérifie que l’API annonce un succès et renvoie les valeurs attendues.
    assert.equal(json.success, true);
    assert.equal(json.quest.body, "test value");
    assert.equal(json.quest.completed, false);
    assert.equal(json.quest.user_id, 1);

    // Vérifie que la ligne existe réellement en base avec le même id.
    const rows =
      await db`SELECT id, body, completed, user_id FROM todo WHERE id = ${json.quest.id}`;
    assert.equal(rows.length, 1);
    assert.equal(rows[0].body, "test value");
    assert.equal(rows[0].completed, false);
    assert.equal(rows[0].user_id, 1);
  } finally {
    // Ferme la connexion DB dédiée au test, même si un assert échoue.
    await db.end({ timeout: 5 });
  }
});
