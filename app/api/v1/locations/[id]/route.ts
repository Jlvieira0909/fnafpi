import { locationsById } from "@/lib/data";
import { notFound, ok, preflight } from "@/lib/api";

export function OPTIONS() {
  return preflight();
}

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const location = locationsById.get(id.toLowerCase());
  if (!location) {
    return notFound(`Location '${id}' not found`);
  }
  return ok(location);
}
