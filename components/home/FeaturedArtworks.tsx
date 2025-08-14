import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { ArtworkWithDetails, Category } from "@shared/schema";
import { ArtworkCard } from "../ui/artwork-card";
import { FilterBar } from "../ui/filter-bar";
import { ChevronLeft, ChevronRight } from "lucide-react";

const FeaturedArtworks = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortOrder, setSortOrder] = useState("latest");
  const [currentView, setCurrentView] = useState(0);
  const sliderRef = useRef<HTMLDivElement>(null);

  const fetchArtworks = async (): Promise<ArtworkWithDetails[]> => {
    const response = await fetch('/api/artworks/details');
    if (!response.ok) throw new Error('Network response was not ok');
    return response.json();
  };

  const fetchCategories = async (): Promise<Category[]> => {
    const response = await fetch('/api/categories');
    if (!response.ok) throw new Error('Network response was not ok');
    return response.json();
  };

  const { data: artworks, isLoading: artworksLoading } = useQuery<ArtworkWithDetails[]>({
    queryKey: ['/api/artworks/details'],
    queryFn: fetchArtworks,
    staleTime: 300000, // Cache data for 5 minutes
    refetchOnWindowFocus: false,
  });

  const { data: categories, isLoading: categoriesLoading } = useQuery<Category[]>({
    queryKey: ['/api/categories'],
    queryFn: fetchCategories,
    staleTime: 300000, // Cache data for 5 minutes
    refetchOnWindowFocus: false,
  });

  const isLoading = artworksLoading || categoriesLoading;

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
    setCurrentView(0); // Reset to first view when category changes
  };

  const handleSortChange = (value: string) => {
    setSortOrder(value);
    setCurrentView(0); // Reset to first view when sort changes
  };

  const filteredArtworks = artworks?.filter(artwork => {
    if (selectedCategory === "all") return true;
    return artwork.categoryId.toString() === selectedCategory;
  }) || [];

  // De-duplicate artworks by ID (normalize to string) to avoid repeated tiles
  const uniqueArtworks = Array.from(
    new Map(filteredArtworks.map((a) => [String(a.id), a])).values()
  );

  // Further de-duplicate by normalized image URL to avoid same image with different titles
  // Normalize by stripping domain, leading slashes, query/hash, and common duplicate suffixes and size hints
  const normalizeImageKey = (raw?: string | null, id?: string | number) => {
    const finalize = (filename: string) => {
      const parts = filename.split('.');
      const ext = parts.length > 1 ? `.${parts.pop()}` : '';
      const base = parts.join('.');
      // Remove common duplicate markers and size hints
      const cleanedName = base
        .replace(/(\s*\(\d+\)|[ _-]\d+|[ _-]copy)$/i, '') // (1), _1, -copy
        .replace(/@[23]x$/i, '') // @2x, @3x
        .replace(/[-_](\d{2,4}x\d{2,4})$/i, '') // -1080x1080, _800x600
        .replace(/[-_](scaled|min|compressed|final|edit(?:ed)?)$/i, ''); // -scaled, -min, -compressed, -final, -edit/-edited
      return `${cleanedName}${ext}`.toLowerCase();
    };

    if (!raw) return `noimg-${String(id ?? '')}`;
    try {
      const u = raw.startsWith('http') ? new URL(raw) : new URL(raw, 'https://dummy.base');
      const pathname = u.pathname.replace(/^\/+/, '');
      const filename = pathname.split('/').pop() || pathname;
      return finalize(filename);
    } catch {
      const cleaned = raw.replace(/^\/+/, '').split('?')[0].split('#')[0];
      const filename = cleaned.split('/').pop() || cleaned;
      return finalize(filename);
    }
  };

  // Build a stronger visual key: normalized image + artist id (if available)
  const uniqueByImage = Array.from(
    new Map(
      uniqueArtworks.map((a) => {
        const imgKey = normalizeImageKey(a.imageUrl, a.id);
        const artistKey = String((a as any).artistId ?? a.artist?.id ?? '');
        const visualKey = `${imgKey}::${artistKey}`;
        return [visualKey, a] as const;
      })
    ).values()
  );

  const sortedArtworks = [...uniqueByImage].sort((a, b) => {
    if (sortOrder === "latest") {
      return (b.createdAt ? new Date(b.createdAt).getTime() : 0) - (a.createdAt ? new Date(a.createdAt).getTime() : 0);
    } else if (sortOrder === "price-asc") {
      return a.price - b.price;
    } else if (sortOrder === "price-desc") {
      return b.price - a.price;
    }
    return 0;
  });

  // Get featured artworks first, then fill with other artworks
  const featuredArtworks = sortedArtworks.filter((artwork) => artwork.featured);
  const nonFeaturedArtworks = sortedArtworks.filter((artwork) => !artwork.featured);
  
  // Combine featured and non-featured, ensuring we prioritize featured works
  const combinedArtworks = [...featuredArtworks, ...nonFeaturedArtworks].slice(0, 12);
  
  // Number of artworks per view
  const artworksPerView = 4;
  
  // Split artworks into views
  const totalViews = Math.ceil(combinedArtworks.length / artworksPerView);
  
  // Calculate current artworks to display
  const startIdx = currentView * artworksPerView;
  const currentArtworks = combinedArtworks.slice(startIdx, startIdx + artworksPerView);
  
  // Navigation functions
  const nextView = () => {
    setCurrentView((prev) => (prev + 1) % totalViews);
  };
  
  const prevView = () => {
    setCurrentView((prev) => (prev - 1 + totalViews) % totalViews);
  };

  // Auto-scroll effect
  useEffect(() => {
    const interval = setInterval(() => {
      if (document.hasFocus() && !document.hidden) {
        nextView();
      }
    }, 10000); // Change slides every 10 seconds
    
    return () => clearInterval(interval);
  }, [currentView]);

  if (isLoading) {
    return (
      <section className="py-16 bg-[#F9F9F9]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10">
            <div>
              <h2 className="text-3xl md:text-4xl font-['Playfair_Display'] font-bold text-neutral-900 mb-4">Featured Artworks</h2>
              <p className="text-neutral-600 max-w-2xl">Discover our selection of exceptional pieces from established and emerging African artists</p>
            </div>
            <div className="animate-pulse h-10 w-48 bg-gray-200 rounded"></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 h-80 rounded-md mb-4"></div>
                <div className="h-6 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-5 bg-gray-200 rounded w-1/4"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-[#F9F9F9]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10">
          <div>
            <h2 className="text-3xl md:text-4xl font-['Playfair_Display'] font-bold text-neutral-900 mb-4">
              Featured Artworks
            </h2>
            <p className="text-neutral-600 max-w-2xl">
              Discover our collection of exceptional paintings and mixed media artworks from talented Imbayedu artists
            </p>
          </div>
          {categories && (
            <FilterBar
              categories={categories}
              selectedCategory={selectedCategory}
              sortOrder={sortOrder}
              onCategoryChange={handleCategoryChange}
              onSortChange={handleSortChange}
            />
          )}
        </div>

        {/* Artwork Slider */}
        <div className="relative">
          <div 
            ref={sliderRef}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 transition-all duration-500 ease-in-out"
            style={{ 
              opacity: currentArtworks.length > 0 ? 1 : 0,
              transform: currentArtworks.length > 0 ? 'translateY(0)' : 'translateY(20px)',
              contain: 'content'
            }}
          >
            {currentArtworks.map((artwork) => (
              <ArtworkCard key={artwork.id} artwork={artwork} />
            ))}
          </div>

          {/* Navigation Buttons */}
          {totalViews > 1 && (
            <div className="flex justify-between mt-10">
              <div className="flex items-center space-x-4">
                {/* Dots for slide indicators */}
                <div className="hidden sm:flex space-x-2">
                  {Array.from({ length: totalViews }).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentView(i)}
                      className={`w-2 h-2 rounded-full transition-all ${
                        i === currentView 
                          ? 'bg-[#D3A265] w-4' 
                          : 'bg-gray-300 hover:bg-gray-400'
                      }`}
                      aria-label={`Go to slide ${i + 1}`}
                    />
                  ))}
                </div>
              </div>
              
              <div className="flex space-x-2">
                <button
                  onClick={prevView}
                  className="p-2 rounded-full border border-gray-300 hover:bg-[#D3A265] hover:text-white hover:border-[#D3A265] transition-colors"
                  aria-label="Previous artworks"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  onClick={nextView}
                  className="p-2 rounded-full border border-gray-300 hover:bg-[#D3A265] hover:text-white hover:border-[#D3A265] transition-colors"
                  aria-label="Next artworks"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="mt-12 text-center">
          <Link 
            href="/artworks" 
            className="inline-block bg-[#D3A265] text-white hover:bg-opacity-90 font-medium px-8 py-3 rounded-sm transition duration-300"
          >
            View All Artworks
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedArtworks;
