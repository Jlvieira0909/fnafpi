"use client";

import { useEffect, useMemo, useState } from "react";
import { FnafdleAutocomplete, type AutocompleteOption } from "@/components/fnafdle-autocomplete";
import { FnafdleGuessList } from "@/components/fnafdle-guess-list";
import { FnafdleWinBanner } from "@/components/fnafdle-win-banner";
import { loadGuesses, localDateKey, pickDaily, saveGuesses } from "@/lib/fnafdle";

interface TeaserEntry {
  id: string;
  title: string;
  imageUrl: string;
  teasesId: string;
}

interface MediaOption {
  id: string;
  title: string;
}

export function FnafdleTeasers({ pool, mediaOptions }: { pool: TeaserEntry[]; mediaOptions: MediaOption[] }) {
  const [dateKey, setDateKey] = useState<string | null>(null);
  const [guessIds, setGuessIds] = useState<string[]>([]);
  const [bright, setBright] = useState(false);
  const [grayscale, setGrayscale] = useState(false);
  const [rotate, setRotate] = useState(false);

  useEffect(() => {
    const key = localDateKey();
    setDateKey(key);
    setGuessIds(loadGuesses(`fnafdle:teasers:${key}`));
  }, []);

  useEffect(() => {
    if (dateKey) saveGuesses(`fnafdle:teasers:${dateKey}`, guessIds);
  }, [guessIds, dateKey]);

  const byId = useMemo(() => new Map(mediaOptions.map((m) => [m.id, m])), [mediaOptions]);
  const teaser = useMemo(() => (dateKey ? pickDaily(pool, dateKey, "teasers") : null), [dateKey, pool]);
  const won = teaser ? guessIds.includes(teaser.teasesId) : false;
  const guesses = guessIds.map((id) => byId.get(id)).filter((g): g is MediaOption => Boolean(g));

  if (!dateKey || !teaser) {
    return <p className="mt-10 font-pixel text-[10px] uppercase text-bone-dim">Loading the archive…</p>;
  }

  const options: AutocompleteOption[] = mediaOptions.map((m) => ({ id: m.id, label: m.title }));
  const pick = (option: AutocompleteOption) => setGuessIds((prev) => [...prev, option.id]);
  const answerTitle = byId.get(teaser.teasesId)?.title ?? teaser.teasesId;

  const shareText = () => {
    const marks = guesses.map((g) => (g.id === teaser.teasesId ? "🟩" : "🟥")).join("");
    return `FNAFDLE TEASERS ${dateKey} · ${guesses.length}/∞\n${marks}\n${window.location.origin}/fnafdle`;
  };

  return (
    <div className="mt-8">
      <div className="flex flex-col items-start gap-4 sm:flex-row">
        <div className="relative aspect-video w-full max-w-sm shrink-0 overflow-hidden rounded-lg border border-seam bg-black">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={teaser.imageUrl}
            alt={teaser.title}
            className="h-full w-full object-cover transition-[filter,transform] duration-500"
            style={{
              filter: `brightness(${bright ? 2.2 : 0.3}) ${grayscale ? "grayscale(1)" : ""}`,
              transform: rotate ? "rotate(180deg)" : "none",
            }}
          />
          {!won ? (
            <button
              type="button"
              onPointerDown={() => setBright(true)}
              onPointerUp={() => setBright(false)}
              onPointerLeave={() => setBright(false)}
              className="absolute bottom-2 right-2 rounded border border-seam bg-stage/90 px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-bone-dim transition-colors hover:border-faz-dim hover:text-faz"
            >
              {bright ? "Release to darken" : "Hold to brighten"}
            </button>
          ) : null}
        </div>
        <div className="flex-1">
          <div className="flex flex-wrap gap-4 font-mono text-[11px] uppercase tracking-widest text-bone-dim">
            <label className="flex cursor-pointer items-center gap-1.5">
              <input type="checkbox" checked={grayscale} onChange={(e) => setGrayscale(e.target.checked)} className="accent-faz" />
              Grayscale
            </label>
            <label className="flex cursor-pointer items-center gap-1.5">
              <input type="checkbox" checked={rotate} onChange={(e) => setRotate(e.target.checked)} className="accent-faz" />
              Rotate 180°
            </label>
          </div>
          <p className="mt-3 max-w-sm font-mono text-xs leading-relaxed text-bone-dim">
            Which game, book or movie was this teaser announcing?
          </p>
          {!won ? (
            <div className="mt-3">
              <FnafdleAutocomplete
                options={options}
                excludeIds={guessIds}
                onPick={pick}
                placeholder="Type a title..."
                guessCount={guesses.length}
              />
            </div>
          ) : (
            <div className="mt-3">
              <FnafdleWinBanner answerLabel={answerTitle} guessCount={guesses.length} shareText={shareText()} />
            </div>
          )}
        </div>
      </div>

      <FnafdleGuessList
        items={[...guesses].reverse().map((g) => ({ id: g.id, label: g.title, correct: g.id === teaser.teasesId }))}
      />
    </div>
  );
}
