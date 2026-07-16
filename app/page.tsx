import Link from "next/link";
import { characters, locations, media, teasers } from "@/lib/data";

const SECTIONS = [
  {
    href: "/characters",
    cam: "CAM 1A",
    title: "Characters",
    description: "Every animatronic and human, organized by design lineage across four continuities.",
    stat: "variantOf · counterparts · lore claims",
  },
  {
    href: "/media",
    cam: "CAM 1B",
    title: "Timeline",
    description: "Games, DLCs, books and movies in release order, from Desura 2014 to today.",
    stat: "release history · credits · rosters",
  },
  {
    href: "/locations",
    cam: "CAM 1C",
    title: "Locations",
    description: "The venues and their incidents — from Fredbear's Family Diner to the ruined Pizzaplex.",
    stat: "incident reports · canonicity",
  },
  {
    href: "/teasers",
    cam: "CAM 2A",
    title: "Teasers",
    description: "The scottgames.com archive. Hold to brighten, just like the community always did.",
    stat: "hidden content · brighten ritual",
  },
];

export default function HomePage() {
  const stats = [
    { value: characters.length, label: "characters" },
    { value: media.length, label: "media entries" },
    { value: locations.length, label: "locations" },
    { value: teasers.length, label: "teasers" },
  ];
  const max = Math.max(...stats.map((s) => s.value));

  return (
    <div>
      <section className="full-bleed spotlight scanlines tv-noise relative overflow-hidden border-b border-seam pb-16 pt-16 sm:pb-20 sm:pt-24">
        <div className="stars pointer-events-none absolute inset-0" />
        <div className="curtain pointer-events-none" aria-hidden />
        <div className="curtain curtain-right pointer-events-none" aria-hidden />
        <div className="eyes eyes-blink" style={{ right: "6%", top: "38%" }} aria-hidden>
          <span />
          <span />
        </div>
        <div className="eyes eyes-red eyes-blink-slow" style={{ right: "3%", top: "64%" }} aria-hidden>
          <span />
          <span />
        </div>
        <div className="eyes eyes-blink-slow" style={{ left: "4%", top: "56%" }} aria-hidden>
          <span />
          <span />
        </div>
        <div className="pointer-events-none absolute inset-x-0 top-4 z-10 mx-auto flex max-w-6xl justify-between px-4 font-pixel text-[9px] uppercase text-bone/60">
          <span>Cam 1A · Show Stage</span>
          <span className="flex items-center gap-1.5 text-rec">
            <span className="rec-dot inline-block h-1.5 w-1.5 rounded-full bg-rec" />
            Night 1 · 12:00 AM
          </span>
        </div>
        <div className="relative mx-auto max-w-6xl px-4">
          <p className="mt-4 font-pixel text-[10px] uppercase leading-relaxed tracking-wider text-faz-dim">
            The Fazbear Archive
          </p>
          <div className="bulbs mt-5 max-w-md" />
          <h1 className="marquee flicker mt-4 max-w-4xl font-display text-4xl uppercase leading-[1.05] text-faz sm:text-6xl">
            Five nights,
            <br />
            fully cataloged.
          </h1>
          <div className="bulbs mt-4 max-w-md" />
          <p className="mt-6 max-w-xl leading-relaxed text-bone-dim">
            A museum of the entire franchise — and the free public API behind it. Lore claims carry their canonicity;
            theories are labeled as theories.
          </p>

          <div className="mt-10 max-w-lg rounded-md border border-seam bg-curtain/80 p-4">
            <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.2em] text-bone-dim">
              <span>Archive systems</span>
              <span className="text-signal">Power left: 100%</span>
            </div>
            <div className="mt-3 space-y-2.5">
              {stats.map((stat) => (
                <div key={stat.label} className="grid grid-cols-[110px_1fr_auto] items-center gap-3">
                  <span className="font-mono text-[10px] uppercase tracking-widest text-bone-dim">{stat.label}</span>
                  <div className="power-bar" style={{ width: `${Math.max(12, (stat.value / max) * 100)}%` }} />
                  <span className="font-pixel text-[11px] text-signal">{stat.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-10 flex flex-wrap gap-3">
            <Link
              href="/characters"
              className="rounded bg-faz px-5 py-2.5 font-mono text-xs font-medium uppercase tracking-widest text-stage transition-all hover:bg-faz-hot"
            >
              Enter the archive
            </Link>
            <a
              href="/docs"
              className="rounded border border-seam px-5 py-2.5 font-mono text-xs uppercase tracking-widest text-bone-dim transition-colors hover:border-faz-dim hover:text-faz"
            >
              Build with the API
            </a>
          </div>
        </div>
        <div className="checker absolute inset-x-0 bottom-0" />
      </section>

      <section className="grid items-start gap-8 py-14 lg:grid-cols-[1fr_320px]">
        <div className="grid gap-4 sm:grid-cols-2">
          {SECTIONS.map((section) => (
            <Link
              key={section.href}
              href={section.href}
              className="group relative overflow-hidden rounded-lg border border-seam bg-curtain p-6 transition-all hover:border-faz-dim hover:bg-curtain-2"
            >
              <h2 className="font-display text-2xl uppercase text-bone transition-colors group-hover:text-faz">
                {section.title}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-bone-dim">{section.description}</p>
              <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.2em] text-faz-dim">{section.stat}</p>
              <span className="absolute right-4 top-4 font-pixel text-[9px] uppercase text-bone-dim/60 transition-colors group-hover:text-rec">
                {section.cam}
              </span>
            </Link>
          ))}
        </div>

        <aside className="clipping rounded-sm p-6">
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] opacity-60">Classifieds · est. 1993</p>
          <h2 className="mt-2 font-display text-3xl uppercase leading-none">Help wanted</h2>
          <p className="mt-3 text-sm font-medium leading-snug">
            Developers wanted to build on a free public API.
          </p>
          <p className="mt-2 text-sm leading-snug opacity-80">
            {characters.length} characters, {media.length} media entries, locations and teasers — served as JSON with
            filters and pagination. Monitor from home. No night shifts. Not responsible for damage to person or
            property.
          </p>
          <a
            href="/docs"
            className="mt-4 inline-block border-b-2 border-[#1c1512] font-mono text-xs uppercase tracking-widest transition-opacity hover:opacity-70"
          >
            Read the docs →
          </a>
        </aside>
      </section>
    </div>
  );
}
