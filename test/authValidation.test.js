const test = require("node:test");
const assert = require("node:assert/strict");

const { ValidationError, parseCredentials } = require("../lib/authValidation");

test("normalizes email and preserves the password", () => {
  assert.deepEqual(
    parseCredentials({ email: "  USER@Example.COM ", password: "correct-horse" }),
    { email: "user@example.com", password: "correct-horse" }
  );
});

test("rejects missing, array, and non-object request bodies", () => {
  for (const body of [undefined, null, [], "email=user@example.com"]) {
    assert.throws(() => parseCredentials(body), ValidationError);
  }
});

test("rejects malformed email addresses", () => {
  for (const email of ["", "not-an-email", "user @example.com", "user@example", "a".repeat(250) + "@x.co"]) {
    assert.throws(
      () => parseCredentials({ email, password: "correct-horse" }),
      ValidationError
    );
  }
});

test("requires passwords to contain at least eight characters", () => {
  assert.throws(
    () => parseCredentials({ email: "user@example.com", password: "1234567" }),
    /at least 8 characters/
  );
});

test("enforces bcrypt's 72-byte password limit using UTF-8 byte length", () => {
  assert.doesNotThrow(() =>
    parseCredentials({ email: "user@example.com", password: "a".repeat(72) })
  );
  assert.throws(
    () => parseCredentials({ email: "user@example.com", password: "a".repeat(73) }),
    /72 UTF-8 bytes/
  );
  assert.throws(
    () => parseCredentials({ email: "user@example.com", password: "é".repeat(37) }),
    /72 UTF-8 bytes/
  );
});
