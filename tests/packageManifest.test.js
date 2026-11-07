const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const manifest = JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8"));
const lock = JSON.parse(fs.readFileSync(path.join(root, "package-lock.json"), "utf8"));

test("npm lockfile root dependencies stay aligned with package.json", () => {
  assert.deepEqual(lock.packages[""].dependencies, manifest.dependencies);
  assert.deepEqual(lock.packages[""].devDependencies, manifest.devDependencies);
});

test("unexpected numeric package aliases are not installed", () => {
  assert.equal(Object.hasOwn(manifest.dependencies || {}, "20"), false);
  assert.equal(Object.hasOwn(lock.packages, "node_modules/20"), false);
});
