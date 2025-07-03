import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Button } from "../components/ui/button";
import { Link } from "wouter";
import { ShoppingCart, Heart, Filter, Search } from "lucide-react";

const ImageLoader = ({ src, alt, aspectRatio = "square", className = "" }) => {
  const [isLoading, setIsLoading] = useState(true);

  const imageAspectRatios = {
    square: "1/1",
    portrait: "3/4",
    landscape: "4/3",
    wide: "16/9"
  };

  const paddingBottom = imageAspectRatios[aspectRatio] || imageAspectRatios["square"];

  return (
    <div className="relative w-full overflow-hidden">
      <div style={{ paddingBottom: `calc(100% / (${paddingBottom}))` }}></div>
      {isLoading && (
        <div className="absolute inset-0 bg-neutral-200 animate-pulse"></div>
      )}
      <img
        src={src}
        alt={alt}
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
          isLoading ? "opacity-0" : "opacity-100"
        } ${className}`}
        onLoad={() => setIsLoading(false)}
      />
    </div>
  );
};

const FurnitureCatalog = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [priceRange, setPriceRange] = useState("all");

  const categories = [
    { id: "all", name: "All Categories" },
    { id: "seating", name: "Seating" },
    { id: "tables", name: "Tables" },
    { id: "storage", name: "Storage" },
    { id: "lighting", name: "Lighting" },
    { id: "bedroom", name: "Bedroom" },
    { id: "outdoor", name: "Outdoor" }
  ];

  const furnitureItems = [
    {
      id: 1,
      name: "Modern Leather Armchair",
      category: "seating",
      price: 1250,
      description: "Handcrafted leather armchair with oak frame",
      imageUrl: "/img/artwork/WhatsApp Image 2025-05-22 at 11.04.44.jpeg",
      dimensions: "80cm W x 85cm D x 75cm H",
      material: "Premium leather, oak wood",
      inStock: true,
      featured: true
    },
    {
      id: 2,
      name: "Artisan Dining Table",
      category: "tables",
      price: 2100,
      description: "Solid wood dining table with artistic metal legs",
      imageUrl: "/img/artwork/WhatsApp Image 2025-05-22 at 11.04.45.jpeg",
      dimensions: "200cm L x 100cm W x 75cm H",
      material: "Solid teak, steel",
      inStock: true,
      featured: true
    },
    {
      id: 3,
      name: "Contemporary Sofa Set",
      category: "seating",
      price: 3500,
      description: "Modular sofa set with African-inspired patterns",
      imageUrl: "/img/artwork/WhatsApp Image 2025-05-22 at 11.04.46.jpeg",
      dimensions: "250cm L x 120cm D x 80cm H",
      material: "Premium fabric, hardwood frame",
      inStock: true,
      featured: true
    },
    {
      id: 4,
      name: "Designer Coffee Table",
      category: "tables",
      price: 850,
      description: "Glass-top coffee table with sculptural base",
      imageUrl: "/img/artwork/WhatsApp Image 2025-05-22 at 11.04.47 (1).jpeg",
      dimensions: "120cm L x 70cm W x 45cm H",
      material: "Tempered glass, metal",
      inStock: true,
      featured: false
    },
    {
      id: 5,
      name: "Executive Office Chair",
      category: "seating",
      price: 950,
      description: "Ergonomic office chair with premium materials",
      imageUrl: "/img/artwork/WhatsApp Image 2025-05-22 at 11.04.48.jpeg",
      dimensions: "65cm W x 70cm D x 110-120cm H",
      material: "Leather, aluminum",
      inStock: true,
      featured: false
    },
    {
      id: 6,
      name: "Custom Storage Unit",
      category: "storage",
      price: 1750,
      description: "Modular storage system with artistic elements",
      imageUrl: "/img/artwork/WhatsApp Image 2025-05-22 at 11.04.43.jpeg",
      dimensions: "180cm W x 45cm D x 200cm H",
      material: "Oak veneer, steel accents",
      inStock: true,
      featured: false
    },
    {
      id: 7,
      name: "Statement Floor Lamp",
      category: "lighting",
      price: 680,
      description: "Sculptural floor lamp with African motifs",
      imageUrl: "/img/artwork/WhatsApp Image 2025-06-10 at 07.59.31.jpg",
      dimensions: "40cm W x 40cm D x 165cm H",
      material: "Brass, fabric shade",
      inStock: true,
      featured: false
    },
    {
      id: 8,
      name: "Luxury Bed Frame",
      category: "bedroom",
      price: 2800,
      description: "King-size bed with upholstered headboard",
      imageUrl: "/img/artwork/WhatsApp Image 2025-06-10 at 07.59.32.jpg",
      dimensions: "200cm L x 180cm W x 120cm H",
      material: "Solid wood, premium upholstery",
      inStock: true,
      featured: true
    },
    {
      id: 9,
      name: "Outdoor Lounge Set",
      category: "outdoor",
      price: 1900,
      description: "Weather-resistant outdoor furniture set",
      imageUrl: "/img/artwork/WhatsApp Image 2025-06-10 at 07.59.33.jpg",
      dimensions: "Various sizes",
      material: "Teak, aluminum",
      inStock: true,
      featured: false
    }
  ];

  const filteredItems = furnitureItems.filter(item => {
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPrice = priceRange === "all" || 
      (priceRange === "under1000" && item.price < 1000) ||
      (priceRange === "1000-2000" && item.price >= 1000 && item.price <= 2000) ||
      (priceRange === "over2000" && item.price > 2000);

    return matchesCategory && matchesSearch && matchesPrice;
  });

  return (
    <>
      <Helmet>
        <title>Furniture Catalog - Imbayedu Art Collective</title>
        <meta name="description" content="Discover our curated collection of luxury furniture pieces designed to complement your interior design vision" />
      </Helmet>

      {/* Hero Section */}
      <div className="relative">
        <div className="absolute inset-0 bg-black/50 z-10"></div>
        <div className="relative h-[70vh] bg-cover bg-center" style={{ backgroundImage: `url('/img/artwork/WhatsApp Image 2025-05-22 at 11.04.44 (1).jpeg')` }}>
          <div className="absolute inset-0 flex items-center justify-center z-20">
            <div className="text-center text-white px-4">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-['Playfair_Display'] font-bold mb-6">
                Furniture Catalog
              </h1>
              <p className="text-lg sm:text-xl md:text-2xl max-w-2xl mx-auto font-light">
                Curated pieces that blend artistry with functionality
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        {/* Introduction */}
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-['Playfair_Display'] font-bold mb-8">
            Exceptional Furniture Collection
          </h2>
          <p className="text-lg text-neutral-600 leading-relaxed">
            Each piece in our furniture catalog is carefully selected or custom-designed to complement our interior design philosophy. 
            From statement seating to functional storage solutions, every item reflects our commitment to quality, craftsmanship, and artistic expression.
          </p>
        </div>

        {/* Filters */}
        <div className="bg-neutral-50 p-6 rounded-xl mb-12">
          <div className="flex flex-col lg:flex-row gap-6 items-center">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" size={20} />
              <input
                type="text"
                placeholder="Search furniture..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D3A265]"
              />
            </div>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D3A265]"
            >
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>

            {/* Price Filter */}
            <select
              value={priceRange}
              onChange={(e) => setPriceRange(e.target.value)}
              className="px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D3A265]"
            >
              <option value="all">All Prices</option>
              <option value="under1000">Under $1,000</option>
              <option value="1000-2000">$1,000 - $2,000</option>
              <option value="over2000">Over $2,000</option>
            </select>
          </div>
        </div>

        {/* Featured Items */}
        <div className="mb-16">
          <h3 className="text-2xl md:text-3xl font-['Playfair_Display'] font-bold mb-8 text-center">
            Featured Pieces
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {furnitureItems.filter(item => item.featured).map((item) => (
              <Link key={item.id} href={`/furniture/${item.id}`} className="group bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <div className="aspect-[4/3] overflow-hidden">
                  <ImageLoader
                    src={item.imageUrl}
                    alt={item.name}
                    aspectRatio="landscape"
                    className="transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="text-xl font-['Playfair_Display'] font-semibold">{item.name}</h4>
                    <span className="text-lg font-bold text-[#D3A265]">${item.price.toLocaleString()}</span>
                  </div>
                  <p className="text-neutral-600 mb-3">{item.description}</p>
                  <div className="text-sm text-neutral-500 mb-4">
                    <p><strong>Dimensions:</strong> {item.dimensions}</p>
                    <p><strong>Material:</strong> {item.material}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button className="flex-1 bg-[#D3A265] hover:bg-[#BA8F58] text-white">
                      <ShoppingCart size={16} className="mr-2" />
                      Add to Cart
                    </Button>
                    <Button variant="outline" size="icon" className="border-[#D3A265] text-[#D3A265] hover:bg-[#D3A265] hover:text-white">
                      <Heart size={16} />
                    </Button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* All Items Grid */}
        <div className="mb-16">
          <h3 className="text-2xl md:text-3xl font-['Playfair_Display'] font-bold mb-8 text-center">
            Complete Collection
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredItems.map((item) => (
              <div key={item.id} className="group bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <div className="aspect-square overflow-hidden">
                  <ImageLoader
                    src={item.imageUrl}
                    alt={item.name}
                    aspectRatio="square"
                    className="transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="text-lg font-semibold">{item.name}</h4>
                    <span className="text-lg font-bold text-[#D3A265]">${item.price.toLocaleString()}</span>
                  </div>
                  <p className="text-neutral-600 text-sm mb-3">{item.description}</p>
                  <div className="flex gap-2">
                    <Button size="sm" className="flex-1 bg-[#D3A265] hover:bg-[#BA8F58] text-white text-xs">
                      <ShoppingCart size={14} className="mr-1" />
                      Add to Cart
                    </Button>
                    <Button variant="outline" size="sm" className="border-[#D3A265] text-[#D3A265] hover:bg-[#D3A265] hover:text-white">
                      <Heart size={14} />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Custom Design CTA */}
        <div className="text-center bg-[#8B5A2B] text-white p-16 rounded-xl">
          <h2 className="text-3xl md:text-4xl font-['Playfair_Display'] font-bold mb-6">
            Need Something Unique?
          </h2>
          <p className="text-lg max-w-2xl mx-auto mb-8 text-neutral-300">
            We specialize in custom furniture design that perfectly complements your space and style. 
            Let our team create something truly exceptional for your home or office.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
              <Button className="bg-[#D3A265] hover:bg-[#BA8F58] text-white px-8 py-3 text-lg">
                Request Custom Design
              </Button>
            </Link>
            <Link href="/interior-design">
              <Button variant="outline" className="border-white text-white hover:bg-white hover:text-[#8B5A2B] px-8 py-3 text-lg">
                View Interior Design
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default FurnitureCatalog;