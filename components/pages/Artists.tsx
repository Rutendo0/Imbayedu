'use client'

import { useQuery } from "@tanstack/react-query";
import { Artist } from "@shared/schema";
import { ArtistCard } from "../ui/artist-card";

const Artists = () => {
  const fetchArtists = async (): Promise<Artist[]> => {
    const response = await fetch('/api/artists');
    if (!response.ok) throw new Error('Network response was not ok');
    return response.json();
  };

  const { data: artists, isLoading, error } = useQuery<Artist[]>({
    queryKey: ['/api/artists'],
    queryFn: fetchArtists
  });

  return (
    <div className="pt-24 md:pt-32">
        <div className="bg-neutral-100 py-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl md:text-4xl font-['Playfair_Display'] font-bold text-neutral-900 text-center">
              Our Artists
            </h1>
          </div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <p className="text-lg text-neutral-700 max-w-4xl mx-auto text-center mb-12">
            At Imba Yedu, we are more than a collective—we are a family. Our artists are luminaries, each bringing a unique voice to the rich symphony of African art. Sculptors breathe life into stone, painters weave dreams onto canvas, and textile artists thread heritage into fabric.

When you collect from Imba Yedu, you take home more than a piece of art. You become part of an artist’s journey—a story of resilience, inspiration, and unyielding creativity. These are not mere artworks; they are heirlooms, destined to grace spaces with their presence and history for generations.
          </p>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="flex flex-col items-center animate-pulse">
                  <div className="w-40 h-40 rounded-full bg-gray-200 mb-6"></div>
                  <div className="h-6 bg-gray-200 rounded mb-2 w-1/2"></div>
                  <div className="h-24 bg-gray-200 rounded mb-4 w-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                </div>
              ))}
            </div>
          ) : error || !artists ? (
            <div className="text-center py-12">
              <h3 className="text-xl font-medium text-neutral-900 mb-4">Error loading artists</h3>
              <p className="text-neutral-600">Please try again later.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
              {artists.map((artist) => (
                <ArtistCard key={artist.id} artist={artist} />
              ))}
            </div>
          )}
        </div>
      </div>
  );
};

export default Artists;
