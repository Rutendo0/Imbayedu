
import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Button } from "../components/ui/button";
import { FurnitureCard3D } from "../components/ui/furniture-card-3d";
import { Link } from "wouter";
import { ShoppingCart, Heart, Filter, Search, ArrowLeft } from "lucide-react";

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
    <div className="relative w-full overflow-hidden rounded-lg">
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
    { id: "bedroom", name: "Bedroom" },
    { id: "outdoor", name: "Outdoor" }
  ];

  const furnitureItems = [
    {
      id: 1,
      name: "Modern Drawers",
      category: "seating",
      price: 1250,
      description: "Handcrafted chest of drawer with oak frame. This contemporary piece combines traditional craftsmanship with modern design sensibilities.",
      images: [
        "/img/furniture/WhatsApp Image 2025-07-03 at 08.29.25 (2).jpg"
      ],
      dimensions: "80cm W x 85cm D x 75cm H",
      material: " oak wood",
      colors: ["Brown", "Tan"],
      inStock: true,
      featured: false
    },
    {
      id: 2,
      name: "Modern Chest Of Drawers",
      category: "storage",
      price: 1450,
      description: "Four-drawer chest with contrasting wood and black panels",
      images: [
        "/img/furniture/WhatsApp Image 2025-07-03 at 08.29.21.jpg",
        "/img/furniture/WhatsApp Image 2025-07-03 at 08.29.23.jpg",
        "/img/furniture/WhatsApp Image 2025-07-03 at 08.29.20.jpg",
        "/img/furniture/WhatsApp Image 2025-07-03 at 08.29.25.jpg"
      ],
      dimensions: "90cm W x 45cm D x 120cm H",
      material: "Walnut wood, black oak veneer, brass handles",
      inStock: true,
      featured: true
    },
    {
      id: 3,
      name: "Walnut Wood Cabinet",
      category: "storage",
      price: 1680,
      description: "Elegant walnut cabinet with brass legs and clean lines",
      images: [
      "/img/furniture/WhatsApp Image 2025-07-03 at 08.29.56.jpg",
        "/img/furniture/WhatsApp Image 2025-07-03 at 08.29.56 (2).jpg",
        "/img/furniture/WhatsApp Image 2025-07-03 at 08.29.55 (2).jpg",
        "/img/furniture/WhatsApp Image 2025-07-03 at 08.29.55 (4).jpg",
        "/img/furniture/WhatsApp Image 2025-07-03 at 08.29.55 (3).jpg"
      ],
      dimensions: "80cm W x 45cm D x 110cm H",
      material: "Walnut wood",
      inStock: true,
      featured: true
    },
    {
      id: 4,
      name: "Fluted Wood Credenza",
      category: "storage",
      price: 2450,
      description: "Sophisticated credenza with signature fluted wood design",
      images: [
        "/img/furniture/WhatsApp Image 2025-07-03 at 08.29.52 (2).jpg",
        "/img/furniture/WhatsApp Image 2025-07-03 at 08.29.52 (3).jpg",
        "/img/furniture/WhatsApp Image 2025-07-03 at 08.29.52.jpg",
        "/img/furniture/WhatsApp Image 2025-07-03 at 08.29.51.jpg",
      ],
      dimensions: "180cm W x 45cm D x 75cm H",
      material: "Fluted walnut wood, brass hardware",
      inStock: true,
      featured: true
    },
    {
      id: 5,
      name: "Artisan Wood Table",
      category: "tables",
      price: 750,
      description: "Sculptural side table showcasing natural wood grain",
      images: [
       "/img/furniture/WhatsApp Image 2025-07-03 at 08.29.58 (3).jpg",
        "/img/furniture/WhatsApp Image 2025-07-03 at 08.29.57 (2).jpg",
        "/img/furniture/WhatsApp Image 2025-07-03 at 08.29.57.jpg"
      ],
      dimensions: "45cm W x 45cm D x 55cm H",
      material: "Solid oak, natural finish",
      inStock: true,
      featured: false
    },
    {
      id: 6,
      name: "Marble Front Nightstand",
      category: "bedroom",
      price: 1120,
      description: "Elegant nightstand with marble drawer fronts and wood frame",
      images: [
       "/img/furniture/WhatsApp Image 2025-07-03 at 08.29.37.jpg",
        "/img/furniture/WhatsApp Image 2025-07-03 at 08.29.38.jpg",
        "/img/furniture/WhatsApp Image 2025-07-03 at 08.29.39.jpg",
        "/img/furniture/WhatsApp Image 2025-07-03 at 08.29.33.jpg", 
        "/img/furniture/WhatsApp Image 2025-07-03 at 08.29.35.jpg" 
      ],
      dimensions: "50cm W x 40cm D x 60cm H",
      material: "Oak wood, marble veneer, soft-close drawers",
      inStock: true,
      featured: false
    },
    {
      id: 7,
      name: "Luxury Bed Frame",
      category: "bedroom",
      price: 2800,
      description: "King-size bed with upholstered headboard featuring channel tufting",
      images: [
        "/img/furniture/WhatsApp Image 2025-07-03 at 08.29.41 (4).jpg",
        "/img/furniture/WhatsApp Image 2025-07-03 at 08.29.41.jpg",
        "/img/furniture/WhatsApp Image 2025-07-03 at 08.29.41 (3).jpg",
         "/img/furniture/WhatsApp Image 2025-07-03 at 08.29.41 (2).jpg",
          "/img/furniture/WhatsApp Image 2025-07-03 at 08.29.40 (6).jpg",
           "/img/furniture/WhatsApp Image 2025-07-03 at 08.29.40 (5).jpg",
            "/img/furniture/WhatsApp Image 2025-07-03 at 08.29.40 (4).jpg",
             "/img/furniture/WhatsApp Image 2025-07-03 at 08.29.40 (3).jpg",
              "/img/furniture/WhatsApp Image 2025-07-03 at 08.29.40 (2).jpg",
        "/img/furniture/WhatsApp Image 2025-07-03 at 08.29.40.jpg"
      ],
      dimensions: "200cm L x 180cm W x 120cm H",
      material: "Solid wood, premium upholstery",
      colors: ["Beige", "Gray", "Navy"],
      sizes: ["Queen", "King", "Super King"],
      inStock: true,
      featured: true
    },
    {
      id: 8,
      name: "Minimalist Platform Bed",
      category: "bedroom",
      price: 2450,
      description: "Clean-lined platform bed with low profile and modern aesthetic",
      images: [
        "/img/furniture/WhatsApp Image 2025-07-03 at 08.29.42 (2).jpg",
        "/img/furniture/WhatsApp Image 2025-07-03 at 08.29.42 (3).jpg",
        "/img/furniture/WhatsApp Image 2025-07-03 at 08.29.42.jpg"
      ],
      dimensions: "200cm L x 160cm W x 35cm H",
      material: "Premium linen upholstery, solid wood frame",
      inStock: true,
      featured: false
    },
    {
      id: 9,
      name: "Oak Sideboard with Brass Hardware",
      category: "storage",
      price: 3200,
      description: "Elegant oak sideboard featuring beautiful wood grain and brass details",
      images: [
        "/img/furniture/WhatsApp Image 2025-07-03 at 08.29.44.jpg",
        "/img/furniture/WhatsApp Image 2025-07-03 at 08.29.43 (3).jpg",
         "/img/furniture/WhatsApp Image 2025-07-03 at 08.29.43.jpg",
        "/img/furniture/WhatsApp Image 2025-07-03 at 08.29.43 (2).jpg"
      ],
      dimensions: "180cm W x 45cm D x 75cm H",
      material: "Solid oak, brass hardware and legs",
      inStock: true,
      featured: true
    },
    {
      id: 10,
      name: "Forest Green Velvet Bed",
      category: "bedroom",
      price: 3480,
      description: "Luxurious bed with rich forest green velvet upholstery",
      images: [
        "/img/furniture/WhatsApp Image 2025-07-03 at 08.29.45.jpg",
        "/img/furniture/WhatsApp Image 2025-07-03 at 08.29.45 (2).jpg",
         "/img/furniture/WhatsApp Image 2025-07-03 at 08.29.44 (3).jpg",
        "/img/furniture/WhatsApp Image 2025-07-03 at 08.29.44 (2).jpg"
      ],
      dimensions: "200cm L x 160cm W x 120cm H",
      material: "Forest green velvet, solid wood frame, brass feet",
      inStock: true,
      featured: true
    },
    {
      id: 11,
      name: "Fluted Wood Headboard Bed",
      category: "bedroom",
      price: 4200,
      description: "Architectural bed with stunning fluted wood headboard and integrated nightstands",
      images: [
        "/img/furniture/WhatsApp Image 2025-07-03 at 08.29.47.jpg",
        "/img/furniture/WhatsApp Image 2025-07-03 at 08.29.47 (3).jpg",
        "/img/furniture/WhatsApp Image 2025-07-03 at 08.29.47 (2).jpg",
        "/img/furniture/WhatsApp Image 2025-07-03 at 08.29.46 (3).jpg",
        "/img/furniture/WhatsApp Image 2025-07-03 at 08.29.46 (2).jpg",
        "/img/furniture/WhatsApp Image 2025-07-03 at 08.29.46.jpg"
      ],
      dimensions: "240cm W x 200cm D x 130cm H",
      material: "Fluted oak, integrated storage, brass accents",
      inStock: true,
      featured: true
    },
    {
      id: 12,
      name: "Contemporary Sectional Sofa",
      category: "seating",
      price: 4200,
      description: "Modular sectional with clean lines and neutral upholstery",
      images: [
        "/img/furniture/WhatsApp Image 2025-07-03 at 08.29.48 (2).jpg",
        "/img/furniture/WhatsApp Image 2025-07-03 at 08.29.48.jpg",
        "/img/furniture/WhatsApp Image 2025-07-03 at 08.29.48 (3).jpg",
         "/img/furniture/WhatsApp Image 2025-07-03 at 08.29.49 (3).jpg",
          "/img/furniture/WhatsApp Image 2025-07-03 at 08.29.49 (2).jpg",
           "/img/furniture/WhatsApp Image 2025-07-03 at 08.29.49.jpg",
           "/img/furniture/WhatsApp Image 2025-07-03 at 08.29.50 (3).jpg",
            "/img/furniture/WhatsApp Image 2025-07-03 at 08.29.50.jpg"
      ],
      dimensions: "300cm L x 200cm W x 80cm H",
      material: "Premium linen blend, hardwood frame, dark wood legs",
      inStock: true,
      featured: false
    },
    {
      id: 13,
      name: "Modular  Sofa ",
      category: "seating",
      price: 3850,
      description: "Elegant modular sectional with cream upholstery and wooden base trim",
      images: [
        "/img/furniture/WhatsApp Image 2025-07-03 at 08.29.55.jpg",
        "/img/furniture/WhatsApp Image 2025-07-03 at 08.29.54.jpg",
        "/img/furniture/WhatsApp Image 2025-07-03 at 08.29.54 (3).jpg",
        "/img/furniture/WhatsApp Image 2025-07-03 at 08.29.54 (2).jpg",
        "/img/furniture/WhatsApp Image 2025-07-03 at 08.29.54 (4).jpg"
      ],
      dimensions: "280cm L x 180cm W x 80cm H",
      material: "Cream linen blend, solid wood base",
      inStock: true,
      featured: true
    },
    {
      id: 14,
      name: "Contemporary Charcoal Sectional",
      category: "seating",
      price: 4450,
      description: "Modern sectional in rich charcoal with plush cushioning",
      images: [
        "/img/furniture/WhatsApp Image 2025-07-03 at 08.29.50 (2).jpg",
        "/img/furniture/WhatsApp Image 2025-07-03 at 08.29.51 (2).jpg",
        "/img/furniture/WhatsApp Image 2025-07-03 at 08.29.51 (3).jpg"
      ],
      dimensions: "310cm L x 190cm W x 85cm H",
      material: "Charcoal performance fabric, solid frame",
      inStock: true,
      featured: true
    },
    {
      id: 15,
      name: "Heritage Wood Dresser",
      category: "storage",
      price: 2850,
      description: "Elegant four-drawer dresser showcasing beautiful wood grain patterns",
      images: [
        "/img/furniture/WhatsApp Image 2025-07-03 at 08.29.32.jpg",
        "/img/furniture/WhatsApp Image 2025-07-03 at 08.29.28.jpg",
        "/img/furniture/WhatsApp Image 2025-07-03 at 08.29.26.jpg"
      ],
      dimensions: "165cm W x 52cm D x 88cm H",
      material: "Heritage wood finish, antique brass hardware",
      inStock: true,
      featured: true
    },
    {
      id: 16,
      name: "Upholstered Panel Bed",
      category: "bedroom",
      price: 3280,
      description: "Sophisticated bed with upholstered panels and brass accent details",
      images: [
        "/img/furniture/WhatsApp Image 2025-07-03 at 08.29.53 (4).jpg",
        "/img/furniture/WhatsApp Image 2025-07-03 at 08.29.53 (2).jpg",
         "/img/furniture/WhatsApp Image 2025-07-03 at 08.29.53 (3).jpg",
        "/img/furniture/WhatsApp Image 2025-07-03 at 08.29.53.jpg"
      ],
      dimensions: "210cm L x 180cm W x 120cm H",
      material: "Upholstered panels, solid wood frame, brass details",
      colors: ["Neutral", "Light Gray", "Cream"],
      sizes: ["Queen", "King"],
      inStock: true,
      featured: true
    },
    {
      id: 17,
      name: "Forest Green Velvet Armchair",
      category: "seating",
      price: 2850,
      description: "Luxurious armchair in rich forest green velvet with brass legs",
      images: [
        "/img/furniture/WhatsApp Image 2025-07-03 at 08.29.59.jpg",
        "/img/furniture/WhatsApp Image 2025-07-03 at 08.30.00.jpg",
        "/img/furniture/WhatsApp Image 2025-07-03 at 08.30.00 (3).jpg",
        "/img/furniture/WhatsApp Image 2025-07-03 at 08.30.00 (2).jpg"
      ],
      dimensions: "220cm L x 90cm W x 80cm H",
      material: "Premium linen blend, walnut wood base",
      inStock: true,
      featured: true
    },
    {
      id: 18,
      name: " Walnut Cabinet",
      category: "storage",
      price: 3480,
      description: "Elegant cabinet with curved edges and rich walnut finish on brass legs",
      images: [
        "/img/furniture/WhatsApp Image 2025-07-03 at 08.29.59 (3).jpg",
        "/img/furniture/WhatsApp Image 2025-07-03 at 08.29.59 (2).jpg",
        "/img/furniture/WhatsApp Image 2025-07-03 at 08.29.58 (2).jpg",
        "/img/furniture/WhatsApp Image 2025-07-03 at 08.29.58.jpg"
      ],
      dimensions: "65cm W x 45cm D x 140cm H",
      material: "Walnut wood, brass legs, curved construction",
      inStock: true,
      featured: true
    },
    {
      id: 19,
      name: "Mid-Century Modern Sofa",
      category: "seating",
      price: 3250,
      description: "Clean-lined sofa with neutral upholstery and walnut wood frame",
      images: [
        "/img/furniture/WhatsApp Image 2025-07-03 at 08.30.01 (2).jpg",
        "/img/furniture/WhatsApp Image 2025-07-03 at 08.30.01 (3).jpg",
        "/img/furniture/WhatsApp Image 2025-07-03 at 08.30.02 (2).jpg"
      ],
      dimensions: "220cm L x 90cm W x 80cm H",
      material: "Neutral linen blend, walnut wood frame",
      inStock: true,
      featured: true
    },
    
    {
      id: 20,
      name: "Armchair",
      category: "seating",
      price: 1850,
      description: "Luxurious armchair with brass legs",
      images: [
        "/img/furniture/WhatsApp Image 2025-07-03 at 08.30.05 (3).jpg"
      ],
      dimensions: "80cm W x 85cm D x 75cm H",
      material: "Forest green velvet, brass legs, premium construction",
      inStock: true,
      featured: true
    },
    {
      id: 21,
      name: "Fluted Oak Armchair",
      category: "seating",
      price: 2150,
      description: "Architectural armchair featuring fluted oak construction with neutral cushions",
      images: [
        "/img/furniture/WhatsApp Image 2025-07-03 at 08.30.00.jpg",
        "/img/furniture/WhatsApp Image 2025-07-03 at 08.30.01.jpg",
        "/img/furniture/WhatsApp Image 2025-07-03 at 08.30.01 (2).jpg"
      ],
      dimensions: "85cm W x 90cm D x 80cm H",
      material: "Fluted oak frame, neutral upholstery",
      inStock: true,
      featured: true
    },
    {
      id: 22,
      name: "Modern Dining Chair Set",
      category: "seating",
      price: 1200,
      description: "Contemporary dining chairs with clean lines and premium upholstery",
      images: [
        "/img/furniture/WhatsApp Image 2025-07-03 at 08.30.03 (2).jpg",
        "/img/furniture/WhatsApp Image 2025-07-03 at 08.30.03 (3).jpg",
        "/img/furniture/WhatsApp Image 2025-07-03 at 08.30.02.jpg",
         "/img/furniture/WhatsApp Image 2025-07-03 at 08.30.02 (3).jpg",
      ],
      dimensions: "45cm W x 50cm D x 85cm H",
      material: "Premium upholstery, solid wood frame",
      inStock: true,
      featured: false
    },
    {
      id: 23,
      name: "Executive Dining Table",
      category: "tables",
      price: 3800,
      description: "Sophisticated dining table with rich wood finish and brass details",
      images: [
        "/img/furniture/WhatsApp Image 2025-07-03 at 08.30.01.jpg"
      ],
      dimensions: "240cm L x 100cm W x 75cm H",
      material: "Premium wood, brass accents",
      inStock: true,
      featured: true
    },
    {
      id: 24,
      name: "Contemporary  Stools",
      category: "seating",
      price: 850,
      description: "Modern  stools with adjustable height and swivel function",
      images: [
        "/img/furniture/WhatsApp Image 2025-07-03 at 08.30.04.jpg",
        "/img/furniture/WhatsApp Image 2025-07-03 at 08.30.04 (3).jpg",
        "/img/furniture/WhatsApp Image 2025-07-03 at 08.30.05.jpg",
        "/img/furniture/WhatsApp Image 2025-07-03 at 08.30.05 (2).jpg",
      ],
      dimensions: "40cm W x 40cm D x 85-110cm H",
      material: "Steel frame, premium upholstery",
      inStock: true,
      featured: false
    },
    {
      id: 25,
      name: "Outdoor Patio Set",
      category: "outdoor",
      price: 2400,
      description: "Weather-resistant patio furniture set with cushions",
      images: [
        "/img/furniture/WhatsApp Image 2025-07-03 at 08.30.03.jpg",
         "/img/furniture/WhatsApp Image 2025-07-03 at 08.30.04 (2).jpg",
      ],
      dimensions: "Various sizes",
      material: "Weather-resistant materials",
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
      (priceRange === "2000-4000" && item.price >= 2000 && item.price <= 4000) ||
      (priceRange === "over4000" && item.price > 4000);

    return matchesCategory && matchesSearch && matchesPrice;
  });

  const featuredItems = furnitureItems.filter(item => item.featured);

  return (
    <>
      <Helmet>
        <title>Furniture Catalog - Imbayedu Art Collective</title>
        <meta name="description" content="Discover our curated collection of luxury furniture pieces designed to complement your interior design vision" />
      </Helmet>

      {/* Breadcrumb */}
      <div className="pt-24 pb-8">
        <div className="container mx-auto px-4">
          <Link href="/interior-design" className="inline-flex items-center text-neutral-600 hover:text-[#D3A265] transition-colors">
            <ArrowLeft size={16} className="mr-2" />
            Back to Interior Design
          </Link>
        </div>
      </div>

      {/* Hero Section with Background Image */}
      <div className="relative">
        <div className="absolute inset-0 bg-black/40 z-10"></div>
        <div className="relative h-[60vh] bg-cover bg-center" style={{ backgroundImage: `url('/img/furniture/WhatsApp Image 2025-07-03 at 08.29.50 (3).jpg')` }}>
          <div className="absolute inset-0 flex items-center justify-center z-20">
            <div className="text-center text-white px-4">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-['Playfair_Display'] font-bold mb-6">
                Furniture Collection
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
                className="w-full pl-10 pr-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D3A265] focus:border-transparent"
              />
            </div>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D3A265] focus:border-transparent min-w-[180px]"
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
              className="px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D3A265] focus:border-transparent min-w-[180px]"
            >
              <option value="all">All Prices</option>
              <option value="under1000">Under $1,000</option>
              <option value="1000-2000">$1,000 - $2,000</option>
              <option value="2000-4000">$2,000 - $4,000</option>
              <option value="over4000">Over $4,000</option>
            </select>
          </div>
        </div>

        {/* Featured Items */}
        <div className="mb-16">
          <h3 className="text-2xl md:text-3xl font-['Playfair_Display'] font-bold mb-8 text-center">
            Featured Pieces
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredItems.map((item) => (
              <Link key={item.id} href={`/furniture/${item.id}`} className="group bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="aspect-[4/3] overflow-hidden">
                  <ImageLoader
                    src={item.images[0]}
                    alt={item.name}
                    aspectRatio="landscape"
                    className="transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="text-xl font-['Playfair_Display'] font-semibold line-clamp-2">{item.name}</h4>
                    <span className="text-lg font-bold text-[#D3A265] ml-2">${item.price.toLocaleString()}</span>
                  </div>
                  <p className="text-neutral-600 mb-4 line-clamp-2">{item.description}</p>
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
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-2xl md:text-3xl font-['Playfair_Display'] font-bold">
              Complete Collection
            </h3>
            <p className="text-neutral-600">
              {filteredItems.length} {filteredItems.length === 1 ? 'item' : 'items'} found
            </p>
          </div>

          {filteredItems.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-neutral-500 text-lg">No furniture items match your current filters.</p>
              <Button 
                onClick={() => {
                  setSelectedCategory("all");
                  setSearchTerm("");
                  setPriceRange("all");
                }}
                variant="outline"
                className="mt-4 border-[#D3A265] text-[#D3A265] hover:bg-[#D3A265] hover:text-white"
              >
                Clear Filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredItems.map((item) => (
                <FurnitureCard3D key={item.id} furniture={item} />
              ))}
            </div>
          )}
        </div>

        {/* Custom Design CTA */}
        <div className="text-center bg-gradient-to-r from-[#8B5A2B] to-[#6B4423] text-white p-12 rounded-xl">
          <h2 className="text-3xl md:text-4xl font-['Playfair_Display'] font-bold mb-6">
            Need Something Unique?
          </h2>
          <p className="text-lg max-w-2xl mx-auto mb-8 text-neutral-200">
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
