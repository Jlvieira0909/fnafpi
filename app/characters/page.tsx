import type { Metadata } from "next";
import { EntityCard } from "@/components/entity-card";
import { FilterChips } from "@/components/filter-chips";
import { characters } from "@/lib/data";
import { PageHeader } from "@/components/page-header";
import { OutOfOrder } from "@/components/out-of-order";

export const metadata: Metadata = { title: "Characters" };

const CONTINUITIES = ["games", "novels", "frights", "movies"];
const TYPES = ["Animatronic", "Human"];

export default async function CharactersPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const params = await searchParams;
  const continuity = params.continuity ?? null;
  const type = params.type ?? null;
  const group = params.group ?? null;

  const groups = Array.from(new Set(characters.map((c) => c.group).filter((g): g is string => Boolean(g)))).sort();

  const results = characters.filter(
    (c) =>
      (!continuity || c.continuity === continuity.toLowerCase()) &&
      (!type || c.type.toLowerCase() === type.toLowerCase()) &&
      (!group || (c.group ?? "").toLowerCase() === group.toLowerCase())
  );

  const otherParams = Object.fromEntries(
    Object.entries({ continuity, type, group }).filter(([, v]) => v) as [string, string][]
  );
  const paramsWithout = (key: string) => {
    const rest = { ...otherParams };
    delete rest[key];
    return rest;
  };

  return (
    <div className="pb-10">
      <PageHeader
        eyebrow="Cast roster"
        title="Characters"
        description={`${characters.length} entries. Variants link back to their base identity; counterparts link the same character across continuities.`}
      />
      <div className="mt-6 space-y-2">
        <FilterChips basePath="/characters" param="continuity" options={CONTINUITIES} active={continuity} otherParams={paramsWithout("continuity")} />
        <FilterChips basePath="/characters" param="type" options={TYPES} active={type} otherParams={paramsWithout("type")} />
        <FilterChips basePath="/characters" param="group" options={groups} active={group} otherParams={paramsWithout("group")} />
      </div>
      <p className="mt-6 font-mono text-[11px] uppercase tracking-widest text-bone-dim">{results.length} shown</p>
      <div className="mt-3 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {results.map((character) => (
          <EntityCard
            key={character.id}
            href={`/characters/${character.id}`}
            imageUrl={character.imageUrl}
            title={character.name}
            subtitle={character.group ?? character.type}
            tag={character.continuity}
          />
        ))}
      </div>
      {results.length === 0 ? (
        <OutOfOrder message="No characters match these filters. Clear one to widen the search." />
      ) : null}
    </div>
  );
}
