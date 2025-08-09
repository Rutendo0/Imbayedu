import { NextResponse } from "next/server";
import { storage } from "../../../../server/storage";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id);
    if (isNaN(id)) return NextResponse.json({ message: "Invalid collection ID" }, { status: 400 });
    const collection = await storage.getCollection(id);
    if (!collection) return NextResponse.json({ message: "Collection not found" }, { status: 404 });
    return NextResponse.json(collection);
  } catch (err) {
    return NextResponse.json({ message: "Failed to fetch collection" }, { status: 500 });
  }
}