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
  const countBy = (predicate: (c: (typeof characters)[number]) => boolean) => characters.filter(predicate).length;
  const continuityCounts = Object.fromEntries(CONTINUITIES.map((v) => [v, countBy((c) => c.continuity === v)]));
  const typeCounts = Object.fromEntries(TYPES.map((v) => [v, countBy((c) => c.type === v)]));
  const groupCounts = Object.fromEntries(groups.map((v) => [v, countBy((c) => c.group === v)]));

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
      <div className="mt-6 rounded-md border border-seam bg-curtain/70 p-4">
        <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-bone-dim">
          <span>Filter console</span>
          <span className="font-pixel text-[9px] text-signal">
            Showing {results.length}/{characters.length}
          </span>
        </div>
        <div className="mt-3 space-y-2.5">
          <FilterChips basePath="/characters" param="continuity" options={CONTINUITIES} active={continuity} otherParams={paramsWithout("continuity")} label="Continuity" counts={continuityCounts} />
          <FilterChips basePath="/characters" param="type" options={TYPES} active={type} otherParams={paramsWithout("type")} label="Type" counts={typeCounts} />
          <FilterChips basePath="/characters" param="group" options={groups} active={group} otherParams={paramsWithout("group")} label="Group" counts={groupCounts} />
        </div>
      </div>
      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {results.map((character) => (
          <EntityCard
            key={character.id}
            href={`/characters/${character.id}`}
            imageUrl={character.images.frame}
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
