import { NextResponse } from "next/server";
import { storage } from "../../../../server/storage";

export async function GET() {
  try {
    const collections = await storage.getFeaturedCollections();
    return NextResponse.json(collections);
  } catch (err) {
    return NextResponse.json({ message: "Failed to fetch featured collections" }, { status: 500 });
  }
}