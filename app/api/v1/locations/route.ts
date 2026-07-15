import { locations } from "@/lib/data";
import { matchExact, matchText, ok, paginate, preflight } from "@/lib/api";

export function OPTIONS() {
  return preflight();
}

export function GET(request: Request) {
  const url = new URL(request.url);
  const q = url.searchParams;
  const appearsIn = q.get("appearsIn")?.toLowerCase() ?? null;
  const hasCharacter = q.get("hasCharacter")?.toLowerCase() ?? null;

  const results = locations.filter(
    (l) =>
      matchText(l.name, q.get("name")) &&
      matchExact(l.status, q.get("status")) &&
      matchExact(l.continuity, q.get("continuity")) &&
      matchText(l.owner, q.get("owner")) &&
      (!appearsIn || l.appearances.includes(appearsIn)) &&
      (!hasCharacter || l.presentCharacters.includes(hasCharacter))
  );

  return ok(paginate(results, url));
}
