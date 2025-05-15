import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams, Link, useLocation } from "wouter";
import { Helmet } from "react-helmet";
import { ArtworkWithDetails } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/use-cart";
import { useToast } from "@/hooks/use-toast";
import { formatCurrency } from "@/lib/utils";
import { Heart, Share2, Minus, Plus } from "lucide-react";

const ArtworkDetail = () => {
  const { id } = useParams();
  const [, setLocation] = useLocation();
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();
  const { toast } = useToast();

  const { data: artwork, isLoading, error } = useQuery<ArtworkWithDetails>({
    queryKey: [`/api/artworks/${id}/details`],
  });

  const handleAddToCart = () => {
    if (!artwork) return;
    
    addItem({
      artworkId: artwork.id,
      userId: 1, // Default user ID (guest)
      quantity
    });
    
    toast({
      title: "Added to cart",
      description: `${artwork.title} has been added to your cart.`,
    });
  };

  const handleAddToWishlist = () => {
    if (!artwork) return;
    
    toast({
      title: "Added to wishlist",
      description: `${artwork.title} has been added to your wishlist.`,
    });
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const increaseQuantity = () => {
    setQuantity(quantity + 1);
  };

  if (isLoading) {
    return (
      <div className="pt-24 md:pt-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="animate-pulse bg-gray-200 h-[500px]"></div>
            <div>
              <div className="animate-pulse h-8 bg-gray-200 rounded mb-4 w-3/4"></div>
              <div className="animate-pulse h-6 bg-gray-200 rounded mb-6 w-1/2"></div>
              <div className="animate-pulse h-6 bg-gray-200 rounded mb-8 w-1/4"></div>
              <div className="animate-pulse h-32 bg-gray-200 rounded mb-6"></div>
              <div className="animate-pulse h-10 bg-gray-200 rounded mb-4"></div>
              <div className="animate-pulse h-10 bg-gray-200 rounded mb-4"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !artwork) {
    return (
      <div className="pt-24 md:pt-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <h2 className="text-2xl font-bold mb-4">Artwork not found</h2>
          <p className="mb-6">The artwork you're looking for doesn't exist or has been removed.</p>
          <Button onClick={() => setLocation("/artworks")}>
            Browse Artworks
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{artwork.title} by {artwork.artist.name} | Imbayedu Art Gallery</title>
        <meta name="description" content={`${artwork.title} - ${artwork.description.substring(0, 150)}... - Art by ${artwork.artist.name} available at Imbayedu Art Gallery.`} />
      </Helmet>
      
      <div className="pt-24 md:pt-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Artwork Image */}
            <div>
              <img 
                src={artwork.imageUrl} 
                alt={artwork.title} 
                className="w-full h-auto object-contain shadow-lg"
              />
            </div>
            
            {/* Artwork Details */}
            <div>
              <h1 className="text-3xl md:text-4xl font-['Playfair_Display'] font-bold text-neutral-900 mb-2">{artwork.title}</h1>
              <Link href={`/artists/${artwork.artist.id}`} className="text-lg text-neutral-700 hover:text-[#D3A265] mb-4 inline-block">
                by {artwork.artist.name}
              </Link>
              <p className="text-2xl text-[#D3A265] font-semibold mb-6">{formatCurrency(artwork.price)}</p>
              
              <div className="mb-8">
                <p className="text-neutral-700 mb-6">{artwork.description}</p>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  {artwork.medium && (
                    <div>
                      <h3 className="font-semibold text-neutral-900">Medium</h3>
                      <p className="text-neutral-600">{artwork.medium}</p>
                    </div>
                  )}
                  {artwork.dimensions && (
                    <div>
                      <h3 className="font-semibold text-neutral-900">Dimensions</h3>
                      <p className="text-neutral-600">{artwork.dimensions}</p>
                    </div>
                  )}
                  {artwork.year && (
                    <div>
                      <h3 className="font-semibold text-neutral-900">Year</h3>
                      <p className="text-neutral-600">{artwork.year}</p>
                    </div>
                  )}
                  <div>
                    <h3 className="font-semibold text-neutral-900">Category</h3>
                    <p className="text-neutral-600">{artwork.category.name}</p>
                  </div>
                </div>
              </div>
              
              {/* Quantity Selector */}
              <div className="flex items-center mb-6">
                <span className="mr-4 font-medium">Quantity:</span>
                <div className="flex items-center border border-gray-300 rounded-sm">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={decreaseQuantity}
                    className="h-10 w-10 rounded-none"
                  >
                    <Minus size={16} />
                  </Button>
                  <span className="w-10 text-center">{quantity}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={increaseQuantity}
                    className="h-10 w-10 rounded-none"
                  >
                    <Plus size={16} />
                  </Button>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Button 
                  className="bg-[#D3A265] hover:bg-[#C29255] text-white px-8 py-3"
                  onClick={handleAddToCart}
                >
                  Add to Cart
                </Button>
                <Button 
                  variant="outline" 
                  className="border-neutral-900 text-neutral-900 hover:bg-neutral-900 hover:text-white px-8 py-3"
                  onClick={handleAddToWishlist}
                >
                  <Heart size={18} className="mr-2" />
                  Add to Wishlist
                </Button>
              </div>
              
              {/* Share */}
              <div className="flex items-center">
                <Button variant="ghost" className="text-neutral-600 hover:text-neutral-900 p-0">
                  <Share2 size={18} className="mr-2" />
                  Share this Artwork
                </Button>
              </div>
            </div>
          </div>
          
          {/* Artist Info */}
          <div className="mt-16 py-10 border-t border-gray-200">
            <h2 className="text-2xl font-['Playfair_Display'] font-bold text-neutral-900 mb-6">About the Artist</h2>
            <div className="flex flex-col md:flex-row gap-8">
              <img 
                src={artwork.artist.imageUrl} 
                alt={artwork.artist.name} 
                className="w-40 h-40 object-cover rounded-full"
              />
              <div>
                <h3 className="text-xl font-['Playfair_Display'] font-semibold text-neutral-900 mb-3">{artwork.artist.name}</h3>
                <p className="text-neutral-700 mb-4">{artwork.artist.bio}</p>
                <Link 
                  href={`/artists/${artwork.artist.id}`} 
                  className="text-[#D3A265] font-medium hover:text-neutral-900 transition duration-300"
                >
                  View Artist Profile
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ArtworkDetail;
