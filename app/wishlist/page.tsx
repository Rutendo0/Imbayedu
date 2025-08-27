"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useWishlist } from "@/components/hooks/use-wishlist";
import { CartItemWithDetails, Artwork } from "@shared/schema";

export default function WishlistPage() {
  const { items, removeItem, clearWishlist } = useWishlist();
  const [artworks, setArtworks] = useState<Record<number, Artwork | null>>({});
  const [isLoading, setIsLoading] = useState(false);

  const artworkIds = useMemo(() => items.map((i) => i.artworkId), [items]);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setIsLoading(true);
      try {
        const results: Record<number, Artwork | null> = {};
        await Promise.all(
          artworkIds.map(async (id) => {
            try {
              const res = await fetch(`/api/artworks/${id}`, { credentials: "include" });
              if (!res.ok) throw new Error("not ok");
              results[id] = await res.json();
            } catch {
              results[id] = null;
            }
          })
        );
        if (!cancelled) setArtworks(results);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };
    if (artworkIds.length) load();
    else setArtworks({});
    return () => {
      cancelled = true;
    };
  }, [artworkIds]);

  return (
    <section className="py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl md:text-4xl font-['Playfair_Display'] font-bold text-neutral-900">
            Your Wishlist
          </h1>
          {items.length > 0 && (
            <button
              onClick={() => clearWishlist()}
              className="text-sm text-red-600 hover:text-red-800"
            >
              Clear all
            </button>
          )}
        </div>

        {items.length === 0 ? (
          <p className="text-neutral-600">
            Your wishlist is empty. Browse artworks and add favorites.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {items.map(({ artworkId }) => {
              const data = artworks[artworkId];
              return (
                <div key={artworkId} className="border rounded-md overflow-hidden shadow-sm">
                  <div className="h-64 bg-neutral-100">
                    {data?.imageUrl ? (
                      <img src={data.imageUrl} alt={data.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-neutral-500">
                        Image unavailable
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold mb-1">{data?.title ?? `Artwork #${artworkId}`}</h3>
                    <p className="text-sm text-neutral-600 mb-4">
                      {data?.artistId ? `Artist #${data.artistId}` : ""}
                    </p>
                    <div className="flex gap-3">
                      {data ? (
                        <Link
                          href={`/artworks/${data.id}`}
                          className="text-[#D3A265] hover:text-neutral-900 text-sm"
                        >
                          View
                        </Link>
                      ) : null}
                      <button
                        onClick={() => removeItem(artworkId)}
                        className="text-sm text-red-600 hover:text-red-800"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}