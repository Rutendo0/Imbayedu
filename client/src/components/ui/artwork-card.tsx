import { useState } from "react";
import { Link } from "wouter";
import { Heart, ShoppingCart, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/hooks/use-cart";
import { formatCurrency } from "@/lib/utils";
import { ArtworkWithDetails } from "@shared/schema";

interface ArtworkCardProps {
  artwork: ArtworkWithDetails;
}

export function ArtworkCard({ artwork }: ArtworkCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const { toast } = useToast();
  const { addItem } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    addItem({
      artworkId: artwork.id,
      userId: 1, // Default user ID (guest)
      quantity: 1
    });
    
    toast({
      title: "Added to cart",
      description: `${artwork.title} has been added to your cart.`,
    });
  };

  const handleAddToWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    toast({
      title: "Added to wishlist",
      description: `${artwork.title} has been added to your wishlist.`,
    });
  };
  
  return (
    <div 
      className="group bg-white overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative overflow-hidden shadow-sm">
        <Link href={`/artworks/${artwork.id}`}>
          <div className="w-full h-[300px] overflow-hidden bg-gray-100">
            <img 
              src={artwork.imageUrl} 
              alt={artwork.title} 
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.onerror = null;
                target.src = 'https://via.placeholder.com/400x500?text=Image+Not+Found';
              }}
            />
          </div>
          <div className={`absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300`}>
            <div className="flex space-x-3">
              <Button
                onClick={handleAddToWishlist}
                className="bg-white text-neutral-900 p-2 rounded-full hover:bg-[#D3A265] hover:text-white transition-colors"
                size="icon"
                variant="ghost"
              >
                <Heart size={18} />
              </Button>
              <Button
                onClick={handleAddToCart}
                className="bg-white text-neutral-900 p-2 rounded-full hover:bg-[#D3A265] hover:text-white transition-colors"
                size="icon"
                variant="ghost"
              >
                <ShoppingCart size={18} />
              </Button>
              <Button
                className="bg-white text-neutral-900 p-2 rounded-full hover:bg-[#D3A265] hover:text-white transition-colors"
                size="icon"
                variant="ghost"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  window.location.href = `/artworks/${artwork.id}`;
                }}
              >
                <Search size={18} />
              </Button>
            </div>
          </div>
        </Link>
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="text-lg font-['Playfair_Display'] font-medium text-neutral-900 hover:text-[#D3A265] transition-colors">
              <Link href={`/artworks/${artwork.id}`}>{artwork.title}</Link>
            </h3>
            <p className="text-neutral-600 text-sm hover:text-[#D3A265] transition-colors">
              <Link href={`/artists/${artwork.artist.id}`}>{artwork.artist.name}</Link>
            </p>
          </div>
          <p className="text-[#D3A265] font-semibold">{formatCurrency(artwork.price)}</p>
        </div>
        <div className="flex justify-between items-center text-xs text-neutral-500 mt-2">
          <span>{artwork.medium}</span>
          <span>{artwork.dimensions}</span>
        </div>
      </div>
    </div>
  );
}
