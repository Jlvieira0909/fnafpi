"use client";

import { useEffect, useMemo, useState } from "react";
import { FnafdleAutocomplete, type AutocompleteOption } from "@/components/fnafdle-autocomplete";
import { FnafdleWinBanner } from "@/components/fnafdle-win-banner";
import { loadGuesses, localDateKey, pickDaily, saveGuesses } from "@/lib/fnafdle";

interface WorldEntry {
  id: string;
  name: string;
  frame: string;
  attacks: { name: string; description?: string }[];
}

export function FnafdleWorld({ pool }: { pool: WorldEntry[] }) {
  const [dateKey, setDateKey] = useState<string | null>(null);
  const [guessIds, setGuessIds] = useState<string[]>([]);

  useEffect(() => {
    const key = localDateKey();
    setDateKey(key);
    setGuessIds(loadGuesses(`fnafdle:world:${key}`));
  }, []);

  useEffect(() => {
    if (dateKey) saveGuesses(`fnafdle:world:${dateKey}`, guessIds);
  }, [guessIds, dateKey]);

  const byId = useMemo(() => new Map(pool.map((e) => [e.id, e])), [pool]);
  const answer = useMemo(() => (dateKey ? pickDaily(pool, dateKey, "world") : null), [dateKey, pool]);
  const guesses = guessIds.map((id) => byId.get(id)).filter((g): g is WorldEntry => Boolean(g));
  const won = answer ? guessIds.includes(answer.id) : false;

  if (!dateKey || !answer) {
    return <p className="mt-10 font-pixel text-[10px] uppercase text-bone-dim">Entering the overworld…</p>;
  }

  const options: AutocompleteOption[] = pool.map((e) => ({ id: e.id, label: e.name }));
  const pick = (option: AutocompleteOption) => setGuessIds((prev) => [...prev, option.id]);

  const shareText = () => {
    const marks = guesses.map((g) => (g.id === answer.id ? "🟩" : "🟥")).join("");
    return `FNAFDLE WORLD ${dateKey} · ${guesses.length}/∞\n${marks}\n${window.location.origin}/fnafdle`;
  };

  return (
    <div className="mt-8">
      <div className="grid max-w-md gap-2 sm:grid-cols-3">
        {answer.attacks.map((attack) => (
          <div key={attack.name} className="rounded-md border border-seam bg-curtain p-3">
            <p className="font-pixel text-[9px] uppercase leading-relaxed text-signal">{attack.name}</p>
            {attack.description ? <p className="mt-1.5 text-xs text-bone-dim">{attack.description}</p> : null}
          </div>
        ))}
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

      {guesses.length > 0 ? (
        <ul className="mt-6 max-w-md space-y-1.5">
          {[...guesses].reverse().map((g, i) => (
            <li
              key={`${g.id}-${i}`}
              className={`rounded-sm border px-3 py-2 font-mono text-xs uppercase tracking-wide ${
                g.id === answer.id ? "border-signal/60 bg-signal/10 text-signal" : "border-rec/40 bg-rec/5 text-bone-dim"
              }`}
            >
              {g.name}
            </li>
          ))}
        </ul>
      ) : null}

      <p className="mt-8 max-w-md font-mono text-[10px] leading-relaxed text-bone-dim/70">
        This mode&apos;s roster is intentionally small right now — only characters with a verified attack loadout are
        included. It grows as the FNaF World roster gets the same research pass.
      </p>
    </div>
  );
}
