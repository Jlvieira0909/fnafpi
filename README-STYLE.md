# Style fix + upgrade

## Why the site looked unstyled

The screenshot shows default fonts, white text and white borders — the
`@theme` tokens from globals.css were not compiling. Check, in order:

1. `app/globals.css` was actually replaced by the version in this zip
   (the old create-next-app file has no `@theme` block).
2. Tailwind version: run `npm ls tailwindcss`. This project's CSS uses
   **v4 syntax** (`@import "tailwindcss"` + `@theme`). If you're on v3,
   upgrade: `npm i tailwindcss@4 @tailwindcss/postcss` and make sure
   postcss.config.mjs contains `plugins: { "@tailwindcss/postcss": {} }`.
3. Restart the dev server after replacing globals.css — Tailwind caches.
4. Click the "1 Issue" overlay in the corner and read it; missing images
   under public/images/ will 404 but won't break styling.

This version also moves the font tokens to `@theme inline` (the correct
v4 pattern for tokens that reference runtime CSS variables from
next/font) — the previous file used plain `@theme` for them, which can
silently fail.

## What changed visually

- Stage spotlight behind the hero + page-wide vignette
- Pizzeria checkerboard floor strips as section/footer dividers
- Marquee glow on display headings (Bungee, uppercase)
- CCTV frames now have viewfinder corner brackets, a bottom status bar
  and a gold glow
- Cards: radial backdrop behind images, gold hover glow and lift
- Solid gold primary button; nav links with gold underline hover
- Canonicity badges now have tinted backgrounds

Files in this zip: app/globals.css, app/layout.tsx, app/page.tsx,
components/cam-frame.tsx, components/entity-card.tsx,
components/lore-badge.tsx, components/teaser-card.tsx.
Replace all seven; other pages pick the changes up automatically.
