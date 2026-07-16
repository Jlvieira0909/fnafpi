import type { Metadata } from "next";
import Link from "next/link";
import { locations } from "@/lib/data";
import { PageHeader } from "@/components/page-header";

export const metadata: Metadata = { title: "Locations" };

const STATUS_COLOR: Record<string, string> = {
  Active: "text-signal",
  Closed: "text-bone-dim",
  Burned: "text-rec",
  Demolished: "text-rec",
  Unknown: "text-violet",
};

export default function LocationsPage() {
  return (
    <div className="pb-10">
      <PageHeader
        eyebrow="Fazbear Entertainment properties"
        title="Locations"
        description="Fazbear Entertainment has a real estate problem: almost everything here closed, burned or worse."
      />
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {locations.map((location) => (
          <Link
            key={location.id}
            href={`/locations/${location.id}`}
            className="group rounded-lg border border-seam bg-curtain p-5 transition-colors hover:border-faz-dim"
          >
            <div className="flex items-baseline justify-between gap-3">
              <h2 className="text-base font-semibold text-bone transition-colors group-hover:text-faz">
                {location.name}
              </h2>
              <span className={`font-mono text-[10px] uppercase tracking-widest ${STATUS_COLOR[location.status]}`}>
                {location.status}
              </span>
            </div>
            <p className="mt-1 font-mono text-[11px] uppercase tracking-wider text-bone-dim">
              {location.continuity} · {location.presentCharacters.length} characters
              {location.incidents?.length ? ` · ${location.incidents.length} incidents` : ""}
            </p>
            {location.causeOfClosure ? (
              <p className="mt-2 text-xs leading-relaxed text-bone-dim">{location.causeOfClosure}</p>
            ) : null}
          </Link>
        ))}
      </div>
    </div>
  );
}
