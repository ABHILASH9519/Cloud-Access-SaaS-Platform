const test = require("node:test");
const assert = require("node:assert/strict");
const { ValidationError, parseCredentials } = require("../lib/authValidation");

test("normalizes email addresses without changing passwords", () => {
  assert.deepEqual(
    parseCredentials({ email: "  USER@Example.COM ", password: "correct-horse" }),
    { email: "user@example.com", password: "correct-horse" }
  );
});

test("rejects missing or malformed request bodies", () => {
  for (const body of [undefined, null, [], "not-an-object", {}]) {
    assert.throws(() => parseCredentials(body), ValidationError);
  }
});

test("rejects malformed email addresses", () => {
  assert.throws(
    () => parseCredentials({ email: "not-an-email", password: "correct-horse" }),
    /valid email/
  );
});

test("rejects passwords shorter than eight characters", () => {
  assert.throws(
    () => parseCredentials({ email: "user@example.com", password: "short" }),
    /at least 8/
  );
});

test("rejects passwords that exceed bcrypt's 72-byte input limit", () => {
  assert.throws(
    () => parseCredentials({ email: "user@example.com", password: "é".repeat(37) }),
    /72 UTF-8 bytes/
  );
});
