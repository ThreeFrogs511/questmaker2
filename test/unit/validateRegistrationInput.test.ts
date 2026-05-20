import test from "node:test";
import assert from "node:assert/strict";
import validateRegistrationInput from "@/lib/validateRegistrationInput";

type Result = {
  inputValid: boolean;
  err?: string;
};

//fonction réutilisable pour les cas d'erreurs
function expectInvalid(result: Result, msg: string) {
  assert.equal(result.inputValid, false);
  assert.equal(result.err, msg);
}

//on teste les cas de succès
test("registration input: valid passes", () => {
  const result = validateRegistrationInput(
    "nicolas@example.com",
    "StrongPassword!2",
    "StrongPassword!2",
  );

  assert.equal(result.inputValid, true);
  assert.ok(!("err" in result));
});

//on teste les cas d'erreurs ci-dessous

test("registration input: missing fields", () => {
  const result = validateRegistrationInput(
    "",
    "StrongPassword!2",
    "StrongPassword!2",
  );
  expectInvalid(result, "All fields required");
});

test("registration input: invalid email", () => {
  const result = validateRegistrationInput(
    "not-an-email",
    "StrongPassword!2",
    "StrongPassword!2",
  );
  expectInvalid(result, "Invalid email");
});

test("registration input: password mismatch", () => {
  const result = validateRegistrationInput(
    "nicolas@example.com",
    "StrongPassword!2",
    "StrongPassword!3",
  );
  expectInvalid(result, "Password mismatch");
});

test("registration input: weak password rejected", () => {
  const result = validateRegistrationInput(
    "nicolas@example.com",
    "passwordpassword",
    "passwordpassword",
  );
  expectInvalid(
    result,
    "Invalid password: at least 12+ chars, 1 uppercase, 1 lowercase, 1 digit, 1 special character.",
  );
});
