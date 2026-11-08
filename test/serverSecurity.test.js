const test = require("node:test");
const assert = require("node:assert/strict");

process.env.CORS_ORIGINS = "https://allowed.example";
const app = require("../server");

let server;
let baseUrl;

test.before(async () => {
  server = app.listen(0, "127.0.0.1");
  await new Promise((resolve, reject) => {
    server.once("listening", resolve);
    server.once("error", reject);
  });
  baseUrl = `http://127.0.0.1:${server.address().port}`;
});

test.after(async () => {
  if (server) await new Promise((resolve, reject) => server.close(error => error ? reject(error) : resolve()));
});

test("health endpoint returns a stable liveness response", async () => {
  const response = await fetch(`${baseUrl}/healthz`);
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { status: "ok" });
});

test("CORS reflects only an explicitly allowed origin", async () => {
  const allowed = await fetch(`${baseUrl}/healthz`, {
    headers: { Origin: "https://allowed.example" },
  });
  assert.equal(allowed.headers.get("access-control-allow-origin"), "https://allowed.example");

  const denied = await fetch(`${baseUrl}/healthz`, {
    headers: { Origin: "https://untrusted.example" },
  });
  assert.equal(denied.headers.get("access-control-allow-origin"), null);
});

test("JSON request bodies are bounded to 32 KiB", async () => {
  const response = await fetch(`${baseUrl}/api/auth/register`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ padding: "x".repeat(33 * 1024) }),
  });
  assert.equal(response.status, 413);
});
