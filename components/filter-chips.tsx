import Link from "next/link";

export function FilterChips({
  basePath,
  param,
  options,
  active,
  otherParams,
}: {
  basePath: string;
  param: string;
  options: string[];
  active: string | null;
  otherParams: Record<string, string>;
}) {
  const buildHref = (value: string | null) => {
    const params = new URLSearchParams(otherParams);
    if (value) params.set(param, value);
    const qs = params.toString();
    return qs ? `${basePath}?${qs}` : basePath;
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Link
        href={buildHref(null)}
        className={`ticket rounded-sm px-3 py-1 font-mono text-[11px] uppercase tracking-wider transition-colors ${
          active ? "border-seam text-bone-dim hover:border-bone-dim hover:text-bone" : "border-faz text-faz"
        }`}
      >
        All
      </Link>
      {options.map((option) => (
        <Link
          key={option}
          href={buildHref(option)}
          className={`ticket rounded-sm px-3 py-1 font-mono text-[11px] uppercase tracking-wider transition-colors ${
            active?.toLowerCase() === option.toLowerCase()
              ? "border-faz text-faz"
              : "border-seam text-bone-dim hover:border-bone-dim hover:text-bone"
          }`}
        >
          {option}
        </Link>
      ))}
    </div>
  );
}
