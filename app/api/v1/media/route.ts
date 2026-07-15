import { media } from "@/lib/data";
import { matchExact, matchText, ok, paginate, preflight } from "@/lib/api";

export function OPTIONS() {
  return preflight();
}

export function GET(request: Request) {
  const url = new URL(request.url);
  const q = url.searchParams;
  const year = q.get("year");
  const mainSeries = q.get("mainSeries");

  const results = media.filter(
    (m) =>
      matchText(m.title, q.get("title")) &&
      matchExact(m.type, q.get("type")) &&
      matchExact(m.continuity, q.get("continuity")) &&
      matchExact(m.series, q.get("series")) &&
      matchExact(m.bookType, q.get("bookType")) &&
      (!year || (m.releaseDate ?? "").startsWith(year)) &&
      (!mainSeries || String(m.mainSeries ?? false) === mainSeries)
  );

  return ok(paginate(results, url));
}
