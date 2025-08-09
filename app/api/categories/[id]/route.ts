import { NextResponse } from "next/server";
import { storage } from "../../../../server/storage";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id);
    if (isNaN(id)) return NextResponse.json({ message: "Invalid category ID" }, { status: 400 });
    const category = await storage.getCategory(id);
    if (!category) return NextResponse.json({ message: "Category not found" }, { status: 404 });
    return NextResponse.json(category);
  } catch (err) {
    return NextResponse.json({ message: "Failed to fetch category" }, { status: 500 });
  }
}