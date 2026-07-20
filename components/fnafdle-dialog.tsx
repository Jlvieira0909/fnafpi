"use client";

import { useEffect, useMemo, useState } from "react";
import { FnafdleAutocomplete, type AutocompleteOption } from "@/components/fnafdle-autocomplete";
import { FnafdleGuessList } from "@/components/fnafdle-guess-list";
import { FnafdleWinBanner } from "@/components/fnafdle-win-banner";
import { loadGuesses, localDateKey, pickDaily, saveGuesses } from "@/lib/fnafdle";

interface DialogEntry {
  id: string;
  name: string;
  frame: string;
  line: string;
}

export function FnafdleDialog({ pool }: { pool: DialogEntry[] }) {
  const [dateKey, setDateKey] = useState<string | null>(null);
  const [guessIds, setGuessIds] = useState<string[]>([]);

  useEffect(() => {
    const key = localDateKey();
    setDateKey(key);
    setGuessIds(loadGuesses(`fnafdle:dialog:${key}`));
  }, []);

  useEffect(() => {
    if (dateKey) saveGuesses(`fnafdle:dialog:${dateKey}`, guessIds);
  }, [guessIds, dateKey]);

  const byId = useMemo(() => new Map(pool.map((e) => [e.id, e])), [pool]);
  const answer = useMemo(() => (dateKey ? pickDaily(pool, dateKey, "dialog") : null), [dateKey, pool]);
  const guesses = guessIds.map((id) => byId.get(id)).filter((g): g is DialogEntry => Boolean(g));
  const won = answer ? guessIds.includes(answer.id) : false;

  if (!dateKey || !answer) {
    return <p className="mt-10 font-pixel text-[10px] uppercase text-bone-dim">Cueing the audio…</p>;
  }

  const options: AutocompleteOption[] = pool.map((e) => ({ id: e.id, label: e.name }));
  const pick = (option: AutocompleteOption) => setGuessIds((prev) => [...prev, option.id]);

  const shareText = () => {
    const marks = guesses.map((g) => (g.id === answer.id ? "🟩" : "🟥")).join("");
    return `FNAFDLE DIALOG ${dateKey} · ${guesses.length}/∞\n${marks}\n${window.location.origin}/fnafdle`;
  };

  return (
    <div className="mt-8">
      <div className="max-w-lg rounded-md border border-seam bg-curtain p-4">
        <p className="font-pixel text-[9px] uppercase leading-relaxed text-faz-dim">Ultimate Custom Night · Cam audio</p>
        <p className="mt-2 text-lg italic leading-snug text-bone">&ldquo;{answer.line}&rdquo;</p>
      </div>

      <div className="mt-6">
        {!won ? (
          <FnafdleAutocomplete
            options={options}
            excludeIds={guessIds}
            onPick={pick}
            placeholder="Type a character name..."
            guessCount={guesses.length}
          />
        ) : (
          <div className="flex flex-col items-start gap-4 sm:flex-row">
            <div className="h-20 w-20 shrink-0 overflow-hidden rounded-md border border-seam bg-curtain">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={answer.frame} alt={answer.name} className="h-full w-full object-contain p-1.5" />
            </div>
            <FnafdleWinBanner answerLabel={answer.name} guessCount={guesses.length} shareText={shareText()} />
          </div>
        )}
      </div>

      <FnafdleGuessList
        items={[...guesses].reverse().map((g) => ({ id: g.id, label: g.name, correct: g.id === answer.id }))}
      />

      <p className="mt-8 max-w-md font-mono text-[10px] leading-relaxed text-bone-dim/70">
        Most UCN animatronics are silent — this pool only includes characters with an identifiable spoken line, and a
        few are marked &quot;implied&quot; rather than confirmed. Check a character&apos;s own page for the source.
      </p>
    </div>
  );
}
