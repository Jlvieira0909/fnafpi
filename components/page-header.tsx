export function PageHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <header className="pt-10">
      <p className="font-pixel text-[10px] uppercase leading-relaxed tracking-wider text-faz-dim">{eyebrow}</p>
      <h1 className="marquee mt-3 font-display text-3xl uppercase text-faz sm:text-4xl">{title}</h1>
      <div className="bulbs mt-3 max-w-xs" />
      {description ? <p className="mt-4 max-w-xl text-sm leading-relaxed text-bone-dim">{description}</p> : null}
    </header>
  );
}
