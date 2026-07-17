import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join } from "node:path";

const ROOT = new URL("..", import.meta.url).pathname;

function load(relPath) {
  return JSON.parse(readFileSync(join(ROOT, relPath), "utf8"));
}

const characters = readdirSync(join(ROOT, "data/characters"))
  .filter((f) => f.endsWith(".json"))
  .flatMap((f) => load(`data/characters/${f}`));
const media = readdirSync(join(ROOT, "data/media"))
  .filter((f) => f.endsWith(".json"))
  .flatMap((f) => load(`data/media/${f}`));
const locations = load("data/locations.json");
const teasers = load("data/teasers.json");

const expected = [];
for (const c of characters) for (const [kind, path] of Object.entries(c.images)) expected.push({ category: `character ${kind}`, path });
for (const m of media) for (const [kind, path] of Object.entries(m.images)) expected.push({ category: `media ${kind}`, path });
for (const l of locations) for (const [kind, path] of Object.entries(l.images)) expected.push({ category: `location ${kind}`, path });
for (const t of teasers) expected.push({ category: "teaser", path: t.imageUrl });

const byCategory = new Map();
const missing = [];
for (const { category, path } of expected) {
  const exists = existsSync(join(ROOT, "public", path));
  const bucket = byCategory.get(category) ?? { have: 0, total: 0 };
  bucket.total += 1;
  if (exists) bucket.have += 1;
  else missing.push(path);
  byCategory.set(category, bucket);
}

let have = 0;
console.log("Image coverage");
console.log("--------------");
for (const [category, bucket] of [...byCategory.entries()].sort()) {
  have += bucket.have;
  const pct = bucket.total ? Math.round((bucket.have / bucket.total) * 100) : 0;
  console.log(`${category.padEnd(18)} ${String(bucket.have).padStart(4)}/${String(bucket.total).padEnd(4)} ${pct}%`);
}
console.log("--------------");
console.log(`total              ${String(have).padStart(4)}/${String(expected.length).padEnd(4)} ${Math.round((have / expected.length) * 100)}%`);

if (process.argv.includes("--list") && missing.length) {
  console.log(`\n${missing.length} missing file(s):`);
  for (const path of missing) console.log(`  public${path}`);
}
