import Link from "next/link";
import { notFound } from "next/navigation";
import { mediaById, minigames, minigamesById } from "@/lib/data";

export function generateStaticParams() {
  return minigames.map((m) => ({ id: m.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return { title: minigamesById.get(id)?.name ?? "Minigame" };
}

export default async function MinigamePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const minigame = minigamesById.get(id);
  if (!minigame) notFound();
  const game = mediaById.get(minigame.media);

  return (
    <article className="py-10">
      <div className="scanlines relative overflow-hidden rounded-lg border border-seam">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={minigame.images.screenshot} alt={minigame.name} className="aspect-video w-full object-cover" />
      </div>
      <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.25em] text-faz-dim">
        {game ? (
          <Link href={`/media/${game.id}`} className="hover:text-faz hover:underline">
            {game.title}
          </Link>
        ) : (
          minigame.media
        )}
      </p>
      <h1 className="mt-1 font-display text-3xl text-faz sm:text-4xl">{minigame.name}</h1>
      {minigame.description ? (
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-bone-dim">{minigame.description}</p>
      ) : null}
      {minigame.notes?.length ? (
        <section className="mt-8 rounded-lg border border-seam bg-curtain p-4">
          <h2 className="font-mono text-[11px] uppercase tracking-widest text-bone-dim">Archive notes</h2>
          <ul className="mt-2 space-y-1.5 text-sm text-bone-dim">
            {minigame.notes.map((note) => (
              <li key={note}>{note}</li>
            ))}
          </ul>
        </section>
      ) : null}
    </article>
  );
}
