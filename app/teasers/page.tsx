import type { Metadata } from "next";
import { TeaserCard } from "@/components/teaser-card";
import { mediaById, teasers } from "@/lib/data";
import { PageHeader } from "@/components/page-header";

export const metadata: Metadata = { title: "Teasers" };

export default function TeasersPage() {
  const sorted = [...teasers].sort((a, b) => (a.postedDate ?? "9999").localeCompare(b.postedDate ?? "9999"));

  const byGame = new Map<string, typeof sorted>();
  for (const teaser of sorted) {
    const key = teaser.teases ?? "misc";
    byGame.set(key, [...(byGame.get(key) ?? []), teaser]);
  }

  return (
    <div className="pb-10">
      <PageHeader
        eyebrow="scottgames.com"
        title="The teaser wall"
        description="For years, the franchise's marketing was a single dark image on a plain white page. The community ritual: download it, raise the brightness, find the secret. This wall preserves that ritual — hold each image to brighten it."
      />
      <div className="mt-12 space-y-14">
        {Array.from(byGame.entries()).map(([mediaId, entries]) => {
          const teased = mediaById.get(mediaId);
          return (
            <section key={mediaId}>
              <div className="flex items-baseline gap-3 border-b border-seam pb-2">
                <h2 className="font-display text-xl text-bone">{teased?.title ?? "Miscellaneous"}</h2>
                <span className="font-mono text-[11px] text-bone-dim">
                  {entries.length} teaser{entries.length > 1 ? "s" : ""}
                </span>
              </div>
              <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {entries.map((teaser) => (
                  <TeaserCard key={teaser.id} teaser={teaser} teasedTitle={teased?.title} />
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
