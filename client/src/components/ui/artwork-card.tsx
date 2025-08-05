import React from "react";
import { Link } from "wouter";
import { Gift } from "lucide-react";
import { ArtworkWithDetails } from "@shared/schema";

interface ArtworkCardProps {
  artwork: ArtworkWithDetails;
}

export const ArtworkCard = ({ artwork }: ArtworkCardProps) => {
  // Check if this is a gift artwork (price is 0 or specific gift indicator)
  const isGiftArtwork = artwork.price === 0 || artwork.description?.includes('[GIFT]');

  return (
    <Link href={`/artworks/${artwork.id}`}>
      <div className="group cursor-pointer">
        <div className="aspect-[4/5] overflow-hidden mb-4 bg-neutral-100 relative">
          <img
            src={artwork.imageUrl?.startsWith('/') ? artwork.imageUrl : `/${artwork.imageUrl}`}
            alt={artwork.title}
            loading="lazy"
            decoding="async"
            className={`w-full h-full object-cover transition-all duration-500 ease-in-out group-hover:scale-105 ${!artwork.inStock && !isGiftArtwork ? 'opacity-75' : ''}`}
          />
          
          {/* Gift Artwork Overlay */}
          {isGiftArtwork && (
            <div className="absolute top-3 right-3">
              <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold text-xs px-3 py-1 rounded-full shadow-lg flex items-center gap-1">
                <Gift size={12} />
                GIFT TO COLLECTIVE
              </div>
            </div>
          )}
          
          {/* Sold Out Overlay */}
          {!artwork.inStock && !isGiftArtwork && (
            <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
              <span className="text-white font-semibold text-lg bg-black bg-opacity-60 px-4 py-2 rounded">
                SOLD OUT
              </span>
            </div>
          )}
        </div>
        
        <div className="space-y-1">
          <h3 className="text-lg font-medium text-neutral-900">{artwork.title}</h3>
          <p className="text-sm text-neutral-600">{artwork.artist?.name || 'Unknown Artist'}</p>
          
          {/* Price or Gift Status */}
          <div className="flex items-center gap-2">
            {isGiftArtwork ? (
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-amber-600 bg-amber-50 px-2 py-1 rounded">
                  Gift to Collective
                </span>
                <span className="text-xs text-neutral-500">Not for Sale</span>
              </div>
            ) : (
              <>
                <p className={`text-sm font-medium ${!artwork.inStock ? 'text-neutral-500 line-through' : 'text-neutral-900'}`}>
                  ${artwork.price.toLocaleString()}
                </p>
                {!artwork.inStock && (
                  <span className="text-xs font-medium text-red-600 bg-red-100 px-2 py-1 rounded">
                    Sold Out
                  </span>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};