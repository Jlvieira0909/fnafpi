"use client";

export interface GuessListItem {
  id: string;
  label: string;
  correct: boolean;
}

export function FnafdleGuessList({ items }: { items: GuessListItem[] }) {
  if (items.length === 0) return null;

  return (
    <ul className="mt-6 max-w-md space-y-1.5">
      {items.map((item) => (
        <li
          key={item.id}
          className={`pop-in rounded-sm border px-3 py-2 font-mono text-xs uppercase tracking-wide ${
            item.correct
              ? "border-signal/60 bg-signal/10 text-signal"
              : "shake-once border-rec/40 bg-rec/5 text-bone-dim"
          }`}
        >
          {item.label}
        </li>
      ))}
    </ul>
  );
}
