import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { ArtworkWithDetails, Category } from "@shared/schema";
import { ArtworkCard } from "@/components/ui/artwork-card";
import { FilterBar } from "@/components/ui/filter-bar";

const FeaturedArtworks = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortOrder, setSortOrder] = useState("latest");

  const { data: artworks, isLoading: artworksLoading } = useQuery<ArtworkWithDetails[]>({
    queryKey: ['/api/artworks/details'],
  });

  const { data: categories, isLoading: categoriesLoading } = useQuery<Category[]>({
    queryKey: ['/api/categories'],
  });

  const isLoading = artworksLoading || categoriesLoading;

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
  };

  const handleSortChange = (value: string) => {
    setSortOrder(value);
  };

  const filteredArtworks = artworks?.filter(artwork => {
    if (selectedCategory === "all") return true;
    return artwork.categoryId.toString() === selectedCategory;
  }) || [];

  const sortedArtworks = [...filteredArtworks].sort((a, b) => {
    if (sortOrder === "latest") {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    } else if (sortOrder === "price-asc") {
      return a.price - b.price;
    } else if (sortOrder === "price-desc") {
      return b.price - a.price;
    }
    return 0;
  });

  const featuredArtworks = sortedArtworks.filter(artwork => artwork.featured).slice(0, 8);

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
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-[#F9F9F9]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10">
          <div>
            <h2 className="text-3xl md:text-4xl font-['Playfair_Display'] font-bold text-neutral-900 mb-4">Featured Artworks</h2>
            <p className="text-neutral-600 max-w-2xl">Discover our selection of exceptional pieces from established and emerging African artists</p>
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
          {featuredArtworks.map((artwork) => (
            <ArtworkCard key={artwork.id} artwork={artwork} />
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link 
            href="/artworks" 
            className="inline-block border border-neutral-900 text-neutral-900 hover:bg-neutral-900 hover:text-white font-medium px-8 py-3 rounded-sm transition duration-300"
          >
            View All Artworks
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedArtworks;
