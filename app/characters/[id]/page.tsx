import Link from "next/link";
import { notFound } from "next/navigation";
import { CamFrame } from "@/components/cam-frame";
import { LoreBadge } from "@/components/lore-badge";
import { characters, charactersById, mediaById, variantsOf } from "@/lib/data";

export function generateStaticParams() {
  return characters.map((c) => ({ id: c.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return { title: charactersById.get(id)?.name ?? "Character" };
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-seam py-2 text-sm">
      <span className="font-mono text-[11px] uppercase tracking-widest text-bone-dim">{label}</span>
      <span className="text-right text-bone">{value}</span>
    </div>
  );
}

export default async function CharacterPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const character = charactersById.get(id);
  if (!character) notFound();

  const variants = variantsOf(character.id);
  const base = character.variantOf ? charactersById.get(character.variantOf) : undefined;
  const debut = mediaById.get(character.debut);

  return (
    <article className="grid gap-8 py-10 lg:grid-cols-[minmax(0,380px)_1fr]">
      <div>
        <CamFrame src={character.images.full} alt={character.name} label={`CAM · ${character.id}`} />
      </div>
      <div>
        <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-faz-dim">
          {character.continuity} continuity
        </p>
        <h1 className="mt-1 font-display text-3xl text-faz sm:text-4xl">{character.name}</h1>
        {base ? (
          <p className="mt-2 text-sm text-bone-dim">
            Variant of{" "}
            <Link href={`/characters/${base.id}`} className="text-faz-dim underline-offset-2 hover:text-faz hover:underline">
              {base.name}
            </Link>
          </p>
        ) : null}

        <div className="mt-6">
          <Fact label="Type" value={character.type} />
          {character.group ? <Fact label="Group" value={character.group} /> : null}
          {character.gender ? <Fact label="Gender" value={character.gender} /> : null}
          {character.color ? <Fact label="Color" value={character.color} /> : null}
          {debut ? <Fact label="Debut" value={debut.title} /> : null}
        </div>

        {(character.possessedBy || character.status) && (
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {character.possessedBy ? <LoreBadge claim={character.possessedBy} label="Possessed by" /> : null}
            {character.status ? <LoreBadge claim={character.status} label="Status" /> : null}
          </div>
        )}

        {variants.length > 0 ? (
          <section className="mt-8">
            <h2 className="font-mono text-[11px] uppercase tracking-widest text-bone-dim">Variants</h2>
            <div className="mt-2 flex flex-wrap gap-2">
              {variants.map((variantId) => {
                const variant = charactersById.get(variantId);
                if (!variant) return null;
                return (
                  <Link
                    key={variantId}
                    href={`/characters/${variantId}`}
                    className="rounded-full border border-seam px-3 py-1 text-xs text-bone-dim transition-colors hover:border-faz-dim hover:text-faz"
                  >
                    {variant.name}
                  </Link>
                );
              })}
            </div>
          </section>
        ) : null}

        {character.counterparts?.length ? (
          <section className="mt-6">
            <h2 className="font-mono text-[11px] uppercase tracking-widest text-bone-dim">In other continuities</h2>
            <div className="mt-2 flex flex-wrap gap-2">
              {character.counterparts.map((counterpartId) => {
                const counterpart = charactersById.get(counterpartId);
                if (!counterpart) return null;
                return (
                  <Link
                    key={counterpartId}
                    href={`/characters/${counterpartId}`}
                    className="rounded-full border border-violet/40 px-3 py-1 text-xs text-violet transition-colors hover:border-violet"
                  >
                    {counterpart.name}
                  </Link>
                );
              })}
            </div>
          </section>
        ) : null}

        <section className="mt-8">
          <h2 className="font-mono text-[11px] uppercase tracking-widest text-bone-dim">Appearances</h2>
          <ul className="mt-2 space-y-1">
            {character.appearances.map((mediaId) => {
              const entry = mediaById.get(mediaId);
              if (!entry) return null;
              return (
                <li key={mediaId}>
                  <Link href={`/media/${mediaId}`} className="text-sm text-bone-dim underline-offset-2 hover:text-faz hover:underline">
                    {entry.title}
                  </Link>
                  <span className="ml-2 font-mono text-[11px] text-bone-dim/70">{entry.releaseDate ?? "TBA"}</span>
                </li>
              );
            })}
          </ul>
        </section>

        {character.worldAttacks?.length ? (
          <section className="mt-8">
            <h2 className="font-mono text-[11px] uppercase tracking-widest text-bone-dim">FNaF World attacks</h2>
            <div className="mt-2 grid gap-2 sm:grid-cols-3">
              {character.worldAttacks.map((attack) => (
                <div key={attack.name} className="rounded-md border border-seam bg-curtain p-3">
                  <p className="font-pixel text-[9px] uppercase leading-relaxed text-signal">{attack.name}</p>
                  {attack.description ? <p className="mt-1.5 text-xs text-bone-dim">{attack.description}</p> : null}
                </div>
              ))}
            </div>
          </section>
        ) : null}

        {character.ucnVoiceLine ? (
          <section className="mt-8">
            <h2 className="font-mono text-[11px] uppercase tracking-widest text-bone-dim">Ultimate Custom Night</h2>
            <div className="mt-2 rounded-md border border-seam bg-curtain p-3.5">
              <div className="flex items-center justify-between gap-3">
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-bone-dim">Voice line</span>
                <span
                  className={`rounded-full border px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest ${
                    character.ucnVoiceLine.canonicity === "confirmed"
                      ? "border-signal bg-signal/10 text-signal"
                      : "border-violet bg-violet/10 text-violet"
                  }`}
                >
                  {character.ucnVoiceLine.canonicity}
                </span>
              </div>
              <p className="mt-1.5 text-sm italic text-bone">&ldquo;{character.ucnVoiceLine.line}&rdquo;</p>
              {character.ucnVoiceLine.source ? (
                <p className="mt-1 text-xs leading-relaxed text-bone-dim">{character.ucnVoiceLine.source}</p>
              ) : null}
            </div>
          </section>
        ) : null}

        {character.notes?.length ? (
          <section className="mt-8 rounded-lg border border-seam bg-curtain p-4">
            <h2 className="font-mono text-[11px] uppercase tracking-widest text-bone-dim">Archive notes</h2>
            <ul className="mt-2 space-y-1.5 text-sm text-bone-dim">
              {character.notes.map((note) => (
                <li key={note}>{note}</li>
              ))}
            </ul>
          </section>
        ) : null}
      </div>
    </article>
  );
}
