import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const ROOT = new URL("..", import.meta.url).pathname;
const errors = [];
const warnings = [];

const CONTINUITIES = new Set(["games", "novels", "frights", "movies", "meta"]);
const CANONICITY = new Set(["confirmed", "implied", "theory"]);
const MEDIA_TYPES = new Set(["Game", "DLC", "Book", "Movie"]);
const BOOK_TYPES = new Set(["novel", "anthology", "graphic-novel", "guide", "interactive-novel", "companion"]);
const CHARACTER_TYPES = new Set(["Human", "Animatronic"]);
const LOCATION_STATUS = new Set(["Active", "Closed", "Burned", "Demolished", "Unknown"]);
const SLUG = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const DATE = /^\d{4}-\d{2}-\d{2}$/;
const DATE_LOOSE = /^\d{4}(-\d{2})?(-\d{2})?$/;

function load(relPath) {
  try {
    return JSON.parse(readFileSync(join(ROOT, relPath), "utf8"));
  } catch (cause) {
    errors.push(`${relPath}: cannot parse JSON (${cause.message})`);
    return [];
  }
}

function checkLoreClaim(owner, field, claim) {
  if (!claim) return;
  if (typeof claim.value !== "string" || !claim.value) errors.push(`${owner}: ${field}.value missing`);
  if (!CANONICITY.has(claim.canonicity)) errors.push(`${owner}: ${field}.canonicity '${claim.canonicity}' invalid`);
  if (!CONTINUITIES.has(claim.continuity)) errors.push(`${owner}: ${field}.continuity '${claim.continuity}' invalid`);
}

const characterFiles = readdirSync(join(ROOT, "data/characters")).filter((f) => f.endsWith(".json"));
const mediaFiles = readdirSync(join(ROOT, "data/media")).filter((f) => f.endsWith(".json"));

const characters = characterFiles.flatMap((f) =>
  load(`data/characters/${f}`).map((c) => ({ ...c, __file: `data/characters/${f}` }))
);
const media = mediaFiles.flatMap((f) => load(`data/media/${f}`).map((m) => ({ ...m, __file: `data/media/${f}` })));
const locations = load("data/locations.json");
const minigames = load("data/minigames.json");
const teasers = load("data/teasers.json");

const allIds = new Map();
for (const [collection, items] of [
  ["character", characters],
  ["media", media],
  ["location", locations],
  ["teaser", teasers],
  ["minigame", minigames],
]) {
  for (const item of items) {
    if (typeof item.id !== "string" || !SLUG.test(item.id)) {
      errors.push(`${collection} '${item.id}': id is not a valid slug`);
      continue;
    }
    const key = `${collection}:${item.id}`;
    if (allIds.has(key)) errors.push(`${collection} '${item.id}': duplicate id`);
    allIds.set(key, item);
  }
}

const mediaIds = new Set(media.map((m) => m.id));
const characterIds = new Set(characters.map((c) => c.id));

for (const m of media) {
  const tag = `${m.__file} → ${m.id}`;
  if (!MEDIA_TYPES.has(m.type)) errors.push(`${tag}: type '${m.type}' invalid`);
  if (!m.title) errors.push(`${tag}: title missing`);
  if (!m.images?.poster?.startsWith("/images/media/")) errors.push(`${tag}: images.poster missing or malformed`);
  if ((m.type === "Game" || m.type === "DLC") && (!m.images?.hero || !m.images?.icon)) errors.push(`${tag}: games require images.hero and images.icon`);
  if (m.type === "Movie" && !m.images?.hero) errors.push(`${tag}: movies require images.hero`);
  if (m.releaseDate !== null && !DATE.test(m.releaseDate ?? "")) errors.push(`${tag}: releaseDate '${m.releaseDate}' is not YYYY-MM-DD or null`);
  if (!CONTINUITIES.has(m.continuity)) errors.push(`${tag}: continuity '${m.continuity}' invalid`);
  if (m.type === "Book" && !BOOK_TYPES.has(m.bookType)) errors.push(`${tag}: bookType '${m.bookType}' invalid for a Book`);
  if (m.type !== "Book" && m.bookType) errors.push(`${tag}: bookType present on non-Book`);
  if (m.parentId && !mediaIds.has(m.parentId)) errors.push(`${tag}: parentId '${m.parentId}' not found`);
  if (m.adaptationOf && !mediaIds.has(m.adaptationOf)) errors.push(`${tag}: adaptationOf '${m.adaptationOf}' not found`);
  if (typeof m.credits !== "object" || m.credits === null) errors.push(`${tag}: credits missing`);
  for (const p of m.platforms ?? []) {
    if (!p.platform) errors.push(`${tag}: platform entry without name`);
    if (p.releaseDate && !DATE.test(p.releaseDate)) errors.push(`${tag}: platform '${p.platform}' releaseDate invalid`);
  }
}

const byId = new Map(characters.map((c) => [c.id, c]));
for (const c of characters) {
  const tag = `${c.__file} → ${c.id}`;
  if (!CHARACTER_TYPES.has(c.type)) errors.push(`${tag}: type '${c.type}' invalid`);
  if (!c.name) errors.push(`${tag}: name missing`);
  if (!CONTINUITIES.has(c.continuity)) errors.push(`${tag}: continuity '${c.continuity}' invalid`);
  if (!c.images?.frame?.startsWith("/images/characters/")) errors.push(`${tag}: images.frame missing or malformed`);
  if (!c.images?.full?.startsWith("/images/characters/")) errors.push(`${tag}: images.full missing or malformed`);
  if (!mediaIds.has(c.debut)) errors.push(`${tag}: debut '${c.debut}' not found in media`);
  if (!Array.isArray(c.appearances) || c.appearances.length === 0) errors.push(`${tag}: appearances missing`);
  else {
    for (const a of c.appearances) if (!mediaIds.has(a)) errors.push(`${tag}: appearance '${a}' not found in media`);
    if (!c.appearances.includes(c.debut)) errors.push(`${tag}: debut not present in appearances`);
    if (new Set(c.appearances).size !== c.appearances.length) errors.push(`${tag}: duplicate appearances`);
  }
  if (c.variantOf && !characterIds.has(c.variantOf)) errors.push(`${tag}: variantOf '${c.variantOf}' not found`);
  for (const cp of c.counterparts ?? []) {
    if (!characterIds.has(cp)) errors.push(`${tag}: counterpart '${cp}' not found`);
    else {
      const other = byId.get(cp);
      if (!(other.counterparts ?? []).includes(c.id)) warnings.push(`${tag}: counterpart '${cp}' does not point back`);
    }
  }
  checkLoreClaim(tag, "possessedBy", c.possessedBy);
  checkLoreClaim(tag, "status", c.status);

  for (const attack of c.worldAttacks ?? []) {
    if (!attack.name) errors.push(`${tag}: worldAttacks entry missing name`);
  }
  if (c.worldAttacks?.length && !c.appearances.includes("fnaf-world")) {
    warnings.push(`${tag}: has worldAttacks but 'fnaf-world' is not in appearances`);
  }
  if (c.ucnVoiceLine) {
    if (!c.ucnVoiceLine.line) errors.push(`${tag}: ucnVoiceLine.line missing`);
    if (!c.appearances.includes("fnaf-ucn")) warnings.push(`${tag}: has ucnVoiceLine but 'fnaf-ucn' is not in appearances`);
  }
}

for (const c of characters) {
  const seen = new Set();
  let cursor = c;
  while (cursor?.variantOf) {
    if (seen.has(cursor.id)) {
      errors.push(`character '${c.id}': variantOf cycle detected`);
      break;
    }
    seen.add(cursor.id);
    cursor = byId.get(cursor.variantOf);
  }
}

for (const l of locations) {
  const tag = `data/locations.json → ${l.id}`;
  if (!l.name) errors.push(`${tag}: name missing`);
  if (!CONTINUITIES.has(l.continuity)) errors.push(`${tag}: continuity '${l.continuity}' invalid`);
  if (!LOCATION_STATUS.has(l.status)) errors.push(`${tag}: status '${l.status}' invalid`);
    if (!l.images?.hero?.startsWith("/images/locations/")) errors.push(`${tag}: images.hero missing or malformed`);
  for (const pc of l.presentCharacters ?? []) if (!characterIds.has(pc)) errors.push(`${tag}: presentCharacter '${pc}' not found`);
  for (const a of l.appearances ?? []) if (!mediaIds.has(a)) errors.push(`${tag}: appearance '${a}' not found in media`);
  for (const inc of l.incidents ?? []) {
    if (!inc.name || !inc.description) errors.push(`${tag}: incident missing name/description`);
    if (!CANONICITY.has(inc.canonicity)) errors.push(`${tag}: incident '${inc.name}' canonicity invalid`);
  }
}

for (const t of teasers) {
  const tag = `data/teasers.json → ${t.id}`;
  if (!t.title) errors.push(`${tag}: title missing`);
  if (!t.source) errors.push(`${tag}: source missing`);
  if (t.postedDate !== null && !DATE_LOOSE.test(t.postedDate ?? "")) errors.push(`${tag}: postedDate '${t.postedDate}' invalid`);
  if (t.teases && !mediaIds.has(t.teases)) errors.push(`${tag}: teases '${t.teases}' not found in media`);
}

for (const m of minigames) {
  const tag = `data/minigames.json → ${m.id}`;
  if (!m.name) errors.push(`${tag}: name missing`);
  if (!mediaIds.has(m.media)) errors.push(`${tag}: media '${m.media}' not found`);
  if (!m.images?.screenshot?.startsWith("/images/minigames/")) errors.push(`${tag}: images.screenshot missing or malformed`);
}

console.log(`characters: ${characters.length} (${characterFiles.length} files)`);
console.log(`media:      ${media.length} (${mediaFiles.length} files)`);
console.log(`locations:  ${locations.length}`);
console.log(`teasers:    ${teasers.length}`);
console.log(`minigames:  ${minigames.length}`);

if (warnings.length) {
  console.log(`\n${warnings.length} warning(s):`);
  for (const w of warnings) console.log(`  ~ ${w}`);
}

if (errors.length) {
  console.error(`\n${errors.length} error(s):`);
  for (const e of errors) console.error(`  ✗ ${e}`);
  process.exit(1);
}

console.log("\nAll checks passed.");
