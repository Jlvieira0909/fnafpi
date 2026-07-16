import type { Metadata } from "next";
import Link from "next/link";
import { FilterChips } from "@/components/filter-chips";
import { PageHeader } from "@/components/page-header";
import { media } from "@/lib/data";

export const metadata: Metadata = { title: "Timeline" };

const TYPES = ["Game", "DLC", "Book", "Movie"];

const TYPE_STYLE: Record<string, string> = {
  Game: "border-faz/50 text-faz",
  DLC: "border-faz-dim/60 text-faz-dim",
  Book: "border-signal/50 text-signal",
  Movie: "border-rec/50 text-rec",
};

export default async function MediaPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const params = await searchParams;
  const type = params.type ?? null;

  const results = media
    .filter((m) => !type || m.type.toLowerCase() === type.toLowerCase())
    .sort((a, b) =>
      (a.releaseDate ?? "9999").localeCompare(b.releaseDate ?? "9999")
    );

  const byYear = new Map<string, typeof results>();
  for (const entry of results) {
    const year = entry.releaseDate?.slice(0, 4) ?? "TBA";
    byYear.set(year, [...(byYear.get(year) ?? []), entry]);
  }
  const years = Array.from(byYear.entries());

  return (
    <div className="pb-10">
      <PageHeader
        eyebrow="Release history · 2014 — today"
        title="Timeline"
        description="Every release in real-world order — one night on the job per year. The in-universe chronology is a different beast entirely."
      />
      <div className="mt-6">
        <FilterChips
          basePath="/media"
          param="type"
          options={TYPES}
          active={type}
          otherParams={{}}
        />
      </div>

      <div className="mt-12 flex items-center gap-3">
        <span className="font-pixel text-[11px] text-rec">12:00 AM</span>
        <div className="h-px flex-1 bg-gradient-to-r from-rec/40 to-transparent" />
        <span className="font-mono text-[10px] uppercase tracking-widest text-bone-dim">
          Shift starts
        </span>
      </div>

      <div className="mt-10 space-y-12">
        {years.map(([year, entries], index) => (
          <section key={year} className="grid gap-4 sm:grid-cols-[130px_1fr]">
            <div>
              <p className="font-pixel text-[9px] uppercase leading-relaxed text-faz-dim">
                {year === "TBA"
                  ? "Night ??"
                  : `Night ${String(index + 1).padStart(2, "0")}`}
              </p>
              <h2 className="marquee font-display text-3xl uppercase text-bone/80">
                {year}
              </h2>
              <p className="mt-1 font-mono text-[10px] uppercase tracking-widest text-bone-dim">
                {entries.length} release{entries.length > 1 ? "s" : ""}
              </p>
            </div>
            <ul className="relative space-y-1.5 border-l border-seam pl-6">
              {entries.map((entry) => (
                <li key={entry.id} className="relative">
                  <span className="absolute -left-[29.5px] top-2.5 h-2 w-2 rounded-full border border-faz bg-stage shadow-[0_0_8px_rgba(183,139,255,0.55)]" />
                  <Link
                    href={`/media/${entry.id}`}
                    className="group -mx-2 flex flex-wrap items-baseline gap-x-3 gap-y-1 rounded-md px-2 py-1.5 transition-colors hover:bg-curtain"
                  >
                    <span
                      className={`rounded border px-1.5 py-0.5 font-pixel text-[8px] uppercase leading-none ${
                        TYPE_STYLE[entry.type]
                      }`}
                    >
                      {entry.type}
                    </span>
                    <span className="text-sm text-bone transition-colors group-hover:text-faz">
                      {entry.title}
                      {entry.mainSeries ? (
                        <span
                          className="ml-2 align-middle text-[10px] text-faz"
                          title="Mainline entry"
                        >
                          ◆
                        </span>
                      ) : null}
                    </span>
                    <span className="font-mono text-[11px] text-bone-dim/70">
                      {entry.releaseDate ?? "TBA"}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      <div className="mt-16 flex items-center gap-3">
        <span className="font-pixel text-[11px] text-signal">6:00 AM</span>
        <div className="h-px flex-1 bg-gradient-to-r from-signal/50 to-transparent" />
        <span className="font-mono text-[10px] uppercase tracking-widest text-bone-dim">
          You made it to the end of the archive
        </span>
      </div>
    </div>
  );
}
