import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { Artist } from "@shared/schema";
import { ArtistCard } from "../ui/artist-card";

const FeaturedArtists = () => {
  const fetchFeaturedArtists = async (): Promise<Artist[]> => {
    const response = await fetch('/api/artists/featured');
    if (!response.ok) throw new Error('Network response was not ok');
    return response.json();
  };

  const { data: artists, isLoading, error } = useQuery<Artist[]>({
    queryKey: ['/api/artists/featured'],
    queryFn: fetchFeaturedArtists
  });

  if (isLoading) {
    return (
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-['Playfair_Display'] font-bold text-neutral-900 mb-4">Meet Our Artists</h2>
            <p className="text-neutral-600 max-w-3xl mx-auto">Discover the talented creators behind our exceptional collection of African art</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex flex-col items-center animate-pulse">
                <div className="w-40 h-40 rounded-full bg-gray-200 mb-6"></div>
                <div className="h-6 bg-gray-200 rounded mb-2 w-1/2"></div>
                <div className="h-4 bg-gray-200 rounded mb-4 w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error || !artists) {
    return null;
  }

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-['Playfair_Display'] font-bold text-neutral-900 mb-4">Meet Our Artists</h2>
          <p className="text-neutral-600 max-w-3xl mx-auto">Discover the talented creators behind our exceptional collection of African art</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {Array.from(new Map(artists.map((a) => [String(a.id), a])).values())
            .map((artist) => (
              <ArtistCard key={artist.id} artist={artist} />
            ))}
        </div>

        <div className="mt-12 text-center">
          <Link 
            href="/artists" 
            className="inline-block border border-neutral-900 text-neutral-900 hover:bg-neutral-900 hover:text-white font-medium px-8 py-3 rounded-sm transition duration-300"
          >
            Meet All Artists
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedArtists;
