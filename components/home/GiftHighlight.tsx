import Link from "next/link";

// Simple block to highlight the gifted artwork formerly listed as "Family"
export default function GiftHighlight() {
  return (
    <section className="py-12 bg-neutral-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="overflow-hidden rounded-md shadow-md">
            <img
              src="/img/artwork/WhatsApp Image 2025-06-24 at 04.32.13.jpg"
              alt="Family - Gifted Artwork"
              className="w-full h-80 object-cover"
            />
          </div>
          <div>
            <h3 className="text-2xl md:text-3xl font-['Playfair_Display'] font-semibold text-neutral-900 mb-3">
              Gifted Artwork: "Family"
            </h3>
            <p className="text-neutral-700 mb-6">
              This special piece was gifted. We showcase it here in appreciation.
            </p>
            <Link href="/artworks" className="inline-block text-[#D3A265] hover:text-neutral-900 font-medium">
              Browse More Artworks
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}