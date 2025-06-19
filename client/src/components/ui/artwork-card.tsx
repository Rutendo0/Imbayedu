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
        <div className="aspect-[4/5] overflow-hidden mb-4 bg-neutral-100">
          <img
            src={artwork.imageUrl?.startsWith('/') ? artwork.imageUrl : `/${artwork.imageUrl}`}
            alt={artwork.title}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover transition-all duration-500 ease-in-out group-hover:scale-105"
          />
        </div>
        <h3 className="text-lg font-medium text-neutral-900 mb-1">{artwork.title}</h3>
        <p className="text-sm text-neutral-600 mb-2">{artwork.artist?.name || 'Unknown Artist'}</p>
        <p className="text-sm font-medium text-neutral-900">${artwork.price.toLocaleString()}</p>
      </div>
    </Link>
  );
};