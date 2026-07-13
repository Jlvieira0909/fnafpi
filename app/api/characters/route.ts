import { NextResponse } from "next/server";
import charactersData from "@/data/characters.json";

export async function GET() {
  return NextResponse.json(charactersData);
}
