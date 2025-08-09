import { NextResponse } from "next/server";
import { storage } from "../../../../server/storage";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id);
    if (isNaN(id)) return NextResponse.json({ message: "Invalid artwork ID" }, { status: 400 });
    const artwork = await storage.getArtworkWithDetails(id);
    if (!artwork) return NextResponse.json({ message: "Artwork not found" }, { status: 404 });
    return NextResponse.json(artwork);
  } catch (err) {
    return NextResponse.json({ message: "Failed to fetch artwork" }, { status: 500 });
  }
}