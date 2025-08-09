import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    message: "Imbayedu API",
    endpoints: [
      "/api/health",
      "/api/categories",
      "/api/artists",
      "/api/collections",
      "/api/artworks",
      "/api/artworks/details",
      "/api/cart",
      "/api/testimonials",
    ],
  });
}