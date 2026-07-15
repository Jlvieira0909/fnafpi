import { media } from "@/lib/data";
import { matchExact, matchText, ok, paginate, preflight } from "@/lib/api";

export function OPTIONS() {
  return preflight();
}

export function GET(request: Request) {
  const url = new URL(request.url);
  const q = url.searchParams;
  const year = q.get("year");

  const results = media.filter(
    (m) =>
      (m.type === "Game" || m.type === "DLC") &&
      matchText(m.title, q.get("title")) &&
      matchExact(m.continuity, q.get("continuity")) &&
      matchExact(m.series, q.get("series")) &&
      (!year || (m.releaseDate ?? "").startsWith(year))
  );

  return ok(paginate(results, url));
}
