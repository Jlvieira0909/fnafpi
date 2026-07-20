"use client";

import { useEffect, useMemo, useState } from "react";
import { FnafdleAutocomplete, type AutocompleteOption } from "@/components/fnafdle-autocomplete";
import { FnafdleGuessList } from "@/components/fnafdle-guess-list";
import { FnafdleWinBanner } from "@/components/fnafdle-win-banner";
import { loadGuesses, localDateKey, pickDaily, saveGuesses } from "@/lib/fnafdle";

interface GameEntry {
  id: string;
  title: string;
  poster: string;
  clues: string[];
}

export function FnafdleGames({ pool }: { pool: GameEntry[] }) {
  const [dateKey, setDateKey] = useState<string | null>(null);
  const [guessIds, setGuessIds] = useState<string[]>([]);

  useEffect(() => {
    const key = localDateKey();
    setDateKey(key);
    setGuessIds(loadGuesses(`fnafdle:games:${key}`));
  }, []);

  useEffect(() => {
    if (dateKey) saveGuesses(`fnafdle:games:${dateKey}`, guessIds);
  }, [guessIds, dateKey]);

  const byId = useMemo(() => new Map(pool.map((g) => [g.id, g])), [pool]);
  const answer = useMemo(() => (dateKey ? pickDaily(pool, dateKey, "games") : null), [dateKey, pool]);
  const guesses = guessIds.map((id) => byId.get(id)).filter((g): g is GameEntry => Boolean(g));
  const won = answer ? guessIds.includes(answer.id) : false;
  const wrongCount = guesses.filter((g) => g.id !== answer?.id).length;

  if (!dateKey || !answer) {
    return <p className="mt-10 font-pixel text-[10px] uppercase text-bone-dim">Pulling case files…</p>;
  }

  const revealedCount = won ? answer.clues.length : Math.min(wrongCount + 1, answer.clues.length);
  const options: AutocompleteOption[] = pool.map((g) => ({ id: g.id, label: g.title }));
  const pick = (option: AutocompleteOption) => setGuessIds((prev) => [...prev, option.id]);

  const shareText = () => {
    const marks = guesses.map((g) => (g.id === answer.id ? "🟩" : "🟥")).join("");
    return `FNAFDLE GAMES ${dateKey} · ${guesses.length}/∞\n${marks}\n${window.location.origin}/fnafdle`;
  };

  return (
    <div className="mt-8">
      <div className="max-w-md space-y-2">
        {answer.clues.slice(0, revealedCount).map((clue, i) => (
          <div key={i} className="flex items-start gap-2.5 rounded-sm border border-seam bg-curtain px-3 py-2">
            <span className="font-pixel text-[9px] text-faz-dim">{String(i + 1).padStart(2, "0")}</span>
            <span className="font-mono text-xs text-bone-dim">{clue}</span>
          </div>
        ))}
        {!won && revealedCount < answer.clues.length ? (
          <p className="font-mono text-[10px] uppercase tracking-widest text-bone-dim/70">
            {answer.clues.length - revealedCount} more clue{answer.clues.length - revealedCount === 1 ? "" : "s"} on the next miss
          </p>
        ) : null}
      </div>

      <div className="mt-6">
        {!won ? (
          <FnafdleAutocomplete
            options={options}
            excludeIds={guessIds}
            onPick={pick}
            placeholder="Type a game title..."
            guessCount={guesses.length}
          />
        ) : (
          <div className="flex flex-col items-start gap-4 sm:flex-row">
            <div className="w-32 shrink-0 overflow-hidden rounded-md border border-seam bg-curtain">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={answer.poster} alt={answer.title} className="aspect-[2/3] w-full object-contain p-2" />
            </div>
            <FnafdleWinBanner answerLabel={answer.title} guessCount={guesses.length} shareText={shareText()} />
          </div>
        )}
      </div>

      <FnafdleGuessList
        items={[...guesses].reverse().map((g) => ({ id: g.id, label: g.title, correct: g.id === answer.id }))}
      />
    </div>
  );
}
