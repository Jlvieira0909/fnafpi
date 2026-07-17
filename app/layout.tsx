import type { Metadata } from "next";
import { Archivo, Bungee, IBM_Plex_Mono, Press_Start_2P } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const bungee = Bungee({ weight: "400", subsets: ["latin"], variable: "--font-bungee" });
const archivo = Archivo({ subsets: ["latin"], variable: "--font-archivo" });
const plex = IBM_Plex_Mono({ weight: ["400", "500"], subsets: ["latin"], variable: "--font-plex" });
const pressStart = Press_Start_2P({ weight: "400", subsets: ["latin"], variable: "--font-press-start" });

export const metadata: Metadata = {
  title: { default: "FNAFPI — The Fazbear Archive", template: "%s · FNAFPI" },
  description:
    "A museum of the Five Nights at Freddy's franchise, powered by a free public API: characters, games, books, movies, locations and teasers.",
};

const NAV = [
  { href: "/characters", cam: "1A", label: "Characters" },
  { href: "/media", cam: "1B", label: "Timeline" },
  { href: "/locations", cam: "1C", label: "Locations" },
  { href: "/teasers", cam: "2A", label: "Teasers" },
  { href: "/fnafdle", cam: "CN", label: "FNAFDLE" },
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${bungee.variable} ${archivo.variable} ${plex.variable} ${pressStart.variable}`}>
      <body className="font-sans antialiased">
        <header className="sticky top-0 z-40 border-b border-seam bg-stage/90 backdrop-blur-md">
          <div className="mx-auto flex max-w-6xl items-center gap-6 px-4 pb-2 pt-3">
            <Link href="/" className="group flex items-center gap-2">
              <span className="inline-block h-2.5 w-2.5 rotate-45 bg-faz transition-transform group-hover:rotate-[135deg]" />
              <span className="font-display text-xl tracking-wide text-faz">FNAFPI</span>
            </Link>
            <nav className="flex flex-1 items-center gap-5 overflow-x-auto font-mono text-[12px] uppercase tracking-widest text-bone-dim">
              {NAV.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="whitespace-nowrap border-b-2 border-transparent pb-0.5 transition-colors hover:border-faz hover:text-bone"
                >
                  <span className="mr-1.5 font-pixel text-[8px] text-faz-dim">{item.cam}</span>
                  {item.label}
                </Link>
              ))}
            </nav>
            <a
              href="/docs"
              className="rounded border border-faz-dim px-2.5 py-1 font-mono text-[11px] uppercase tracking-widest text-faz transition-colors hover:bg-faz hover:text-stage"
            >
              API docs
            </a>
          </div>
          <div className="bunting" />
        </header>
        <main className="mx-auto min-h-screen w-full max-w-6xl px-4 pb-24">{children}</main>
        <footer className="relative border-t border-seam">
          <div className="checker" />
          <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-8 font-mono text-xs text-bone-dim">
            <p>FNAFPI is a free, unofficial fan project. Not affiliated with Scott Cawthon or Steel Wool Studios.</p>
            <p>
              Five Nights at Freddy&apos;s and all related characters belong to their respective owners. Data curated
              from the community wiki.
            </p>
            <a href="https://github.com/Jlvieira0909/fnafpi" className="text-faz-dim hover:text-faz">
              github.com/Jlvieira0909/fnafpi
            </a>
          </div>
          <span
            aria-hidden
            className="pointer-events-none absolute bottom-3 right-4 select-none font-display text-5xl uppercase text-bone/[0.05]"
          >
            it&apos;s me
          </span>
        </footer>
      </body>
    </html>
  );
}
