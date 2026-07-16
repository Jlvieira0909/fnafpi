import { teasers } from "@/lib/data";
import { matchExact, matchText, ok, paginate, preflight } from "@/lib/api";

export function OPTIONS() {
  return preflight();
}

export function GET(request: Request) {
  const url = new URL(request.url);
  const q = url.searchParams;
  const year = q.get("year");

  const results = teasers.filter(
    (t) =>
      matchText(t.title, q.get("title")) &&
      matchExact(t.teases, q.get("teases")) &&
      matchExact(t.source, q.get("source")) &&
      (!year || (t.postedDate ?? "").startsWith(year))
  );

  return ok(paginate(results, url));
}
