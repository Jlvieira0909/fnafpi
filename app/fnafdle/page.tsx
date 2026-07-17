import type { Metadata } from "next";
import { FnafdleGame } from "@/components/fnafdle-game";
import { PageHeader } from "@/components/page-header";
import { characters, charactersById, mediaById } from "@/lib/data";

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
  const pool = [...characters]
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

  return (
    <div className="pb-10">
      <PageHeader
        eyebrow="Custom Night · one per day"
        title="FNAFDLE"
        description="Guess tonight's character. Every guess lights up the attributes you got right — green is a match, red is a miss, arrows point toward the debut year. All 151 archive entries are in the pool."
      />
      <FnafdleGame pool={pool} />
    </div>
  );
}
