import { notFound } from "next/navigation";
import { EntityCard } from "@/components/entity-card";
import { charactersById, locations, locationsById, mediaById } from "@/lib/data";
import Link from "next/link";

export function generateStaticParams() {
  return locations.map((l) => ({ id: l.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return { title: locationsById.get(id)?.name ?? "Location" };
}

const CANONICITY_COLOR: Record<string, string> = {
  confirmed: "border-signal text-signal",
  implied: "border-violet text-violet",
  theory: "border-rec text-rec",
};

export default async function LocationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const location = locationsById.get(id);
  if (!location) notFound();

  const roster = location.presentCharacters
    .map((characterId) => charactersById.get(characterId))
    .filter((c): c is NonNullable<typeof c> => Boolean(c));

  return (
    <article className="py-10">
      <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-faz-dim">
        {location.continuity} continuity · {location.status}
      </p>
      <h1 className="mt-1 max-w-3xl font-display text-3xl text-faz sm:text-4xl">{location.name}</h1>
      {location.owner ? <p className="mt-2 text-sm text-bone-dim">Owned by {location.owner}</p> : null}
      {location.causeOfClosure ? (
        <p className="mt-4 max-w-2xl border-l-2 border-seam pl-3 text-sm text-bone-dim">{location.causeOfClosure}</p>
      ) : null}

      <div className="mt-4 flex flex-wrap gap-2">
        {location.appearances.map((mediaId) => {
          const entry = mediaById.get(mediaId);
          if (!entry) return null;
          return (
            <Link
              key={mediaId}
              href={`/media/${mediaId}`}
              className="rounded-full border border-seam px-3 py-1 font-mono text-[11px] text-bone-dim transition-colors hover:border-faz-dim hover:text-faz"
            >
              {entry.title}
            </Link>
          );
        })}
      </div>

      {location.incidents?.length ? (
        <section className="mt-10">
          <h2 className="font-display text-xl text-bone">Incident report</h2>
          <div className="mt-4 space-y-3">
            {location.incidents.map((incident) => (
              <div key={incident.name} className="rounded-lg border border-seam bg-curtain p-4">
                <div className="flex flex-wrap items-baseline justify-between gap-3">
                  <h3 className="text-sm font-semibold text-bone">
                    {incident.name}
                    {incident.year ? <span className="ml-2 font-mono text-[11px] text-bone-dim">{incident.year}</span> : null}
                  </h3>
                  <span
                    className={`rounded-full border px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest ${CANONICITY_COLOR[incident.canonicity]}`}
                  >
                    {incident.canonicity}
                  </span>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-bone-dim">{incident.description}</p>
                {incident.source ? <p className="mt-1 text-xs text-bone-dim/70">{incident.source}</p> : null}
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {location.rooms?.length ? (
        <section className="mt-10">
          <h2 className="font-mono text-[11px] uppercase tracking-widest text-bone-dim">Rooms</h2>
          <div className="mt-2 flex flex-wrap gap-2">
            {location.rooms.map((room) => (
              <span key={room} className="rounded-full border border-seam px-3 py-1 font-mono text-[11px] text-bone-dim">
                {room}
              </span>
            ))}
          </div>
        </section>
      ) : null}

      {roster.length > 0 ? (
        <section className="mt-10">
          <h2 className="font-display text-xl text-bone">On the premises ({roster.length})</h2>
          <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {roster.map((character) => (
              <EntityCard
                key={character.id}
                href={`/characters/${character.id}`}
                imageUrl={character.imageUrl}
                title={character.name}
                subtitle={character.group ?? character.type}
              />
            ))}
          </div>
        </section>
      ) : null}

      {location.notes?.length ? (
        <section className="mt-10 rounded-lg border border-seam bg-curtain p-4">
          <h2 className="font-mono text-[11px] uppercase tracking-widest text-bone-dim">Archive notes</h2>
          <ul className="mt-2 space-y-1.5 text-sm text-bone-dim">
            {location.notes.map((note) => (
              <li key={note}>{note}</li>
            ))}
          </ul>
        </section>
      ) : null}
    </article>
  );
}
