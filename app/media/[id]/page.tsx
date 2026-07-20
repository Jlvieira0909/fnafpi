import Link from "next/link";
import { notFound } from "next/navigation";
import { EntityCard } from "@/components/entity-card";
import { charactersById, charactersIn, media, mediaById, minigames } from "@/lib/data";

export function generateStaticParams() {
  return media.map((m) => ({ id: m.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return { title: mediaById.get(id)?.title ?? "Media" };
}

export default async function MediaDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const entry = mediaById.get(id);
  if (!entry) notFound();

  const roster = charactersIn(entry.id)
    .map((characterId) => charactersById.get(characterId))
    .filter((c): c is NonNullable<typeof c> => Boolean(c));
  const parent = entry.parentId ? mediaById.get(entry.parentId) : undefined;
  const relatedMinigames = minigames.filter((m) => m.media === entry.id);
  const credits = Object.entries({
    Developer: entry.credits.developer,
    Publisher: entry.credits.publisher,
    Authors: entry.credits.authors?.join(", "),
    Illustrator: entry.credits.illustrator,
    Director: entry.credits.director,
    Writers: entry.credits.writers?.join(", "),
    Producers: entry.credits.producers?.join(", "),
    Studio: entry.credits.studio,
  }).filter(([, value]) => value);

  return (
    <article className="py-10">
      <div className="grid gap-8 lg:grid-cols-[minmax(0,320px)_1fr]">
        <div className="overflow-hidden rounded-lg border border-seam bg-curtain">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={entry.images.poster} alt={entry.title} className="aspect-[2/3] w-full object-contain p-6" />
        </div>
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-faz-dim">
            {entry.type} · {entry.continuity} continuity · {entry.releaseDate ?? "TBA"}
          </p>
          <h1 className="mt-1 font-display text-3xl text-faz sm:text-4xl">{entry.title}</h1>
          {entry.series ? (
            <p className="mt-2 text-sm text-bone-dim">
              {entry.series}
              {entry.seriesNumber ? ` · #${entry.seriesNumber}` : ""}
            </p>
          ) : null}
          {parent ? (
            <p className="mt-2 text-sm text-bone-dim">
              Expansion of{" "}
              <Link href={`/media/${parent.id}`} className="text-faz-dim underline-offset-2 hover:text-faz hover:underline">
                {parent.title}
              </Link>
            </p>
          ) : null}

          {credits.length > 0 ? (
            <dl className="mt-6 max-w-md">
              {credits.map(([label, value]) => (
                <div key={label} className="flex items-baseline justify-between gap-4 border-b border-seam py-2 text-sm">
                  <dt className="font-mono text-[11px] uppercase tracking-widest text-bone-dim">{label}</dt>
                  <dd className="text-right text-bone">{value}</dd>
                </div>
              ))}
            </dl>
          ) : null}

          {entry.credits.cast?.length ? (
            <section className="mt-6">
              <h2 className="font-mono text-[11px] uppercase tracking-widest text-bone-dim">Cast</h2>
              <ul className="mt-2 space-y-1 text-sm">
                {entry.credits.cast.map((member) => (
                  <li key={member.actor} className="text-bone-dim">
                    <span className="text-bone">{member.actor}</span> as {member.role}
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {entry.platforms?.length ? (
            <section className="mt-6">
              <h2 className="font-mono text-[11px] uppercase tracking-widest text-bone-dim">Platforms</h2>
              <div className="mt-2 flex flex-wrap gap-2">
                {entry.platforms.map((platform) => (
                  <span key={platform.platform} className="rounded-full border border-seam px-3 py-1 font-mono text-[11px] text-bone-dim">
                    {platform.platform}
                    {platform.releaseDate ? ` · ${platform.releaseDate}` : ""}
                  </span>
                ))}
              </div>
            </section>
          ) : null}

          {entry.notes?.length ? (
            <section className="mt-6 rounded-lg border border-seam bg-curtain p-4">
              <h2 className="font-mono text-[11px] uppercase tracking-widest text-bone-dim">Archive notes</h2>
              <ul className="mt-2 space-y-1.5 text-sm text-bone-dim">
                {entry.notes.map((note) => (
                  <li key={note}>{note}</li>
                ))}
              </ul>
            </section>
          ) : null}
        </div>
      </div>

      {relatedMinigames.length > 0 ? (
        <section className="mt-12">
          <h2 className="font-display text-xl text-bone">Minigames ({relatedMinigames.length})</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {relatedMinigames.map((m) => (
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
      ) : null}

      {roster.length > 0 ? (
        <section className="mt-12">
          <h2 className="font-display text-xl text-bone">Who&apos;s here ({roster.length})</h2>
          <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {roster.map((character) => (
              <EntityCard
                key={character.id}
                href={`/characters/${character.id}`}
                imageUrl={character.images.frame}
                title={character.name}
                subtitle={character.group ?? character.type}
              />
            ))}
          </div>
        </section>
      ) : null}
    </article>
  );
}
