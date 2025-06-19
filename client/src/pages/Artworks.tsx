import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Helmet } from "react-helmet";
import { ArtworkWithDetails, Category } from "../../../shared/schema";
import { ArtworkCard } from "../components/ui/artwork-card";
import { FilterBar } from "../components/ui/filter-bar";

const Artworks = () => {
  const [location] = useLocation();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortOrder, setSortOrder] = useState("latest");

  // Extract query params
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const categoryParam = params.get("category");
    const collectionParam = params.get("collection");
    
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    } else if (collectionParam) {
      // We'll handle collection filtering differently
    }
  }, [location]);

  const fetchArtworks = async (): Promise<ArtworkWithDetails[]> => {
    const response = await fetch('/api/artworks/details');
    if (!response.ok) throw new Error('Network response was not ok');
    return response.json();
  };

  const { data: artworks, isLoading: artworksLoading } = useQuery<ArtworkWithDetails[], Error, ArtworkWithDetails[], [string]>(
    {
      queryKey: ['/api/artworks/details'],
      queryFn: fetchArtworks
    }
  );

  const { data: categories, isLoading: categoriesLoading } = useQuery<Category[]>({
    queryKey: ['/api/categories'],
  });

  const isLoading = artworksLoading || categoriesLoading;

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);

    const params = new URLSearchParams(window.location.search);
  params.set('category', value);
  window.history.pushState({}, '', `${window.location.pathname}?${params.toString()}`);
  };

  const handleSortChange = (value: string) => {
    setSortOrder(value);
  };

  const filteredArtworks = (artworks as ArtworkWithDetails[] | undefined)?.filter(artwork => {
    if (selectedCategory === "all") return true;
    return artwork.categoryId.toString() === selectedCategory;
  }) || [];

  const sortedArtworks = [...filteredArtworks].sort((a, b) => {
    if (sortOrder === "latest") {
      return (b.createdAt ? new Date(b.createdAt).getTime() : 0) - (a.createdAt ? new Date(a.createdAt).getTime() : 0);
    } else if (sortOrder === "price-asc") {
      return a.price - b.price;
    } else if (sortOrder === "price-desc") {
      return b.price - a.price;
    }
    return 0;
  });

  return (
    <>
      <Helmet>
        <title>Shop Artworks | Imbayedu Art Collective</title>
        <meta name="description" content="Browse our collection of unique African artworks including paintings, sculptures, photography, and mixed media pieces from talented artists." />
      </Helmet>
      
      <div className="pt-24 md:pt-32">
        <div className="bg-neutral-100 py-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl md:text-4xl font-['Playfair_Display'] font-bold text-neutral-900 text-center">
              Artworks
            </h1>
          </div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10">
            <p className="text-neutral-600 mb-4 md:mb-0">
              Showing {sortedArtworks.length} {sortedArtworks.length === 1 ? 'artwork' : 'artworks'}
            </p>
            
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

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-200 h-80 rounded-md mb-4"></div>
                  <div className="h-6 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-5 bg-gray-200 rounded w-1/4"></div>
                </div>
              ))}
            </div>
          ) : sortedArtworks.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
              {sortedArtworks.map((artwork) => (
                <ArtworkCard key={artwork.id} artwork={artwork} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-xl font-medium text-neutral-900 mb-4">No artworks found</h3>
              <p className="text-neutral-600">Try changing your filters or check back later for new additions.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Artworks;
