import { useQuery } from "@tanstack/react-query";
import { Collection } from "@shared/schema";
import { Link } from "wouter";

const FeaturedCollections = () => {
  const { data: collections, isLoading, error } = useQuery<Collection[]>({
    queryKey: ['/api/collections/featured'],
  });

  if (isLoading) {
    return (
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-['Playfair_Display'] font-bold text-neutral-900 mb-4">Featured Collections</h2>
            <p className="text-neutral-600 max-w-3xl mx-auto">Explore our carefully curated collections showcasing the finest contemporary African art</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 h-80 rounded-md mb-4"></div>
                <div className="h-6 bg-gray-200 rounded mb-2 w-1/2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error || !collections) {
    return null;
  }

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-['Playfair_Display'] font-bold text-neutral-900 mb-4">Featured Collections</h2>
          <p className="text-neutral-600 max-w-3xl mx-auto">Explore our carefully curated collections showcasing the finest contemporary African art</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {collections.map((collection) => (
            <div key={collection.id} className="group relative overflow-hidden rounded-md shadow-md">
              <img 
                src={collection.imageUrl} 
                alt={collection.name} 
                className="w-full h-80 object-cover transition duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-70"></div>
              <div className="absolute bottom-0 left-0 p-6">
                <h3 className="text-xl font-['Playfair_Display'] font-semibold text-white mb-2">{collection.name}</h3>
                <p className="text-white text-sm mb-4">{collection.description}</p>
                <Link 
                  href={`/artworks?collection=${collection.id}`} 
                  className="text-white text-sm font-medium border-b border-white pb-1 hover:border-[#D3A265] hover:text-[#D3A265] transition duration-300"
                >
                  View Collection
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedCollections;
