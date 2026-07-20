# FNAFPI — The Fazbear Archive

A free, public REST API and museum site for the **Five Nights at Freddy's** franchise: 151 characters, 61 media entries, 13 locations and a growing scottgames.com teaser archive, across every continuity.

- **Museum**: browse characters, the release timeline, locations with incident reports, and the teaser wall (hold to brighten).
- **API**: JSON over HTTPS at `/api/v1`, CORS-enabled, paginated, filterable. Interactive reference at `/docs`.

## Quickstart

```bash
curl https://<your-deployment>/api/v1/characters/springtrap
```

```json
{
  "id": "springtrap",
  "type": "Animatronic",
  "name": "Springtrap",
  "continuity": "games",
  "variantOf": "spring-bonnie",
  "possessedBy": {
    "value": "William Afton",
    "canonicity": "confirmed",
    "continuity": "games",
    "source": "Five Nights at Freddy's 3 minigames; reinforced by Sister Location and Freddy Fazbear's Pizzeria Simulator"
  },
  "debut": "fnaf-3",
  "appearances": ["fnaf-3", "fnaf-hw", "fnaf-ar"],
  "variants": ["scraptrap", "burntrap", "toxic-springtrap", "clown-springtrap"]
}
```

List endpoints return `{ info: { count, pages, next, prev }, results: [...] }` with absolute pagination URLs. Default `limit` 20, max 100.

## Endpoints

| Endpoint | Filters |
| --- | --- |
| `GET /api/v1/characters` | `name`, `type`, `continuity`, `group`, `gender`, `variantOf`, `debut`, `appearsIn` |
| `GET /api/v1/characters/:id` | — (adds computed `variants`) |
| `GET /api/v1/media` | `title`, `type`, `continuity`, `series`, `bookType`, `year`, `mainSeries` |
| `GET /api/v1/media/:id` | — (adds computed `characters` roster) |
| `GET /api/v1/games` · `/books` · `/movies` | `title`, `continuity`, `series`, `year` |
| `GET /api/v1/locations` | `name`, `status`, `continuity`, `owner`, `appearsIn`, `hasCharacter` |
| `GET /api/v1/locations/:id` | — |
| `GET /api/v1/teasers` | `title`, `teases`, `source`, `year` |
| `GET /api/v1/teasers/:id` | — |
| `GET /api/v1/minigames` | `name`, `media` |
| `GET /api/v1/minigames/:id` | — |

All list endpoints also take `page` and `limit`. Full OpenAPI 3.1 spec: [`/openapi.yaml`](public/openapi.yaml), rendered at `/docs`.

## Data model highlights

**Continuities.** FNAF spans four incompatible storylines plus out-of-universe material. Every in-universe resource carries `continuity`: `games`, `novels`, `frights`, `movies` or `meta`. The same character in different continuities is linked via `counterparts`.

**Lore claims.** Disputed lore is never flattened into plain strings. Possessing souls and character fates are `LoreClaim` objects with a `canonicity` level — `confirmed`, `implied` or `theory` — and a source. The API tells you *how much* to trust each statement.

**Variant lineage.** One entry per variant (`toy-bonnie`, `withered-bonnie`, `springtrap`...), linked to its base identity through `variantOf`. Chains are supported: `clown-springtrap → springtrap → spring-bonnie → bonnie`.

## Images

Every resource ships deterministic image paths under `public/`, one folder per id:

| Resource | Field | Ratio | Suggested size | Used for |
| --- | --- | --- | --- | --- |
| Media (all) | `images.poster` | 2:3 | 600×900 | covers, cards |
| Games/DLCs/Movies | `images.hero` | 16:9 | 1280×720 | hero banners |
| Games/DLCs | `images.icon` | 1:1 | 512×512 | app icon, FNAFDLE game mode |
| Media (optional) | `images.logo` | free | ~800w, transparent | overlay on heroes |
| Characters | `images.frame` | 1:1 | 512×512 | grids, FNAFDLE cells |
| Characters | `images.full` | vertical | 600×900+, transparent | detail pages, FNAFDLE silhouette mode (via CSS filter) |
| Locations | `images.hero` | 16:9 | 1280×720 | establishing shots |
| Locations (optional) | `images.map` | free | — | camera-map floor plans |
| Teasers | `imageUrl` | original | as posted | the teaser wall |
| Minigames | `images.screenshot` | 16:9 | 1280×720 | minigame archive, FNAFDLE minigames mode |

Example: `public/images/characters/springtrap/frame.webp`. Prefer WebP; transparent backgrounds for `full`, `icon` and `logo`.

Track what is still missing with:

```bash
npm run images:coverage
npm run images:coverage -- --list
```

## Project structure

```
data/            source of truth (JSON, one characters file per family)
scripts/         validate-data.mjs — schema + referential integrity checks
lib/             data merging + API response helpers
app/api/v1/      route handlers
app/             museum pages
types/           TypeScript model
public/openapi.yaml
```

## Running locally

```bash
npm install
npm run dev
```

Site at `http://localhost:3000`, API at `/api/v1`, docs at `/docs`.

## Contributing data

1. Edit or add entries in `data/`. New character family → new file in `data/characters/` plus one import line in `lib/data.ts`.
2. Everything in English. Slugs are lowercase-kebab-case. Dates are `YYYY-MM-DD`. Image paths follow the folder-per-id convention above.
3. Disputed lore goes in a `LoreClaim` with honest `canonicity` — theories are labeled as theories.
4. Run `npm run validate:data`. CI runs it on every push and pull request, alongside typecheck, lint and build.

Pending verifications are tracked inside the data itself — grep for `Verify` in the `notes` fields.

## Roadmap

- Character, media, location, teaser and minigame imagery
- FNAFDLE — six daily modes are live (Classic, Image, Games, Teasers, Minigames, World Attacks); a Dialog mode is designed but unseeded, see below
- Expand `worldAttacks` beyond the starting quartet (Freddy, Bonnie, Chica, Foxy) — one FNaF World Wiki character page at a time, same rigor as the rest of the data
- Expand `data/minigames.json` beyond the initial 5 entries
- Story-by-story Fazbear Frights / Tales from the Pizzaplex sweep

### A note on `ucnVoiceLine`

The `Character` schema reserves an optional `ucnVoiceLine` field for Ultimate Custom Night's spoken jumpscare lines, but it ships **unpopulated**. Research turned up two problems: most UCN animatronics are canonically silent (confirmed by the FNAF wiki itself), and the "quotes" circulating for the rest come from a mix of fan-fiction forum posts and unofficial mods easily mistaken for the real game. Rather than guess, this field is left for verified transcriptions — from official sources or your own recordings — added character by character.

## Legal

FNAFPI is a free, unofficial fan project. Not affiliated with Scott Cawthon or Steel Wool Studios. Five Nights at Freddy's and all related characters and materials belong to their respective owners. Data curated from community sources, primarily the [FNAF wiki](https://freddy-fazbears-pizza.fandom.com). Code is MIT-licensed (see [LICENSE](LICENSE)).
