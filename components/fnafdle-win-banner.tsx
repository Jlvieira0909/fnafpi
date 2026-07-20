"use client";

import { useState } from "react";
import { Confetti } from "@/components/confetti";

export function FnafdleWinBanner({
  answerLabel,
  guessCount,
  shareText,
}: {
  answerLabel: string;
  guessCount: number;
  shareText: string;
}) {
  const [copied, setCopied] = useState(false);

  const share = async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  return (
    <>
      <Confetti />
      <div className="banner-pop max-w-md rounded-md border border-signal/60 bg-signal/10 p-4 shadow-[0_0_30px_rgba(126,224,129,0.15)]">
        <p className="font-pixel text-[11px] uppercase leading-relaxed text-signal">6:00 AM — You made it!</p>
        <p className="mt-2 text-sm text-bone">
          Tonight&apos;s answer was <span className="font-semibold text-signal">{answerLabel}</span>, caught in{" "}
          {guessCount} guess{guessCount === 1 ? "" : "es"}.
        </p>
        <div className="mt-3 flex items-center gap-3">
          <button
            type="button"
            onClick={share}
            className="tab-press rounded bg-signal px-4 py-2 font-mono text-xs font-medium uppercase tracking-widest text-stage transition-opacity hover:opacity-85"
          >
            {copied ? "Copied!" : "Share result"}
          </button>
          <span className="font-mono text-[10px] uppercase tracking-widest text-bone-dim">New round at midnight</span>
        </div>
      </div>
    </>
  );
}
