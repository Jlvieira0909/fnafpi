"use client";

import { useEffect, useMemo, useState } from "react";
import { FnafdleAutocomplete, type AutocompleteOption } from "@/components/fnafdle-autocomplete";
import { FnafdleGuessList } from "@/components/fnafdle-guess-list";
import { FnafdleWinBanner } from "@/components/fnafdle-win-banner";
import { hashString, loadGuesses, localDateKey, pickDaily, saveGuesses } from "@/lib/fnafdle";

interface MinigameEntry {
  id: string;
  name: string;
  screenshot: string;
  mediaId: string;
  mediaTitle: string;
}

interface MediaOption {
  id: string;
  title: string;
}

function seededShuffle<T>(items: T[], seed: number): T[] {
  const arr = [...items];
  let s = seed;
  for (let i = arr.length - 1; i > 0; i--) {
    s = (s * 1103515245 + 12345) >>> 0;
    const j = s % (i + 1);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function FnafdleMinigames({ pool, mediaOptions }: { pool: MinigameEntry[]; mediaOptions: MediaOption[] }) {
  const [dateKey, setDateKey] = useState<string | null>(null);
  const [guessIds, setGuessIds] = useState<string[]>([]);
  const [bonusPick, setBonusPick] = useState<string | null>(null);

  useEffect(() => {
    const key = localDateKey();
    setDateKey(key);
    setGuessIds(loadGuesses(`fnafdle:minigames:${key}`));
    setBonusPick(window.localStorage.getItem(`fnafdle:minigames:bonus:${key}`));
  }, []);

  useEffect(() => {
    if (dateKey) saveGuesses(`fnafdle:minigames:${dateKey}`, guessIds);
  }, [guessIds, dateKey]);

  const mediaById = useMemo(() => new Map(mediaOptions.map((m) => [m.id, m])), [mediaOptions]);
  const minigame = useMemo(() => (dateKey ? pickDaily(pool, dateKey, "minigames") : null), [dateKey, pool]);
  const guesses = guessIds.map((id) => mediaById.get(id)).filter((g): g is MediaOption => Boolean(g));
  const won = minigame ? guessIds.includes(minigame.mediaId) : false;

  const bonusOptions = useMemo(() => {
    if (!minigame || !dateKey) return [];
    const others = pool.filter((m) => m.id !== minigame.id).map((m) => m.name);
    const decoys = seededShuffle(others, hashString(`${dateKey}:bonus`)).slice(0, 3);
    return seededShuffle([minigame.name, ...decoys], hashString(`${dateKey}:bonus:order`));
  }, [minigame, dateKey, pool]);

  if (!dateKey || !minigame) {
    return <p className="mt-10 font-pixel text-[10px] uppercase text-bone-dim">Loading save file…</p>;
  }

  const options: AutocompleteOption[] = mediaOptions.map((m) => ({ id: m.id, label: m.title }));
  const pick = (option: AutocompleteOption) => setGuessIds((prev) => [...prev, option.id]);

  const pickBonus = (name: string) => {
    setBonusPick(name);
    if (dateKey) window.localStorage.setItem(`fnafdle:minigames:bonus:${dateKey}`, name);
  };

  const shareText = () => {
    const marks = guesses.map((g) => (g.id === minigame.mediaId ? "🟩" : "🟥")).join("");
    return `FNAFDLE MINIGAMES ${dateKey} · ${guesses.length}/∞\n${marks}\n${window.location.origin}/fnafdle`;
  };

  return (
    <div className="mt-8">
      <div className="flex flex-col items-start gap-4 sm:flex-row">
        <div className="aspect-video w-full max-w-sm shrink-0 overflow-hidden rounded-lg border border-seam bg-[radial-gradient(ellipse_at_center,#1c1626,#0b0a10_78%)]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={minigame.screenshot} alt="Guess the game" className="h-full w-full object-cover" />
        </div>
        <div className="flex-1">
          <p className="max-w-sm font-mono text-xs leading-relaxed text-bone-dim">Which game does this minigame belong to?</p>
          {!won ? (
            <div className="mt-3">
              <FnafdleAutocomplete
                options={options}
                excludeIds={guessIds}
                onPick={pick}
                placeholder="Type a game title..."
                guessCount={guesses.length}
              />
            </div>
          ) : (
            <div className="mt-3">
              <FnafdleWinBanner answerLabel={minigame.mediaTitle} guessCount={guesses.length} shareText={shareText()} />
            </div>
          )}
        </div>
      </div>

      <FnafdleGuessList
        items={[...guesses].reverse().map((g) => ({ id: g.id, label: g.title, correct: g.id === minigame.mediaId }))}
      />

      {won ? (
        <div className="mt-8 max-w-md rounded-md border border-seam bg-curtain p-4">
          <p className="font-pixel text-[9px] uppercase leading-relaxed text-faz-dim">Bonus round</p>
          <p className="mt-1 text-sm text-bone">What is this minigame called?</p>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {bonusOptions.map((name) => {
              const isPicked = bonusPick === name;
              const isCorrect = name === minigame.name;
              const revealed = Boolean(bonusPick);
              return (
                <button
                  key={name}
                  type="button"
                  disabled={revealed}
                  onClick={() => pickBonus(name)}
                  className={`rounded-sm border px-3 py-2 text-left font-mono text-xs uppercase tracking-wide transition-colors ${
                    revealed && isCorrect
                      ? "border-signal/60 bg-signal/10 text-signal"
                      : revealed && isPicked
                        ? "border-rec/50 bg-rec/10 text-rec"
                        : "border-seam text-bone-dim hover:border-faz-dim hover:text-faz"
                  }`}
                >
                  {name}
                </button>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}
