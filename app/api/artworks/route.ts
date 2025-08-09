import { NextResponse } from "next/server";
import { storage } from "../../../server/storage";
import { insertArtworkSchema } from "@shared/schema";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get("categoryId");
    const artistId = searchParams.get("artistId");
    const collectionId = searchParams.get("collectionId");
    const featured = searchParams.get("featured");

    let artworks;
    if (categoryId) {
      artworks = await storage.getArtworksByCategory(parseInt(categoryId));
    } else if (artistId) {
      artworks = await storage.getArtworksByArtist(parseInt(artistId));
    } else if (collectionId) {
      artworks = await storage.getArtworksByCollection(parseInt(collectionId));
    } else if (featured === "true") {
      artworks = await storage.getFeaturedArtworks();
    } else {
      artworks = await storage.getArtworks();
    }

    return NextResponse.json(artworks);
  } catch (err) {
    return NextResponse.json({ message: "Failed to fetch artworks" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validated = insertArtworkSchema.parse(body);
    const artwork = await storage.createArtwork(validated);
    return NextResponse.json(artwork, { status: 201 });
  } catch (err: any) {
    if (err?.name === "ZodError") {
      return NextResponse.json({ message: "Invalid artwork data", errors: err.errors }, { status: 400 });
    }
    return NextResponse.json({ message: "Failed to create artwork" }, { status: 500 });
  }
}