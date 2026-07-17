"use client";

import { useEffect, useMemo, useRef, useState } from "react";

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

function hashString(value: string) {
  let hash = 5381;
  for (const char of value) hash = ((hash << 5) + hash + char.charCodeAt(0)) >>> 0;
  return hash;
}

function localDateKey() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
}

function Cell({ ok, children }: { ok: boolean; children: React.ReactNode }) {
  return (
    <div
      className={`flex min-h-[54px] items-center justify-center border px-1.5 py-1 text-center font-mono text-[10px] uppercase leading-tight ${
        ok ? "border-signal/60 bg-signal/10 text-signal" : "border-rec/40 bg-rec/5 text-bone-dim"
      }`}
    >
      {children}
    </div>
  );
}

export function FnafdleGame({ pool }: { pool: PoolEntry[] }) {
  const [dateKey, setDateKey] = useState<string | null>(null);
  const [guessIds, setGuessIds] = useState<string[]>([]);
  const [query, setQuery] = useState("");
  const [copied, setCopied] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const byId = useMemo(() => new Map(pool.map((entry) => [entry.id, entry])), [pool]);

  useEffect(() => {
    const key = localDateKey();
    setDateKey(key);
    try {
      const stored = window.localStorage.getItem(`fnafdle:${key}`);
      if (stored) setGuessIds(JSON.parse(stored).filter((id: string) => byId.has(id)));
    } catch {}
  }, [byId]);

  useEffect(() => {
    if (!dateKey) return;
    try {
      window.localStorage.setItem(`fnafdle:${dateKey}`, JSON.stringify(guessIds));
    } catch {}
  }, [guessIds, dateKey]);

  const answer = useMemo(() => (dateKey ? pool[hashString(dateKey) % pool.length] : null), [dateKey, pool]);
  const guesses = guessIds.map((id) => byId.get(id)).filter((g): g is PoolEntry => Boolean(g));
  const won = answer ? guessIds.includes(answer.id) : false;

  const suggestions = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.trim().toLowerCase();
    return pool
      .filter((entry) => entry.name.toLowerCase().includes(q) && !guessIds.includes(entry.id))
      .slice(0, 8);
  }, [query, pool, guessIds]);

  if (!dateKey || !answer) {
    return (
      <p className="mt-10 font-pixel text-[10px] uppercase text-bone-dim">
        Booting archive systems<span className="animate-pulse">…</span>
      </p>
    );
  }

  const pick = (entry: PoolEntry) => {
    setGuessIds((previous) => [...previous, entry.id]);
    setQuery("");
    inputRef.current?.focus();
  };

  const yearMark = (guess: PoolEntry) => {
    if (guess.debutYear === answer.debutYear) return { ok: true, text: guess.debutYear ? String(guess.debutYear) : "—" };
    if (!guess.debutYear || !answer.debutYear) return { ok: false, text: guess.debutYear ? String(guess.debutYear) : "—" };
    return { ok: false, text: `${guess.debutYear} ${guess.debutYear < answer.debutYear ? "▲" : "▼"}` };
  };

  const share = async () => {
    const lines = guesses.map((guess) => {
      const marks = [
        guess.type === answer.type,
        guess.continuity === answer.continuity,
        guess.group === answer.group,
        guess.gender === answer.gender,
        guess.family === answer.family,
      ].map((ok) => (ok ? "🟩" : "🟥"));
      const year =
        guess.debutYear === answer.debutYear ? "🟩" : guess.debutYear < answer.debutYear ? "⬆️" : "⬇️";
      return marks.join("") + year;
    });
    const text = `FNAFDLE ${dateKey} · ${won ? guesses.length : "X"}/∞\n${lines.join("\n")}\n${window.location.origin}/fnafdle`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  return (
    <div className="mt-8">
      {!won ? (
        <div className="relative max-w-md">
          <div className="flex items-center gap-2">
            <input
              ref={inputRef}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter" && suggestions[0]) pick(suggestions[0]);
              }}
              placeholder="Type a character name..."
              autoComplete="off"
              spellCheck={false}
              className="w-full rounded-sm border border-seam bg-stage px-3 py-2.5 font-mono text-sm text-bone placeholder:text-bone-dim/50 focus:border-faz focus:outline-none"
            />
            <span className="shrink-0 font-pixel text-[9px] uppercase text-bone-dim">
              {guesses.length} guess{guesses.length === 1 ? "" : "es"}
            </span>
          </div>
          {suggestions.length > 0 ? (
            <ul className="absolute z-20 mt-1 w-full overflow-hidden rounded-sm border border-seam bg-curtain shadow-[0_12px_30px_rgba(0,0,0,0.6)]">
              {suggestions.map((entry) => (
                <li key={entry.id}>
                  <button
                    type="button"
                    onClick={() => pick(entry)}
                    className="flex w-full items-center gap-3 px-3 py-2 text-left transition-colors hover:bg-curtain-2"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={entry.frame} alt="" className="h-8 w-8 shrink-0 object-contain" />
                    <span className="text-sm text-bone">{entry.name}</span>
                    <span className="ml-auto font-mono text-[10px] uppercase text-bone-dim">{entry.continuity}</span>
                  </button>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      ) : (
        <div className="max-w-md rounded-md border border-signal/60 bg-signal/10 p-4">
          <p className="font-pixel text-[11px] uppercase leading-relaxed text-signal">6:00 AM — You made it!</p>
          <p className="mt-2 text-sm text-bone">
            Tonight&apos;s character was <span className="font-semibold text-signal">{answer.name}</span>, caught in{" "}
            {guesses.length} guess{guesses.length === 1 ? "" : "es"}.
          </p>
          <div className="mt-3 flex items-center gap-3">
            <button
              type="button"
              onClick={share}
              className="rounded bg-signal px-4 py-2 font-mono text-xs font-medium uppercase tracking-widest text-stage transition-opacity hover:opacity-85"
            >
              {copied ? "Copied!" : "Share result"}
            </button>
            <span className="font-mono text-[10px] uppercase tracking-widest text-bone-dim">
              New character at midnight
            </span>
          </div>
        </div>
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
                    <div className="flex min-h-[54px] items-center gap-2.5 border border-seam bg-curtain px-2.5">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={guess.frame} alt="" className="h-9 w-9 shrink-0 object-contain" />
                      <span className="text-xs font-semibold text-bone">{guess.name}</span>
                    </div>
                    <Cell ok={guess.type === answer.type}>{guess.type}</Cell>
                    <Cell ok={guess.continuity === answer.continuity}>{guess.continuity}</Cell>
                    <Cell ok={guess.group === answer.group}>{guess.group}</Cell>
                    <Cell ok={guess.gender === answer.gender}>{guess.gender}</Cell>
                    <Cell ok={guess.family === answer.family}>{guess.family}</Cell>
                    <Cell ok={year.ok}>{year.text}</Cell>
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
