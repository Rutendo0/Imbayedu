
import { Link } from "wouter";
import { Artist } from "@shared/schema";

interface ArtistCardProps {
  artist: Artist;
}

export function ArtistCard({ artist }: ArtistCardProps) {
  return (
    <div className="flex flex-col items-center">
      <img 
        src={artist.imageUrl} 
        alt={artist.name} 
        className="w-40 h-40 object-cover rounded-full mb-6 shadow-md"
      />
      <h3 className="text-xl font-['Playfair_Display'] font-semibold text-neutral-900 mb-2">{artist.name}</h3>
      <p className="text-neutral-600 text-center mb-4 line-clamp-3">{artist.bio}</p>
      <Link 
        href={`/artists/${artist.id}`} 
        className="text-[#D3A265] text-sm font-medium border-b border-[#D3A265] pb-1 hover:text-neutral-900 hover:border-neutral-900 transition duration-300"
      >
        View Profile
      </Link>
    </div>
  );
}
