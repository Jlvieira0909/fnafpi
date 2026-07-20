"use client";

import { useEffect, useMemo, useState } from "react";
import { FnafdleAutocomplete, type AutocompleteOption } from "@/components/fnafdle-autocomplete";
import { FnafdleWinBanner } from "@/components/fnafdle-win-banner";
import { loadGuesses, localDateKey, pickDaily, saveGuesses } from "@/lib/fnafdle";

interface PoolEntry {
  id: string;
  name: string;
  frame: string;
  type: string;
  continuity: string;
  group: string;
  gender: string;
  family: string;
  debutYear: number;
}

const ATTRIBUTES = ["Type", "Continuity", "Group", "Gender", "Family", "Debut"] as const;

function Cell({ ok, delayMs, children }: { ok: boolean; delayMs: number; children: React.ReactNode }) {
  return (
    <div
      style={{ animationDelay: `${delayMs}ms` }}
      className={`cell-pop flex min-h-[54px] items-center justify-center border px-1.5 py-1 text-center font-mono text-[10px] uppercase leading-tight ${
        ok ? "border-signal/60 bg-signal/10 text-signal" : "border-rec/40 bg-rec/5 text-bone-dim"
      }`}
    >
      {children}
    </div>
  );
}

export function FnafdleClassic({ pool }: { pool: PoolEntry[] }) {
  const [dateKey, setDateKey] = useState<string | null>(null);
  const [guessIds, setGuessIds] = useState<string[]>([]);
  const byId = useMemo(() => new Map(pool.map((entry) => [entry.id, entry])), [pool]);

  useEffect(() => {
    const key = localDateKey();
    setDateKey(key);
    setGuessIds(loadGuesses(`fnafdle:classic:${key}`).filter((id) => byId.has(id)));
  }, [byId]);

  useEffect(() => {
    if (dateKey) saveGuesses(`fnafdle:classic:${dateKey}`, guessIds);
  }, [guessIds, dateKey]);

  const answer = useMemo(() => (dateKey ? pickDaily(pool, dateKey, "classic") : null), [dateKey, pool]);
  const guesses = guessIds.map((id) => byId.get(id)).filter((g): g is PoolEntry => Boolean(g));
  const won = answer ? guessIds.includes(answer.id) : false;

  if (!dateKey || !answer) {
    return <p className="mt-10 font-pixel text-[10px] uppercase text-bone-dim">Booting archive systems…</p>;
  }

  const options: AutocompleteOption[] = pool.map((e) => ({ id: e.id, label: e.name, sublabel: e.continuity, image: e.frame }));
  const pick = (option: AutocompleteOption) => setGuessIds((prev) => [...prev, option.id]);

  const yearMark = (guess: PoolEntry) => {
    if (guess.debutYear === answer.debutYear) return { ok: true, text: guess.debutYear ? String(guess.debutYear) : "—" };
    if (!guess.debutYear || !answer.debutYear) return { ok: false, text: guess.debutYear ? String(guess.debutYear) : "—" };
    return { ok: false, text: `${guess.debutYear} ${guess.debutYear < answer.debutYear ? "▲" : "▼"}` };
  };

  const shareText = () => {
    const lines = guesses.map((guess) => {
      const marks = [
        guess.type === answer.type,
        guess.continuity === answer.continuity,
        guess.group === answer.group,
        guess.gender === answer.gender,
        guess.family === answer.family,
      ].map((ok) => (ok ? "🟩" : "🟥"));
      const year = guess.debutYear === answer.debutYear ? "🟩" : guess.debutYear < answer.debutYear ? "⬆️" : "⬇️";
      return marks.join("") + year;
    });
    return `FNAFDLE ${dateKey} · ${won ? guesses.length : "X"}/∞\n${lines.join("\n")}\n${window.location.origin}/fnafdle`;
  };

  return (
    <div className="mt-8">
      {!won ? (
        <FnafdleAutocomplete
          options={options}
          excludeIds={guessIds}
          onPick={pick}
          placeholder="Type a character name..."
          guessCount={guesses.length}
        />
      ) : (
        <FnafdleWinBanner answerLabel={answer.name} guessCount={guesses.length} shareText={shareText()} />
      )}

      {guesses.length > 0 ? (
        <div className="mt-8 overflow-x-auto pb-2">
          <div className="min-w-[760px]">
            <div className="grid grid-cols-[minmax(160px,1.4fr)_repeat(6,minmax(92px,1fr))] gap-1.5">
              <div className="px-1.5 font-pixel text-[8px] uppercase leading-relaxed text-bone-dim">Character</div>
              {ATTRIBUTES.map((attribute) => (
                <div key={attribute} className="px-1.5 text-center font-pixel text-[8px] uppercase leading-relaxed text-bone-dim">
                  {attribute}
                </div>
              ))}
            </div>
            <div className="mt-1.5 space-y-1.5">
              {[...guesses].reverse().map((guess) => {
                const year = yearMark(guess);
                return (
                  <div key={guess.id} className="grid grid-cols-[minmax(160px,1.4fr)_repeat(6,minmax(92px,1fr))] gap-1.5">
                    <div
                      style={{ animationDelay: "0ms" }}
                      className="cell-pop flex min-h-[54px] items-center gap-2.5 border border-seam bg-curtain px-2.5"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={guess.frame} alt="" className="h-9 w-9 shrink-0 object-contain" />
                      <span className="text-xs font-semibold text-bone">{guess.name}</span>
                    </div>
                    <Cell ok={guess.type === answer.type} delayMs={60}>{guess.type}</Cell>
                    <Cell ok={guess.continuity === answer.continuity} delayMs={120}>{guess.continuity}</Cell>
                    <Cell ok={guess.group === answer.group} delayMs={180}>{guess.group}</Cell>
                    <Cell ok={guess.gender === answer.gender} delayMs={240}>{guess.gender}</Cell>
                    <Cell ok={guess.family === answer.family} delayMs={300}>{guess.family}</Cell>
                    <Cell ok={year.ok} delayMs={360}>{year.text}</Cell>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        <p className="mt-8 font-mono text-xs leading-relaxed text-bone-dim">
          The cameras are rolling. Type a name above to make your first guess — the grid will show you what matches.
        </p>
      )}
    </div>
  );
}
