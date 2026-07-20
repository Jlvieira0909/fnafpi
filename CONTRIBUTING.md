# Contributing to FNAFPI

Thanks for wanting to help build this out. FNAFPI is a fan-run catalog of the Five Nights at Freddy's
franchise — the more accurate and complete it is, the better it serves everyone using the API and the
museum site. There's room to contribute whether or not you write code.

## Ways to contribute

- **Fix or add data** — a wrong debut year, a missing character, an incomplete `LoreClaim` source.
- **Contribute images** — see the [image guidelines](#contributing-images) below; this is the area
  that needs the most help right now (`npm run images:coverage` shows exactly what's missing).
- **Report bugs** — in the API, the site, or FNAFDLE.
- **Suggest features** — a new FNAFDLE mode, a new museum section, an API filter.
- **Improve the code** — components, API routes, the validator, CI.

If you're not sure code is your thing: **opening an issue is a full contribution on its own.** Someone
who knows the lore but not Git is exactly as valuable as someone who knows Git but not the lore — issues
turn into pull requests all the time, by the reporter or by someone else.

## Ground rules

- Everything in the data and codebase is in English, regardless of the language you open an issue in.
- Be specific about sources. "I think X" is a fine starting point in an issue; a merged data change
  needs a citable source (game text, an official statement, a specific wiki page, a timestamp in a video).
- Disputed or non-canon lore is never flattened into a plain fact. It goes into a `LoreClaim` with an
  honest `canonicity` (`confirmed` / `implied` / `theory`). If you're not sure which one applies, say so
  in the PR or issue and it'll get sorted out in review.
- Be kind. See [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md).

## Contributing data

1. Fork the repo and create a branch.
2. Edit or add entries under `data/`. Adding a brand-new character family gets its own file in
   `data/characters/`, imported once in `lib/data.ts`.
3. Slugs are lowercase-kebab-case. Dates are `YYYY-MM-DD` (or `YYYY-MM` / `YYYY` if that's genuinely all
   that's known — say so in a `notes` entry).
4. Run `npm run validate:data` before opening a PR. This checks schema, enums, and referential integrity
   (broken `variantOf`/`appearances`/`counterparts` references, cycles, asymmetric counterparts, etc.) —
   CI runs it again automatically, but catching it locally is faster.
5. If a fact needs a follow-up check later, add a short `"Verify ..."` string to that entry's `notes`
   array instead of leaving it unstated. `grep -r Verify data/` shows every open item across the dataset.
6. Open a PR. Describe your source in the description, even briefly.

## Contributing images

This is the single biggest gap in the project today — nearly every image slot across characters, media,
locations, and minigames is empty. See the image spec table in [README.md](README.md#images) for exact
paths, ratios, and sizes per resource type.

**Before submitting an image, please make sure it's actually appropriate to include:**

- Prefer promotional material, official screenshots, or box art released by Scott Cawthon / ScottGames /
  Steel Wool Studios / Illumix for publicity purposes, used here in a small, non-commercial, fan-education
  context (the same basis wikis operate on).
- **Do not submit datamined, ripped, or otherwise non-public game assets.** If you wouldn't find the
  image by looking at official marketing, a wiki, or a store page, don't submit it here.
- Your own screenshots and photos of physical merchandise are welcome and are usually the *best* source
  for things like `full` character renders and `map` floor plans.
- If in doubt, open an issue first and ask rather than opening a PR with the image already in place.

None of this makes FNAFPI a rights holder over anything Five Nights at Freddy's related — see the
[Legal](README.md#legal) section. It's about keeping the repository itself on solid, defensible ground
as more people contribute to it.

To submit: drop the file at the path the coverage script expects (`npm run images:coverage -- --list`
prints every missing path), in WebP where possible, and open a PR. One image or a small batch per PR is
easier to review than a giant dump.

## Contributing code

1. `npm install`, then `npm run dev`.
2. Before opening a PR: `npm run check` (data validation + typecheck + lint) and `npm run build`.
3. Keep PRs focused — one feature or fix per PR is much easier to review than several bundled together.
4. Match the existing visual language (see the design tokens in `app/globals.css`) rather than
   introducing new colors or fonts ad hoc.
5. New API fields or endpoints should be reflected in `public/openapi.yaml` and, where relevant,
   `scripts/validate-data.mjs`.

## Reporting bugs and suggesting features

Open an issue using the templates in the tracker — they'll ask for what's needed (repro steps for bugs,
the problem a feature would solve for suggestions). No template fits your issue? Open a blank one.

## Getting help

Open a [Discussion](../../discussions) or an issue tagged as a question. There's no Discord or other
external chat for this project — everything happens on GitHub so the history stays searchable.
