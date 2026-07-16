import { teasersById } from "@/lib/data";
import { notFound, ok, preflight } from "@/lib/api";

export function OPTIONS() {
  return preflight();
}

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const teaser = teasersById.get(id.toLowerCase());
  if (!teaser) {
    return notFound(`Teaser '${id}' not found`);
  }
  return ok(teaser);
}
