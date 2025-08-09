import { NextResponse } from "next/server";
import { storage } from "../../../server/storage";
import { insertTestimonialSchema } from "@shared/schema";

export async function GET() {
  try {
    const testimonials = await storage.getTestimonials();
    return NextResponse.json(testimonials);
  } catch (err) {
    return NextResponse.json({ message: "Failed to fetch testimonials" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validated = insertTestimonialSchema.parse(body);
    const testimonial = await storage.createTestimonial(validated);
    return NextResponse.json(testimonial, { status: 201 });
  } catch (err: any) {
    if (err?.name === "ZodError") {
      return NextResponse.json({ message: "Invalid testimonial data", errors: err.errors }, { status: 400 });
    }
    return NextResponse.json({ message: "Failed to create testimonial" }, { status: 500 });
  }
}