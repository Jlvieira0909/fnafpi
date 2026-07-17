export function CamFrame({
  src,
  alt,
  label,
}: {
  src: string;
  alt: string;
  label: string;
}) {
  return (
    <div className="cam-corners scanlines glow-faz relative overflow-hidden rounded-lg border border-seam bg-[radial-gradient(ellipse_at_center,#1c1626,#0b0a10_75%)]">
      <div className="absolute left-4 top-10 z-10 font-mono text-[11px] uppercase tracking-[0.2em] text-bone/80">
        {label}
      </div>
      <div className="absolute right-4 top-10 z-10 flex items-center gap-1.5 font-mono text-[11px] tracking-widest text-rec">
        <span className="rec-dot inline-block h-2 w-2 rounded-full bg-rec" />
        REC
      </div>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt} className="aspect-[3/4] w-full object-contain p-8" />
      <div className="absolute inset-x-0 bottom-0 flex items-center justify-between px-4 py-2 font-mono text-[10px] uppercase tracking-widest text-bone-dim/70">
        <span>Fazbear Ent. Security</span>
        <span>NIGHT 5 · 03:12 AM</span>
      </div>
    </div>
  );
}
