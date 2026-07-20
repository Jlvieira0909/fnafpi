"use client";

import { useEffect, useMemo, useState } from "react";
import { FnafdleAutocomplete, type AutocompleteOption } from "@/components/fnafdle-autocomplete";
import { FnafdleGuessList } from "@/components/fnafdle-guess-list";
import { FnafdleWinBanner } from "@/components/fnafdle-win-banner";
import { hashString, loadGuesses, localDateKey, pickDaily, saveGuesses } from "@/lib/fnafdle";

interface ImageEntry {
  id: string;
  name: string;
  full: string;
  continuity: string;
}

const ZOOM_STEPS = [3.4, 3.0, 2.6, 2.2, 1.8, 1.4, 1.0];

export function FnafdleImage({ pool }: { pool: ImageEntry[] }) {
  const [dateKey, setDateKey] = useState<string | null>(null);
  const [guessIds, setGuessIds] = useState<string[]>([]);
  const [grayscale, setGrayscale] = useState(false);
  const [rotate, setRotate] = useState(false);

  useEffect(() => {
    const key = localDateKey();
    setDateKey(key);
    setGuessIds(loadGuesses(`fnafdle:image:${key}`));
  }, []);

  useEffect(() => {
    if (dateKey) saveGuesses(`fnafdle:image:${dateKey}`, guessIds);
  }, [guessIds, dateKey]);

  const byId = useMemo(() => new Map(pool.map((e) => [e.id, e])), [pool]);
  const answer = useMemo(() => (dateKey ? pickDaily(pool, dateKey, "image") : null), [dateKey, pool]);
  const origin = useMemo(() => {
    if (!dateKey) return { x: 50, y: 50 };
    const h = hashString(`${dateKey}:image:origin`);
    return { x: 20 + (h % 60), y: 20 + ((h >> 8) % 60) };
  }, [dateKey]);

  const guesses = guessIds.map((id) => byId.get(id)).filter((g): g is ImageEntry => Boolean(g));
  const won = answer ? guessIds.includes(answer.id) : false;
  const wrongCount = guesses.filter((g) => g.id !== answer?.id).length;
  const scale = won ? 1 : ZOOM_STEPS[Math.min(wrongCount, ZOOM_STEPS.length - 1)];

  if (!dateKey || !answer) {
    return <p className="mt-10 font-pixel text-[10px] uppercase text-bone-dim">Focusing the lens…</p>;
  }

  const options: AutocompleteOption[] = pool.map((e) => ({ id: e.id, label: e.name, sublabel: e.continuity }));

  const pick = (option: AutocompleteOption) => setGuessIds((prev) => [...prev, option.id]);

  const shareText = () => {
    const marks = guesses.map((g) => (g.id === answer.id ? "🟩" : "🟥")).join("");
    return `FNAFDLE IMAGE ${dateKey} · ${guesses.length}/∞\n${marks}\n${window.location.origin}/fnafdle`;
  };

  return (
    <div className="mt-8">
      <div className="flex flex-col items-start gap-4 sm:flex-row">
        <div className="h-[320px] w-[240px] shrink-0 overflow-hidden rounded-lg border border-seam bg-[radial-gradient(ellipse_at_center,#1c1626,#0b0a10_78%)]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={answer.full}
            alt="Guess who"
            className="h-full w-full object-cover transition-transform duration-500 ease-out"
            style={{
              transform: `scale(${scale}) rotate(${rotate ? 180 : 0}deg)`,
              transformOrigin: `${origin.x}% ${origin.y}%`,
              filter: grayscale ? "grayscale(1)" : "none",
            }}
          />
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
          <p className="mt-3 font-mono text-[10px] uppercase tracking-widest text-bone-dim">
            {won ? "Fully zoomed out" : `Zoom level ${wrongCount + 1} of ${ZOOM_STEPS.length}`}
          </p>
          {!won ? (
            <div className="mt-3">
              <FnafdleAutocomplete
                options={options}
                excludeIds={guessIds}
                onPick={pick}
                placeholder="Type a character name..."
                guessCount={guesses.length}
              />
            </div>
          ) : (
            <div className="mt-3">
              <FnafdleWinBanner answerLabel={answer.name} guessCount={guesses.length} shareText={shareText()} />
            </div>
          )}
        </div>
      </div>

      <FnafdleGuessList
        items={[...guesses].reverse().map((g) => ({ id: g.id, label: g.name, correct: g.id === answer.id }))}
      />
    </div>
  );
}
