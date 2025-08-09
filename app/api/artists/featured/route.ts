import { NextResponse } from "next/server";
import { storage } from "../../../../server/storage";

export async function GET() {
  try {
    const artists = await storage.getFeaturedArtists();
    return NextResponse.json(artists);
  } catch (err) {
    return NextResponse.json({ message: "Failed to fetch featured artists" }, { status: 500 });
  }
}