import { useQuery } from "@tanstack/react-query";
import { Collection } from "../../../../shared/schema";
import { Link } from "wouter";
import { ArrowRight } from "lucide-react";

const FeaturedCollections = () => {
  const { data: collections, isLoading, error } = useQuery<Collection[]>({
    queryKey: ['/api/collections/featured'],
  });

  if (isLoading) {
    return (
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-['Playfair_Display'] font-bold text-neutral-900 mb-4">Our Collections</h2>
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

  // Update collection images to use your artwork
  const collectionImages = [
    "/img/artwork/WhatsApp Image 2025-05-15 at 09.30.01.jpeg",
    "/img/artwork/WhatsApp Image 2025-05-15 at 09.30.02 (2).jpeg",
    "/img/artwork/WhatsApp Image 2025-05-15 at 09.30.08 (2).jpeg"
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center mb-12">
          <div className="mb-6 md:mb-0 md:max-w-2xl">
            <h2 className="text-3xl md:text-4xl font-['Playfair_Display'] font-bold text-neutral-900 mb-4">Our Collections</h2>
            <p className="text-neutral-600">Experience our carefully curated collections showcasing the finest contemporary African art from Imbayedu artists</p>
          </div>
          <Link 
            href="/artworks" 
            className="flex items-center text-[#D3A265] hover:text-neutral-900 transition-colors"
          >
            <span className="mr-2 font-medium">View All Collections</span>
            <ArrowRight size={18} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {collections.map((collection, index) => (
            <Link key={collection.id} href={`/artworks?collection=${collection.id}`}>
              <div className="group relative overflow-hidden rounded-md shadow-md transition duration-300 hover:shadow-xl h-96">
                <img 
                  src={collectionImages[index] || collection.imageUrl} 
                  alt={collection.name} 
                  className="w-full h-full object-cover transition duration-700 group-hover:scale-110"
                />
                
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-300"></div>
                
                {/* Content */}
                <div className="absolute bottom-0 left-0 p-8 w-full transform translate-y-2 group-hover:translate-y-0 transition duration-300">
                  <div className="flex flex-col items-start">
                    <h3 className="text-2xl font-['Playfair_Display'] font-semibold text-white mb-2 group-hover:text-[#D3A265] transition-colors">{collection.name}</h3>
                    <p className="text-white text-sm mb-6 opacity-90 max-w-xs">{collection.description}</p>
                    <span 
                      className="inline-flex items-center text-white text-sm font-medium group-hover:text-[#D3A265] transition-colors"
                    >
                      <span className="mr-2">Explore Collection</span>
                      <ArrowRight size={16} className="transform group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedCollections;
