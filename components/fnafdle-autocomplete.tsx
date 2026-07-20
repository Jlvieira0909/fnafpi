"use client";

import { useMemo, useRef, useState } from "react";

export interface AutocompleteOption {
  id: string;
  label: string;
  sublabel?: string;
  image?: string;
}

export function FnafdleAutocomplete({
  options,
  excludeIds,
  onPick,
  placeholder,
  guessCount,
}: {
  options: AutocompleteOption[];
  excludeIds: string[];
  onPick: (option: AutocompleteOption) => void;
  placeholder: string;
  guessCount: number;
}) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const suggestions = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.trim().toLowerCase();
    return options.filter((o) => o.label.toLowerCase().includes(q) && !excludeIds.includes(o.id)).slice(0, 8);
  }, [query, options, excludeIds]);

  const pick = (option: AutocompleteOption) => {
    onPick(option);
    setQuery("");
    inputRef.current?.focus();
  };

  return (
    <div className="relative max-w-md">
      <div className="flex items-center gap-2">
        <input
          ref={inputRef}
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" && suggestions[0]) pick(suggestions[0]);
          }}
          placeholder={placeholder}
          autoComplete="off"
          spellCheck={false}
          className="w-full rounded-sm border border-seam bg-stage px-3 py-2.5 font-mono text-sm text-bone placeholder:text-bone-dim/50 focus:border-faz focus:outline-none"
        />
        <span className="shrink-0 font-pixel text-[9px] uppercase text-bone-dim">
          {guessCount} guess{guessCount === 1 ? "" : "es"}
        </span>
      </div>
      {suggestions.length > 0 ? (
        <ul className="absolute z-20 mt-1 w-full overflow-hidden rounded-sm border border-seam bg-curtain shadow-[0_12px_30px_rgba(0,0,0,0.6)]">
          {suggestions.map((option) => (
            <li key={option.id}>
              <button
                type="button"
                onClick={() => pick(option)}
                className="flex w-full items-center gap-3 px-3 py-2 text-left transition-colors hover:bg-curtain-2"
              >
                {option.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={option.image} alt="" className="h-8 w-8 shrink-0 object-contain" />
                ) : null}
                <span className="text-sm text-bone">{option.label}</span>
                {option.sublabel ? (
                  <span className="ml-auto font-mono text-[10px] uppercase text-bone-dim">{option.sublabel}</span>
                ) : null}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
