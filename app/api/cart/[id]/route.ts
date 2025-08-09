import { NextResponse } from "next/server";
import { storage } from "../../../../server/storage";

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id);
    if (isNaN(id)) return NextResponse.json({ message: "Invalid cart item ID" }, { status: 400 });
    const { quantity } = await request.json();
    if (typeof quantity !== "number" || quantity < 1) {
      return NextResponse.json({ message: "Invalid quantity" }, { status: 400 });
    }
    const updated = await storage.updateCartItemQuantity(id, quantity);
    if (!updated) return NextResponse.json({ message: "Cart item not found" }, { status: 404 });
    return NextResponse.json(updated);
  } catch (err) {
    return NextResponse.json({ message: "Failed to update cart item" }, { status: 500 });
  }
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id);
    if (isNaN(id)) return NextResponse.json({ message: "Invalid cart item ID" }, { status: 400 });
    const success = await storage.removeCartItem(id);
    if (!success) return NextResponse.json({ message: "Cart item not found" }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ message: "Failed to remove cart item" }, { status: 500 });
  }
}