import { NextResponse } from "next/server";
import { storage } from "../../../server/storage";
import { insertCollectionSchema } from "@shared/schema";

export async function GET() {
  try {
    const collections = await storage.getCollections();
    return NextResponse.json(collections);
  } catch (err) {
    return NextResponse.json({ message: "Failed to fetch collections" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validated = insertCollectionSchema.parse(body);
    const collection = await storage.createCollection(validated);
    return NextResponse.json(collection, { status: 201 });
  } catch (err: any) {
    if (err?.name === "ZodError") {
      return NextResponse.json({ message: "Invalid collection data", errors: err.errors }, { status: 400 });
    }
    return NextResponse.json({ message: "Failed to create collection" }, { status: 500 });
  }
}