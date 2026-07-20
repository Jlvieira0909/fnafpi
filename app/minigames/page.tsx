import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/page-header";
import { mediaById, minigames } from "@/lib/data";

export const metadata: Metadata = { title: "Minigames" };

export default function MinigamesPage() {
  const byGame = new Map<string, typeof minigames>();
  for (const m of minigames) byGame.set(m.media, [...(byGame.get(m.media) ?? []), m]);

  return (
    <div className="pb-10">
      <PageHeader
        eyebrow="Atari-style · between the nights"
        title="Minigames"
        description="The pixel-art interludes that carry the franchise's real story. This archive starts small and grows — check each entry's notes for what's still uncataloged."
      />
      <div className="mt-10 space-y-12">
        {Array.from(byGame.entries()).map(([mediaId, entries]) => {
          const game = mediaById.get(mediaId);
          return (
            <section key={mediaId}>
              <div className="flex items-baseline gap-3 border-b border-seam pb-2">
                <h2 className="font-display text-xl text-bone">{game?.title ?? mediaId}</h2>
                <span className="font-mono text-[11px] text-bone-dim">
                  {entries.length} minigame{entries.length > 1 ? "s" : ""}
                </span>
              </div>
              <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {entries.map((m) => (
                  <Link
                    key={m.id}
                    href={`/minigames/${m.id}`}
                    className="group overflow-hidden rounded-lg border border-seam bg-curtain transition-colors hover:border-faz-dim"
                  >
                    <div className="relative aspect-video bg-[radial-gradient(ellipse_at_center,#1c1626,#0b0a10_78%)]">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={m.images.screenshot} alt={m.name} className="h-full w-full object-cover" />
                    </div>
                    <div className="p-3">
                      <h3 className="text-sm font-semibold text-bone transition-colors group-hover:text-faz">{m.name}</h3>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
