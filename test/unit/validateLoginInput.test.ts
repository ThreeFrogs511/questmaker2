import test from "node:test";
import assert from "node:assert/strict";
import validateLoginInput from "@/lib/validateLoginInput";

// cas de succès : email et mot de passe valides → ne doit pas lever d'erreur
test("login input: valid credentials pass", () => {
  assert.doesNotThrow(() =>
    validateLoginInput("nicolas@example.com", "StrongPassword!2"),
  );
});

// champs manquants → "All fields required"
test("login input: missing email throws", () => {
  assert.throws(
    () => validateLoginInput("", "StrongPassword!2"),
    { message: "All fields required" },
  );
});

test("login input: missing password throws", () => {
  assert.throws(
    () => validateLoginInput("nicolas@example.com", ""),
    { message: "All fields required" },
  );
});

// email mal formé → "Invalid email"
test("login input: invalid email throws", () => {
  assert.throws(
    () => validateLoginInput("not-an-email", "StrongPassword!2"),
    { message: "Invalid email" },
  );
});

test("login input: email without TLD throws", () => {
  assert.throws(
    () => validateLoginInput("user@localhost", "StrongPassword!2"),
    { message: "Invalid email" },
  );
});
