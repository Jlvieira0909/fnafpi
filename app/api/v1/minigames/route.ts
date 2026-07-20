import { minigames } from "@/lib/data";
import { matchExact, matchText, ok, paginate, preflight } from "@/lib/api";

export function OPTIONS() {
  return preflight();
}

export function GET(request: Request) {
  const url = new URL(request.url);
  const q = url.searchParams;

  const results = minigames.filter(
    (m) => matchText(m.name, q.get("name")) && matchExact(m.media, q.get("media"))
  );

  return ok(paginate(results, url));
}
