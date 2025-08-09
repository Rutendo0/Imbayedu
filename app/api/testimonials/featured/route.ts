import { NextResponse } from "next/server";
import { storage } from "../../../../server/storage";

export async function GET() {
  try {
    const testimonials = await storage.getFeaturedTestimonials();
    return NextResponse.json(testimonials);
  } catch (err) {
    return NextResponse.json({ message: "Failed to fetch featured testimonials" }, { status: 500 });
  }
}