
'use client'

import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Artist, ArtworkWithDetails } from "@shared/schema";
import { Button } from "../ui/button";
import { ArtworkCard } from "../ui/artwork-card";

const ArtistDetail = () => {
  const { id } = useParams();

  const { data: artist, isLoading: artistLoading, error: artistError } = useQuery<Artist>({
    queryKey: ['artist', id],
    queryFn: async () => {
      const response = await fetch(`/api/artists/${id}`);
      if (!response.ok) {
        throw new Error('Artist not found');
      }
      return response.json();
    },
  });

  const { data: artworks, isLoading: artworksLoading } = useQuery<ArtworkWithDetails[]>({
    queryKey: ['artist-artworks-detailed', id],
    queryFn: async () => {
      const res = await fetch(`/api/artists/${id}/artworks`);
      if (!res.ok) throw new Error('Failed to load artworks for artist');
      return res.json();
    },
    enabled: !!id
  });

  const isLoading = artistLoading || artworksLoading;

  if (isLoading) {
    return (
      <div className="pt-24 md:pt-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="animate-pulse">
            <div className="flex flex-col md:flex-row gap-8 mb-12">
              <div className="w-40 h-40 bg-gray-200 rounded-full"></div>
              <div className="flex-1">
                <div className="h-8 bg-gray-200 rounded mb-4 w-1/2"></div>
                <div className="h-4 bg-gray-200 rounded mb-2 w-1/4"></div>
                <div className="h-32 bg-gray-200 rounded"></div>
              </div>
            </div>
            <div className="h-8 bg-gray-200 rounded mb-6 w-1/4"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i}>
                  <div className="bg-gray-200 h-80 rounded-md mb-4"></div>
                  <div className="h-6 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-5 bg-gray-200 rounded w-1/4"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (artistError || !artist) {
    return (
      <div className="pt-24 md:pt-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <h2 className="text-2xl font-bold mb-4">Artist not found</h2>
          <p className="mb-6">The artist you're looking for doesn't exist or has been removed.</p>
          <Link href="/artists">
            <Button>
              Browse All Artists
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Title and description are handled by app/artists/[id]/page.tsx metadata. Avoid using <head> inside client components to prevent hydration errors. */}
      <div className="pt-24 md:pt-32">
        <div className="bg-neutral-100 py-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl md:text-4xl font-['Playfair_Display'] font-bold text-neutral-900 text-center">
              {artist.name}
            </h1>
          </div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row gap-8 mb-12">
            <img 
              src={artist.imageUrl?.startsWith('/') ? artist.imageUrl : `/${artist.imageUrl}`}
              alt={artist.name} 
              className="w-40 h-40 object-cover rounded-full self-start"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = '/img/artwork/artist.png';
              }}
            />
            <div>
              <h2 className="text-2xl font-['Playfair_Display'] font-semibold text-neutral-900 mb-2">
                About the Artist
              </h2>
              {artist.location && (
                <p className="text-[#D3A265] mb-4">
                  {artist.location}
                </p>
              )}
              <p className="text-neutral-700 whitespace-pre-line">
                {artist.bio}
              </p>
            </div>
          </div>

          <h2 className="text-2xl font-['Playfair_Display'] font-semibold text-neutral-900 mb-6">
            Artworks by {artist.name}
          </h2>

          {artworks && artworks.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
              {artworks.map((artwork: ArtworkWithDetails) => (
                <ArtworkCard key={artwork.id} artwork={artwork} />
              ))}
            </div>
          ) : (
            <div className="text-center py-10 border border-gray-200 rounded-md">
              <h3 className="text-xl font-medium text-neutral-900 mb-2">No artworks found</h3>
              <p className="text-neutral-600 mb-6">There are currently no artworks available from this artist.</p>
              <Link href="/artworks">
                <Button variant="outline">Browse All Artworks</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ArtistDetail;
