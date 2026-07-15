import { charactersIn, mediaById } from "@/lib/data";
import { notFound, ok, preflight } from "@/lib/api";

export function OPTIONS() {
  return preflight();
}

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const entry = mediaById.get(id.toLowerCase());
  if (!entry) {
    return notFound(`Media '${id}' not found`);
  }
  return ok({ ...entry, characters: charactersIn(entry.id) });
}
