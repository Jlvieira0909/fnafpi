import { charactersById, variantsOf } from "@/lib/data";
import { notFound, ok, preflight } from "@/lib/api";

export function OPTIONS() {
  return preflight();
}

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const character = charactersById.get(id.toLowerCase());
  if (!character) {
    return notFound(`Character '${id}' not found`);
  }
  return ok({ ...character, variants: variantsOf(character.id) });
}
