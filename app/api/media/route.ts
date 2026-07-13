import { NextResponse } from "next/server";
import mediaData from "@/data/media.json";

export async function GET() {
  return NextResponse.json(mediaData);
}
