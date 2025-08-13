'use client'

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArtworkWithDetails } from "@shared/schema";
import { Button } from "../ui/button";
import { useCart } from "../../hooks/use-cart";
import { useToast } from "../../hooks/use-toast";
import { formatCurrency } from "../../lib/utils";
import { Heart, Share2, Gift, Plus, Minus } from "lucide-react";

const ArtworkDetail = () => {
  const { id } = useParams();
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();
  const { toast } = useToast();

  const { data: artwork, isLoading, error } = useQuery<ArtworkWithDetails>({
    queryKey: ['artwork', id],
    queryFn: async () => {
      if (!id) throw new Error('No artwork ID provided');
      const response = await fetch(`/api/artworks/${id}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch artwork: ${response.statusText}`);
      }
      return response.json();

    },

    retry: 3, // Number of retries
  retryDelay: (attempt) => Math.min(attempt * 1000, 5000), // Exponential backoff
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
          <Link href="/artworks">
            <Button>
              Browse Artworks
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* SEO head tags are typically set in server components or layout; omitting Helmet in client component */}

      <div className="pt-24 md:pt-32">
        {/* Breadcrumb navigation */}
        <div className="bg-gray-50 py-4 border-b border-gray-100">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex text-sm">
              <Link href="/" className="text-neutral-500 hover:text-[#D3A265]">Home</Link>
              <span className="mx-2 text-neutral-400">/</span>
              <Link href="/artworks" className="text-neutral-500 hover:text-[#D3A265]">Artworks</Link>
              <span className="mx-2 text-neutral-400">/</span>
              <span className="text-neutral-800">{artwork.title}</span>
            </nav>
          </div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Artwork Image Section */}
            <div className="flex flex-col">
              <div className="bg-white p-2 shadow-lg mb-6">
                <div className="bg-gray-50 flex items-center justify-center p-4">
                  <img 
                    src={artwork.imageUrl?.startsWith('/') ? artwork.imageUrl : `/${artwork.imageUrl}`}
                    alt={artwork.title} 
                    className="max-w-full max-h-[600px] object-contain"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.onerror = null;
                      target.src = "https://via.placeholder.com/600x800?text=Image+Not+Available";
                    }}
                  />
                </div>
              </div>

              {/* Only show artwork details for non-gift artworks */}
              {!(artwork.price === 0 || artwork.description?.includes('[GIFT]')) && (
                <div className="bg-gray-50 p-6 rounded-md">
                  <h2 className="text-lg font-medium mb-4 text-neutral-800">Artwork Details</h2>
                  <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                    {artwork.medium && (
                      <div>
                        <h3 className="text-sm font-semibold text-neutral-900 uppercase tracking-wide">Medium</h3>
                        <p className="text-neutral-600">{artwork.medium}</p>
                      </div>
                    )}
                    {artwork.dimensions && (
                      <div>
                        <h3 className="text-sm font-semibold text-neutral-900 uppercase tracking-wide">Dimensions</h3>
                        <p className="text-neutral-600">{artwork.dimensions}</p>
                      </div>
                    )}
                    {artwork.year && (
                      <div>
                        <h3 className="text-sm font-semibold text-neutral-900 uppercase tracking-wide">Year</h3>
                        <p className="text-neutral-600">{artwork.year}</p>
                      </div>
                    )}
                    <div>
                      <h3 className="text-sm font-semibold text-neutral-900 uppercase tracking-wide">Category</h3>
                      <p className="text-neutral-600">{artwork.category.name}</p>
                    </div>
                    {artwork.collection && (
                      <div>
                        <h3 className="text-sm font-semibold text-neutral-900 uppercase tracking-wide">Collection</h3>
                        <p className="text-neutral-600">{artwork.collection.name}</p>
                      </div>
                    )}
                    <div>
                      <h3 className="text-sm font-semibold text-neutral-900 uppercase tracking-wide">Availability</h3>
                      <p className="text-neutral-600">{artwork.inStock ? 'In Stock' : 'Sold Out'}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Artwork Details Section */}
            <div>
              <h1 className="text-3xl md:text-4xl font-['Playfair_Display'] font-bold text-neutral-900 mb-2">{artwork.title}</h1>

              <div className="flex items-center mb-5">
                {artwork.artist ? (
                  <Link href={`/artists/${artwork.artist.id}`} className="text-lg text-neutral-700 hover:text-[#D3A265] inline-block">
                    {artwork.artist.name}
                  </Link>
                ) : (
                  <span className="text-lg text-neutral-700">Unknown Artist</span>
                )}
                {artwork.artist?.location && (
                  <>
                    <span className="mx-2 text-neutral-400">•</span>
                    <span className="text-neutral-500">{artwork.artist.location}</span>
                  </>
                )}
              </div>

              <div className="flex items-center mb-10">
                  {artwork.price === 0 || artwork.description?.includes('[GIFT]') ? (
                    <div className="flex items-center gap-4">
                      <span className="text-2xl font-bold text-amber-600 bg-amber-50 px-4 py-2 rounded-lg flex items-center gap-2">
                        <Gift size={24} />
                        Gift to Collective
                      </span>
                      <span className="text-lg text-neutral-600">Not Available for Purchase</span>
                    </div>
                  ) : (
                    <>
                      <span className={`text-4xl font-bold ${artwork.inStock ? 'text-neutral-900' : 'text-neutral-500'}`}>
                        ${artwork.price.toLocaleString()}
                      </span>
                      {!artwork.inStock && (
                        <span className="ml-4 text-lg font-medium text-red-600 bg-red-100 px-3 py-1 rounded">
                          Sold Out
                        </span>
                      )}
                    </>
                  )}
                </div>

              <div className="mb-10">
                <p className="text-neutral-700 mb-6 leading-relaxed">{artwork.description}</p>
              </div>

              {/* Purchase Options */}
              <div className="bg-gray-50 p-6 mb-8 rounded-md">
                <h2 className="text-lg font-medium mb-6 text-neutral-800">Purchase Options</h2>

                {/* Quantity Selector */}
                <div className="flex items-center mb-6">
                  <span className="mr-4 text-neutral-700">Quantity:</span>
                  <div className="flex items-center border border-gray-300 rounded">
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
                {!(artwork.price === 0 || artwork.description?.includes('[GIFT]')) && (
                  <div className="flex flex-col sm:flex-row gap-4 mb-4">
                    <Button 
                      className="bg-[#D3A265] hover:bg-[#C29255] text-white px-8 py-6 h-auto rounded" 
                      onClick={handleAddToCart}
                      disabled={!artwork.inStock}
                    >
                      {artwork.inStock ? 'Add to Cart' : 'Sold Out'}
                    </Button>
                    <Button 
                      variant="outline" 
                      className="border-neutral-900 text-neutral-900 hover:bg-neutral-100 px-8 py-6 h-auto rounded"
                      onClick={handleAddToWishlist}
                    >
                      <Heart size={18} className="mr-2" />
                      Add to Wishlist
                    </Button>
                  </div>
                )}

                <p className="text-sm text-neutral-500 italic mt-4">
                  This artwork ships with a certificate of authenticity.
                  Free shipping on orders over $500.
                </p>
              </div>

              {/* Share */}
              <div className="flex items-center mb-10">
                <Button variant="ghost" className="text-neutral-600 hover:text-neutral-900 p-0">
                  <Share2 size={18} className="mr-2" />
                  Share this Artwork
                </Button>
              </div>

              {/* Artist Info Preview */}
              {artwork.artist && (
                <div className="bg-white p-6 border border-gray-100 rounded-md">
                  <div className="flex items-center gap-4 mb-4">
                    <img 
                      src={artwork.artist.imageUrl ? `/${artwork.artist.imageUrl}` : "https://via.placeholder.com/56x56?text=Artist"} 
                      alt={artwork.artist.name} 
                      className="w-14 h-14 object-cover rounded-full"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.onerror = null;
                        target.src = "https://via.placeholder.com/56x56?text=Artist";
                      }}
                    />
                    <div>
                      <h3 className="font-medium text-neutral-900">{artwork.artist.name}</h3>
                      {artwork.artist.location && (
                        <p className="text-sm text-neutral-500">{artwork.artist.location}</p>
                      )}
                    </div>
                  </div>
                  <Link 
                    href={`/artists/${artwork.artist.id}`} 
                    className="text-[#D3A265] font-medium hover:text-neutral-900 transition duration-300 text-sm"
                  >
                    View Artist Profile →
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Artist Info Full Section */}
          {artwork.artist && (
            <div className="mt-16 py-10 border-t border-gray-200">
              <h2 className="text-2xl font-['Playfair_Display'] font-bold text-neutral-900 mb-6">About the Artist</h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
                <div className="md:col-span-1">
                  <img 
                    src={artwork.artist.imageUrl ? `/${artwork.artist.imageUrl}` : "https://via.placeholder.com/300x300?text=Artist"} 
                    alt={artwork.artist.name} 
                    className="w-full aspect-square object-cover rounded-md mb-4"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.onerror = null;
                      target.src = "https://via.placeholder.com/300x300?text=Artist";
                    }}
                  />
                  <h3 className="text-xl font-medium text-neutral-900 mb-1">{artwork.artist.name}</h3>
                  {artwork.artist.location && (
                    <p className="text-neutral-500 mb-3">{artwork.artist.location}</p>
                  )}
                  <Link 
                    href={`/artists/${artwork.artist.id}`} 
                    className="text-[#D3A265] font-medium hover:text-neutral-900 transition duration-300"
                  >
                    View Full Profile
                  </Link>
                </div>
                <div className="md:col-span-3">
                  <p className="text-neutral-700 leading-relaxed">{artwork.artist.bio}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ArtworkDetail;