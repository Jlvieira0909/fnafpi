import type { LoreClaim } from "@/types";

const STYLES: Record<string, string> = {
  confirmed: "border-signal bg-signal/10 text-signal",
  implied: "border-violet bg-violet/10 text-violet",
  theory: "border-rec bg-rec/10 text-rec",
};

export function LoreBadge({ claim, label }: { claim: LoreClaim; label: string }) {
  return (
    <div className="rounded-md border border-seam bg-curtain p-3.5">
      <div className="flex items-center justify-between gap-3">
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-bone-dim">{label}</span>
        <span
          className={`rounded-full border px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest ${STYLES[claim.canonicity]}`}
        >
          {claim.canonicity}
        </span>
      </div>
      <p className="mt-1.5 text-sm font-medium text-bone">{claim.value}</p>
      {claim.source ? <p className="mt-1 text-xs leading-relaxed text-bone-dim">{claim.source}</p> : null}
    </div>
  );
}
