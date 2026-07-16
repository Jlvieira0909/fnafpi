import Link from "next/link";

export function EntityCard({
  href,
  imageUrl,
  title,
  subtitle,
  tag,
}: {
  href: string;
  imageUrl: string;
  title: string;
  subtitle?: string;
  tag?: string;
}) {
  return (
    <Link
      href={href}
      className="group overflow-hidden rounded-lg border border-seam bg-curtain transition-all hover:-translate-y-0.5 hover:border-faz-dim hover:shadow-[0_0_24px_rgba(232,162,61,0.12)]"
    >
      <div className="relative aspect-square bg-[radial-gradient(ellipse_at_center,#1c1626,#0b0a10_78%)]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageUrl}
          alt={title}
          loading="lazy"
          className="h-full w-full object-contain p-4 transition-transform duration-300 group-hover:scale-[1.04]"
        />
        {tag ? (
          <span className="absolute left-2 top-2 rounded border border-seam bg-stage/90 px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-widest text-faz-dim">
            {tag}
          </span>
        ) : null}
      </div>
      <div className="border-t border-seam p-3">
        <h3 className="text-sm font-semibold text-bone transition-colors group-hover:text-faz">{title}</h3>
        {subtitle ? (
          <p className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.15em] text-bone-dim">{subtitle}</p>
        ) : null}
      </div>
    </Link>
  );
}
