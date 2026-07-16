# FNAFPI — Museum site

## What's included

```
app/
  layout.tsx            root layout (nav, footer, fonts) — REPLACES your current one
  globals.css           Tailwind v4 theme tokens — REPLACES your current one
  page.tsx              home — REPLACES your current one
  characters/           listing with continuity/type/group filters + detail
  media/                release timeline grouped by year + detail with roster
  locations/            listing + detail with incident reports
  teasers/              the scottgames.com teaser wall
  api/v1/teasers/       new API endpoints (list + detail)
components/             shared UI (cam-frame, entity-card, teaser-card, ...)
data/teasers.json       starter dataset (10 iconic teasers)
lib/data.ts             updated — now also exports teasers/teasersById
types/index.ts          updated — adds the Teaser interface (comment-free)
public/openapi.yaml     updated — /teasers documented (11 paths, 19 schemas)
```

Files marked REPLACES overwrite the create-next-app defaults; everything else
is additive. `lib/api.ts` and the existing routes are untouched.

## Visual identity

Palette: Stage Black #120e0c, Curtain #1d1714, Fazbear Gold #e8a23d,
Afton Violet #8f6fd4, Bone #efe6d8, REC Red #d64545.
Type: Bungee (display), Archivo (body), IBM Plex Mono (labels/data) via
next/font. Tokens live in `app/globals.css` under `@theme` — change them
there and the whole site follows.

Canonicity is color-coded everywhere: confirmed = gold, implied = violet,
theory = red.

## Images

Pages read the `imageUrl` fields, expecting files under:
`public/images/characters/<id>.webp`, `public/images/media/*.webp`,
`public/images/locations/<id>.webp`, `public/images/teasers/<id>.webp`.
Missing files show as broken images until added.

## Teasers

`data/teasers.json` ships with 10 iconic Cawthon-era teasers. Dates are
approximate (YYYY-MM) — verify each against thefnafarchive.org while adding
the images, and grow the file from there. The wall groups by teased game
and sorts chronologically; the brighten interaction lives in
`components/teaser-card.tsx`.

## Run

npm run dev → / (home), /characters, /media, /locations, /teasers, /docs.
