import test from "node:test";
import assert from "node:assert/strict";
import validateRegistrationInput from "@/middlewares/validateRegistrationInput";


function throwsMsg(fn: () => unknown, msg: string) {
  assert.throws(fn, (e: unknown) => e instanceof Error && e.message === msg);
}


test("registration input: valid passes", () => {
  assert.doesNotThrow(() => {
    validateRegistrationInput(
      "nicolas@example.com",
      "StrongPassword!2",
      "StrongPassword!2",
    );
  });
});

test("registration input: missing fields", () => {
  throwsMsg(
    () => validateRegistrationInput("", "StrongPassword!2", "StrongPassword!2"),
    "All fields required",
  );
});

test("registration input: invalid email", () => {
  throwsMsg(
    () =>
      validateRegistrationInput(
        "not-an-email",
        "StrongPassword!2",
        "StrongPassword!2",
      ),
    "Invalid email",
  );
});

test("registration input: password mismatch", () => {
  throwsMsg(
    () =>
      validateRegistrationInput(
        "nicolas@example.com",
        "StrongPassword!2",
        "StrongPassword!3",
      ),
    "Password mismatch",
  );
});

test("registration input: weak password rejected", () => {
  // 12 chars, but missing uppercase + special etc depending on sample
  throwsMsg(
    () =>
      validateRegistrationInput(
        "nicolas@example.com",
        "passwordpassword",
        "passwordpassword",
      ),
    "Invalid password: at least 12+ chars, 1 uppercase, 1 lowercase, 1 digit, 1 special character.",
  );
});
