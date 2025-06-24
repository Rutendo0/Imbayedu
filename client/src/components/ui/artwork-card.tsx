import React from "react";
import { Link } from "wouter";
import { ArtworkWithDetails } from "../../../shared/schema";

interface ArtworkCardProps {
  artwork: ArtworkWithDetails;
}

export const ArtworkCard = ({ artwork }: ArtworkCardProps) => {
  return (
    <Link href={`/artworks/${artwork.id}`}>
      <div className="group cursor-pointer">
        <div className="aspect-[4/5] overflow-hidden mb-4 bg-neutral-100 relative">
          <img
            src={artwork.imageUrl?.startsWith('/') ? artwork.imageUrl : `/${artwork.imageUrl}`}
            alt={artwork.title}
            loading="lazy"
            decoding="async"
            className={`w-full h-full object-cover transition-all duration-500 ease-in-out group-hover:scale-105 ${!artwork.inStock ? 'opacity-75' : ''}`}
          />
          {!artwork.inStock && (
            <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
              <span className="text-white font-semibold text-lg bg-black bg-opacity-60 px-4 py-2 rounded">
                SOLD OUT
              </span>
            </div>
          )}
        </div>
        <h3 className="text-lg font-medium text-neutral-900 mb-1">{artwork.title}</h3>
        <p className="text-sm text-neutral-600 mb-2">{artwork.artist?.name || 'Unknown Artist'}</p>
        <div className="flex items-center gap-2">
          <p className={`text-sm font-medium ${!artwork.inStock ? 'text-neutral-500 line-through' : 'text-neutral-900'}`}>
            ${artwork.price.toLocaleString()}
          </p>
          {!artwork.inStock && (
            <span className="text-xs font-medium text-red-600 bg-red-100 px-2 py-1 rounded">
              Sold Out
            </span>
          )}
        </div>
      </div>
    </Link>
  );
};