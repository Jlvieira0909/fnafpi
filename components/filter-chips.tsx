import Link from "next/link";

export function FilterChips({
  basePath,
  param,
  options,
  active,
  otherParams,
  label,
  counts,
}: {
  basePath: string;
  param: string;
  options: string[];
  active: string | null;
  otherParams: Record<string, string>;
  label?: string;
  counts?: Record<string, number>;
}) {
  const buildHref = (value: string | null) => {
    const params = new URLSearchParams(otherParams);
    if (value) params.set(param, value);
    const qs = params.toString();
    return qs ? `${basePath}?${qs}` : basePath;
  };

  const chip = (value: string | null, text: string, count?: number) => {
    const isActive = value === null ? !active : active?.toLowerCase() === value.toLowerCase();
    return (
      <Link
        key={text}
        href={buildHref(value)}
        className={`group flex items-center gap-1.5 rounded-sm border px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider transition-all ${
          isActive
            ? "border-faz bg-faz/10 text-faz shadow-[0_0_10px_rgba(183,139,255,0.2)]"
            : "border-seam bg-stage/60 text-bone-dim hover:border-bone-dim hover:text-bone"
        }`}
      >
        <span
          className={`h-1.5 w-1.5 rounded-[1px] transition-colors ${
            isActive ? "bg-signal shadow-[0_0_6px_rgba(126,224,129,0.9)]" : "bg-seam group-hover:bg-bone-dim"
          }`}
        />
        {text}
        {count !== undefined ? <span className="text-[9px] opacity-50">{count}</span> : null}
      </Link>
    );
  };

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {label ? (
        <span className="w-full shrink-0 font-pixel text-[8px] uppercase leading-relaxed text-bone-dim sm:w-24">
          {label}
        </span>
      ) : null}
      {chip(null, "All")}
      {options.map((option) => chip(option, option, counts?.[option]))}
    </div>
  );
}
