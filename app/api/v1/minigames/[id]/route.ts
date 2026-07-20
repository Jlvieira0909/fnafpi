import { minigamesById } from "@/lib/data";
import { notFound, ok, preflight } from "@/lib/api";

export function OPTIONS() {
  return preflight();
}

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const minigame = minigamesById.get(id.toLowerCase());
  if (!minigame) {
    return notFound(`Minigame '${id}' not found`);
  }
  return ok(minigame);
}
