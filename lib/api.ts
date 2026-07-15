import { NextResponse } from "next/server";

const BASE_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800",
};

export function ok(data: unknown, status = 200) {
  return NextResponse.json(data, { status, headers: BASE_HEADERS });
}

export function notFound(message: string) {
  return ok({ error: message }, 404);
}

export function preflight() {
  return new NextResponse(null, { status: 204, headers: BASE_HEADERS });
}

export interface PageInfo {
  count: number;
  pages: number;
  next: string | null;
  prev: string | null;
}

export interface Paginated<T> {
  info: PageInfo;
  results: T[];
}

export function paginate<T>(items: T[], url: URL, defaultLimit = 20, maxLimit = 100): Paginated<T> {
  const rawPage = Number(url.searchParams.get("page") ?? "1");
  const rawLimit = Number(url.searchParams.get("limit") ?? String(defaultLimit));
  const limit = Number.isFinite(rawLimit) && rawLimit > 0 ? Math.min(Math.floor(rawLimit), maxLimit) : defaultLimit;
  const count = items.length;
  const pages = Math.max(1, Math.ceil(count / limit));
  const requested = Number.isFinite(rawPage) && rawPage > 0 ? Math.floor(rawPage) : 1;
  const page = Math.min(requested, pages);

  const pageUrl = (p: number) => {
    const u = new URL(url);
    u.searchParams.set("page", String(p));
    u.searchParams.set("limit", String(limit));
    return u.toString();
  };

  return {
    info: {
      count,
      pages,
      next: page < pages ? pageUrl(page + 1) : null,
      prev: page > 1 ? pageUrl(page - 1) : null,
    },
    results: items.slice((page - 1) * limit, page * limit),
  };
}

export function matchText(value: string | undefined | null, query: string | null): boolean {
  if (!query) return true;
  return (value ?? "").toLowerCase().includes(query.toLowerCase());
}

export function matchExact(value: string | undefined | null, query: string | null): boolean {
  if (!query) return true;
  return (value ?? "").toLowerCase() === query.toLowerCase();
}
