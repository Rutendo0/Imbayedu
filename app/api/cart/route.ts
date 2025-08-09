import { NextResponse } from "next/server";
import { storage } from "../../../server/storage";
import { insertCartItemSchema } from "@shared/schema";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validated = insertCartItemSchema.parse(body);
    const item = await storage.createCartItem(validated);
    return NextResponse.json(item, { status: 201 });
  } catch (err: any) {
    if (err?.name === "ZodError") {
      return NextResponse.json({ message: "Invalid cart item data", errors: err.errors }, { status: 400 });
    }
    return NextResponse.json({ message: "Failed to add item to cart" }, { status: 500 });
  }
}