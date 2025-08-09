import { NextResponse } from "next/server";
import { storage } from "../../../../server/storage";

export async function GET() {
  try {
    const artworks = await storage.getArtworksWithDetails();
    return NextResponse.json(artworks);
  } catch (err) {
    return NextResponse.json({ message: "Failed to fetch artworks with details" }, { status: 500 });
  }
}