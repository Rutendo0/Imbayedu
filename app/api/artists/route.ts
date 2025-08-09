import { NextResponse } from "next/server";
import { storage } from "../../../server/storage";
import { insertArtistSchema } from "@shared/schema";

export async function GET() {
  try {
    const artists = await storage.getArtists();
    return NextResponse.json(artists);
  } catch (err) {
    return NextResponse.json({ message: "Failed to fetch artists" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validated = insertArtistSchema.parse(body);
    const artist = await storage.createArtist(validated);
    return NextResponse.json(artist, { status: 201 });
  } catch (err: any) {
    if (err?.name === "ZodError") {
      return NextResponse.json({ message: "Invalid artist data", errors: err.errors }, { status: 400 });
    }
    return NextResponse.json({ message: "Failed to create artist" }, { status: 500 });
  }
}