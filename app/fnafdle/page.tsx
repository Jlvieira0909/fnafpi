import type { Metadata } from "next";
import { FnafdleModes } from "@/components/fnafdle-modes";
import { PageHeader } from "@/components/page-header";
import { charactersById, charactersIn, characters, media, mediaById, minigames, teasers } from "@/lib/data";

export const metadata: Metadata = { title: "FNAFDLE" };

function familyRoot(id: string): string {
  let cursor = charactersById.get(id);
  const seen = new Set<string>();
  while (cursor?.variantOf && !seen.has(cursor.id)) {
    seen.add(cursor.id);
    const base = charactersById.get(cursor.variantOf);
    if (!base) break;
    cursor = base;
  }
  return cursor?.name ?? id;
}

export default function FnafdlePage() {
  const classicPool = [...characters]
    .sort((a, b) => a.id.localeCompare(b.id))
    .map((c) => ({
      id: c.id,
      name: c.name,
      frame: c.images.frame,
      type: c.type,
      continuity: c.continuity,
      group: c.group ?? "None",
      gender: c.gender ?? "Unknown",
      family: familyRoot(c.id),
      debutYear: Number(mediaById.get(c.debut)?.releaseDate?.slice(0, 4) ?? 0),
    }));

  const imagePool = [...characters]
    .sort((a, b) => a.id.localeCompare(b.id))
    .map((c) => ({ id: c.id, name: c.name, full: c.images.full, continuity: c.continuity }));

  const games = media.filter((m) => m.type === "Game").sort((a, b) => a.id.localeCompare(b.id));
  const gamesPool = games.map((g) => {
    const clues: string[] = [`Continuity: ${g.continuity}`];
    if (g.credits.developer) clues.push(`Developer: ${g.credits.developer}`);
    else if (g.credits.publisher) clues.push(`Publisher: ${g.credits.publisher}`);
    if (g.releaseDate) clues.push(`Released: ${g.releaseDate}`);
    if (g.series) clues.push(`Series: ${g.series}${g.seriesNumber ? ` #${g.seriesNumber}` : ""}`);
    if (g.platforms?.[0]) clues.push(`First platform: ${g.platforms[0].platform}`);
    clues.push(`${charactersIn(g.id).length} characters appear in this entry`);
    return { id: g.id, title: g.title, poster: g.images.poster, clues };
  });

  const mediaOptions = media
    .map((m) => ({ id: m.id, title: m.title }))
    .sort((a, b) => a.title.localeCompare(b.title));

  const teasersPool = teasers
    .filter((t) => t.teases && mediaById.has(t.teases))
    .map((t) => ({ id: t.id, title: t.title, imageUrl: t.imageUrl, teasesId: t.teases as string }));

  const minigamesPool = minigames.map((m) => ({
    id: m.id,
    name: m.name,
    screenshot: m.images.screenshot,
    mediaId: m.media,
    mediaTitle: mediaById.get(m.media)?.title ?? m.media,
  }));
  const minigamesMediaOptions = Array.from(new Map(minigamesPool.map((m) => [m.mediaId, m.mediaTitle])).entries())
    .map(([id, title]) => ({ id, title }))
    .sort((a, b) => a.title.localeCompare(b.title));

  const worldPool = characters
    .filter((c) => c.worldAttacks?.length)
    .map((c) => ({ id: c.id, name: c.name, frame: c.images.frame, attacks: c.worldAttacks ?? [] }));

  return (
    <div className="pb-10">
      <PageHeader
        eyebrow="Custom Night · one per day"
        title="FNAFDLE"
        description="Six ways to test what you know. Every mode picks a new answer at midnight, and your progress on each is saved locally per day."
      />
      <FnafdleModes
        classicPool={classicPool}
        imagePool={imagePool}
        gamesPool={gamesPool}
        teasersPool={teasersPool}
        teasersMediaOptions={mediaOptions}
        minigamesPool={minigamesPool}
        minigamesMediaOptions={minigamesMediaOptions}
        worldPool={worldPool}
      />
    </div>
  );
}
