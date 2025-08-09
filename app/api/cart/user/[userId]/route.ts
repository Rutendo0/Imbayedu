import { NextResponse } from "next/server";
import { storage } from "../../../../../server/storage";

export async function GET(_: Request, { params }: { params: { userId: string } }) {
  try {
    const userId = parseInt(params.userId);
    if (isNaN(userId)) return NextResponse.json({ message: "Invalid user ID" }, { status: 400 });
    const items = await storage.getCartItemsWithDetails(userId);
    return NextResponse.json(items);
  } catch (err) {
    return NextResponse.json({ message: "Failed to fetch cart items with details" }, { status: 500 });
  }
}

export async function DELETE(_: Request, { params }: { params: { userId: string } }) {
  try {
    const userId = parseInt(params.userId);
    if (isNaN(userId)) return NextResponse.json({ message: "Invalid user ID" }, { status: 400 });
    await storage.clearCart(userId);
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ message: "Failed to clear cart" }, { status: 500 });
  }
}