import { NextResponse } from "next/server";
import { storage } from "../../../../server/storage";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id);
    if (isNaN(id)) return NextResponse.json({ message: "Invalid artist ID" }, { status: 400 });
    const artist = await storage.getArtist(id);
    if (!artist) return NextResponse.json({ message: "Artist not found" }, { status: 404 });
    return NextResponse.json(artist);
  } catch (err) {
    return NextResponse.json({ message: "Failed to fetch artist" }, { status: 500 });
  }
}