"use client";

import { useState } from "react";
import type { Teaser } from "@/types";

export function TeaserCard({ teaser, teasedTitle }: { teaser: Teaser; teasedTitle?: string }) {
  const [bright, setBright] = useState(false);

  return (
    <figure className="overflow-hidden rounded-lg border border-seam bg-curtain transition-all hover:border-faz-dim">
      <div className="relative aspect-video bg-black">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={teaser.imageUrl}
          alt={teaser.title}
          loading="lazy"
          className="h-full w-full object-cover transition-[filter] duration-500"
          style={{ filter: bright ? "brightness(2.2) contrast(0.95)" : "brightness(0.3)" }}
        />
        <span className="absolute left-2 top-2 rounded bg-black/70 px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-widest text-bone-dim">
          {teaser.source}
        </span>
        <button
          type="button"
          onPointerDown={() => setBright(true)}
          onPointerUp={() => setBright(false)}
          onPointerLeave={() => setBright(false)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              setBright((b) => !b);
            }
          }}
          className={`absolute bottom-2 right-2 rounded border px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest transition-colors ${
            bright
              ? "border-faz bg-faz text-stage"
              : "border-seam bg-stage/90 text-bone-dim hover:border-faz-dim hover:text-faz"
          }`}
        >
          {bright ? "Release to darken" : "Hold to brighten"}
        </button>
      </div>
      <figcaption className="space-y-1.5 p-3.5">
        <div className="flex items-baseline justify-between gap-3">
          <h3 className="text-sm font-semibold text-bone">{teaser.title}</h3>
          <span className="shrink-0 font-mono text-[11px] text-bone-dim">{teaser.postedDate ?? "—"}</span>
        </div>
        {teasedTitle ? (
          <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-faz-dim">Teasing {teasedTitle}</p>
        ) : null}
        {teaser.description ? <p className="text-xs leading-relaxed text-bone-dim">{teaser.description}</p> : null}
        {teaser.hiddenContent ? (
          <p
            className="border-l-2 border-violet pl-2 text-xs italic text-violet transition-opacity duration-500"
            style={{ opacity: bright ? 1 : 0.25 }}
          >
            {teaser.hiddenContent}
          </p>
        ) : null}
      </figcaption>
    </figure>
  );
}
