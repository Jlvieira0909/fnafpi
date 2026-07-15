import { characters } from "@/lib/data";
import { matchExact, matchText, ok, paginate, preflight } from "@/lib/api";

export function OPTIONS() {
  return preflight();
}

export function GET(request: Request) {
  const url = new URL(request.url);
  const q = url.searchParams;
  const appearsIn = q.get("appearsIn")?.toLowerCase() ?? null;

  const results = characters.filter(
    (c) =>
      matchText(c.name, q.get("name")) &&
      matchExact(c.type, q.get("type")) &&
      matchExact(c.continuity, q.get("continuity")) &&
      matchExact(c.group, q.get("group")) &&
      matchExact(c.gender, q.get("gender")) &&
      matchExact(c.variantOf, q.get("variantOf")) &&
      matchExact(c.debut, q.get("debut")) &&
      (!appearsIn || c.appearances.includes(appearsIn))
  );

  return ok(paginate(results, url));
}
