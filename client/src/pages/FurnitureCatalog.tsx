import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Button } from "../components/ui/button";
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
      id: 10,
      name: "Walnut Wood Cabinet",
      category: "storage",
      price: 1450,
      description: "Elegant walnut cabinet with brass legs and clean lines",
      imageUrl: "/img/furniture/WhatsApp Image 2025-07-03 at 08.29.20_51b60c5f_1751565128999.jpg",
      dimensions: "90cm W x 45cm D x 120cm H",
      material: "Walnut wood, brass hardware",
      inStock: true,
      featured: true
    },
    {
      id: 11,
      name: "Modern Chest of Drawers",
      category: "storage",
      price: 1680,
      description: "Four-drawer chest with contrasting wood and black front panels",
      imageUrl: "/img/furniture/WhatsApp Image 2025-07-03 at 08.29.21_a470a034_1751565129000.jpg",
      dimensions: "80cm W x 45cm D x 110cm H",
      material: "Walnut wood, black oak veneer, brass handles",
      inStock: true,
      featured: true
    },
    {
      id: 12,
      name: "Executive Tall Dresser",
      category: "storage",
      price: 1980,
      description: "Tall four-drawer dresser with sophisticated black and wood finish",
      imageUrl: "/img/furniture/WhatsApp Image 2025-07-03 at 08.29.23_a7a905d5_1751565129000.jpg",
      dimensions: "70cm W x 45cm D x 130cm H",
      material: "Walnut wood, black oak veneer, brass hardware",
      inStock: true,
      featured: false
    },
    {
      id: 13,
      name: "Contemporary Four-Drawer Chest",
      category: "storage",
      price: 1750,
      description: "Modern chest with warm wood tones and sleek black drawer fronts",
      imageUrl: "/img/furniture/WhatsApp Image 2025-07-03 at 08.29.25_60fb09d8_1751565129001.jpg",
      dimensions: "75cm W x 45cm D x 115cm H",
      material: "Walnut wood, black oak veneer, brass handles",
      inStock: true,
      featured: false
    },
    {
      id: 14,
      name: "Fluted Wood Credenza",
      category: "storage",
      price: 2450,
      description: "Sophisticated credenza with signature fluted wood design",
      imageUrl: "/img/furniture/WhatsApp Image 2025-07-03 at 08.29.25_f9723f98_1751565129001.jpg",
      dimensions: "180cm W x 45cm D x 75cm H",
      material: "Fluted walnut wood, brass hardware",
      inStock: true,
      featured: true
    },
    {
      id: 15,
      name: "Minimalist Storage Bench",
      category: "storage",
      price: 980,
      description: "Clean-lined storage bench with brass base",
      imageUrl: "/img/furniture/WhatsApp Image 2025-07-03 at 08.29.26_6f47d61c_1751565129002.jpg",
      dimensions: "120cm W x 45cm D x 45cm H",
      material: "Light oak veneer, brass frame",
      inStock: true,
      featured: false
    },
    {
      id: 16,
      name: "Executive Four-Drawer Dresser",
      category: "storage",
      price: 1890,
      description: "Elegant dresser with brass square handles and clean design",
      imageUrl: "/img/furniture/WhatsApp Image 2025-07-03 at 08.29.28_d740f086_1751565129002.jpg",
      dimensions: "120cm W x 50cm D x 65cm H",
      material: "Light oak veneer, brass hardware, brass frame",
      inStock: true,
      featured: false
    },
    {
      id: 17,
      name: "Modern Wide Dresser",
      category: "storage",
      price: 2180,
      description: "Wide four-drawer dresser with sophisticated brass accents",
      imageUrl: "/img/furniture/WhatsApp Image 2025-07-03 at 08.29.32_e121794c_1751565129003.jpg",
      dimensions: "150cm W x 50cm D x 70cm H",
      material: "Light oak veneer, brass hardware, brass frame",
      inStock: true,
      featured: false
    },
    {
      id: 18,
      name: "Geometric Storage Cube",
      category: "storage",
      price: 650,
      description: "Unique geometric storage cube with natural wood finish",
      imageUrl: "/img/furniture/WhatsApp Image 2025-07-03 at 08.29.33_0631bd50_1751565129003.jpg",
      dimensions: "50cm W x 50cm D x 50cm H",
      material: "Solid oak, geometric construction",
      inStock: true,
      featured: false
    },
    {
      id: 19,
      name: "Artisan Wood Side Table",
      category: "tables",
      price: 750,
      description: "Sculptural side table showcasing natural wood grain",
      imageUrl: "/img/furniture/WhatsApp Image 2025-07-03 at 08.29.35_22146ac0_1751565129003.jpg",
      dimensions: "45cm W x 45cm D x 55cm H",
      material: "Solid oak, natural finish",
      inStock: true,
      featured: false
    },
    {
      id: 20,
      name: "Marble Front Nightstand",
      category: "bedroom",
      price: 1120,
      description: "Elegant nightstand with marble drawer fronts and wood frame",
      imageUrl: "/img/furniture/WhatsApp Image 2025-07-03 at 08.29.37_8853a2d6_1751565129004.jpg",
      dimensions: "50cm W x 40cm D x 60cm H",
      material: "Oak wood, marble veneer, soft-close drawers",
      inStock: true,
      featured: false
    },
    {
      id: 21,
      name: "Premium Marble Bedside Table",
      category: "bedroom",
      price: 1180,
      description: "Luxurious two-drawer bedside table with marble fronts",
      imageUrl: "/img/furniture/WhatsApp Image 2025-07-03 at 08.29.38_c01f8729_1751565129004.jpg",
      dimensions: "55cm W x 40cm D x 65cm H",
      material: "Oak wood, marble veneer, soft-close drawers",
      inStock: true,
      featured: false
    },
    {
      id: 22,
      name: "Contemporary Shagreen Nightstand",
      category: "bedroom",
      price: 1350,
      description: "Sophisticated nightstand with shagreen texture and brass base",
      imageUrl: "/img/furniture/WhatsApp Image 2025-07-03 at 08.29.39_6765d7a7_1751565129005.jpg",
      dimensions: "55cm W x 40cm D x 65cm H",
      material: "Shagreen finish, brass frame, soft-close drawers",
      inStock: true,
      featured: true
    },
    {
      id: 23,
      name: "Modern Platform Bed",
      category: "bedroom",
      price: 2650,
      description: "Contemporary platform bed with channel-tufted headboard",
      imageUrl: "/img/furniture/WhatsApp Image 2025-07-03 at 08.29.39_8b7ee9a0_1751565129004.jpg",
      dimensions: "200cm L x 160cm W x 110cm H",
      material: "Solid wood base, premium upholstered headboard",
      inStock: true,
      featured: true
    },
    {
      id: 24,
      name: "Luxury Upholstered Bed",
      category: "bedroom",
      price: 3200,
      description: "Premium bed frame with sophisticated channel tufting",
      imageUrl: "/img/furniture/WhatsApp Image 2025-07-03 at 08.29.39_b7d51203_1751565129005.jpg",
      dimensions: "210cm L x 180cm W x 120cm H",
      material: "Solid wood base, premium fabric upholstery",
      inStock: true,
      featured: false
    },
    {
      id: 25,
      name: "Executive Channel Bed",
      category: "bedroom",
      price: 3580,
      description: "Sophisticated king-size bed with vertical channel design",
      imageUrl: "/img/furniture/WhatsApp Image 2025-07-03 at 08.29.40_3f0bd6a4_1751565129005.jpg",
      dimensions: "220cm L x 200cm W x 130cm H",
      material: "Solid wood frame, premium linen upholstery",
      inStock: true,
      featured: true
    },
    {
      id: 26,
      name: "Minimalist Platform Bed - Cream",
      category: "bedroom",
      price: 2450,
      description: "Clean-lined platform bed with low profile and modern aesthetic",
      imageUrl: "/img/furniture/WhatsApp Image 2025-07-03 at 08.29.42_00f2934c_1751565163746.jpg",
      dimensions: "200cm L x 160cm W x 35cm H",
      material: "Premium linen upholstery, solid wood frame",
      inStock: true,
      featured: false
    },
    {
      id: 27,
      name: "Contemporary Low Profile Bed",
      category: "bedroom",
      price: 2280,
      description: "Ultra-modern low platform bed with neutral upholstery",
      imageUrl: "/img/furniture/WhatsApp Image 2025-07-03 at 08.29.42_e08b64ea_1751565163747.jpg",
      dimensions: "200cm L x 160cm W x 30cm H",
      material: "Neutral fabric upholstery, engineered wood base",
      inStock: true,
      featured: false
    },
    {
      id: 28,
      name: "Scandinavian Platform Bed",
      category: "bedroom",
      price: 2650,
      description: "Minimalist platform bed with clean lines and premium finishes",
      imageUrl: "/img/furniture/WhatsApp Image 2025-07-03 at 08.29.42_ed286796_1751565163747.jpg",
      dimensions: "200cm L x 180cm W x 45cm H",
      material: "Premium linen, solid oak frame",
      inStock: true,
      featured: true
    },
    {
      id: 29,
      name: "Oak Sideboard with Brass Hardware",
      category: "storage",
      price: 3200,
      description: "Elegant oak sideboard featuring beautiful wood grain and brass details",
      imageUrl: "/img/furniture/WhatsApp Image 2025-07-03 at 08.29.43_4c7a47f1_1751565163748.jpg",
      dimensions: "180cm W x 45cm D x 75cm H",
      material: "Solid oak, brass hardware and legs",
      inStock: true,
      featured: true
    },
    {
      id: 30,
      name: "Modern Oak Six-Drawer Dresser",
      category: "storage",
      price: 2890,
      description: "Sophisticated dresser with brass tube handles and oak construction",
      imageUrl: "/img/furniture/WhatsApp Image 2025-07-03 at 08.29.43_5d40e9c7_1751565163748.jpg",
      dimensions: "150cm W x 50cm D x 80cm H",
      material: "Solid oak, brass tube handles, tapered legs",
      inStock: true,
      featured: false
    },
    {
      id: 31,
      name: "Executive Oak Dresser",
      category: "storage",
      price: 3150,
      description: "Premium six-drawer dresser with brass accents and clean lines",
      imageUrl: "/img/furniture/WhatsApp Image 2025-07-03 at 08.29.44_0e29464a_1751565163749.jpg",
      dimensions: "160cm W x 50cm D x 75cm H",
      material: "Solid oak, brass hardware, natural finish",
      inStock: true,
      featured: false
    },
    {
      id: 32,
      name: "Forest Green Velvet Bed",
      category: "bedroom",
      price: 3480,
      description: "Luxurious bed with rich forest green velvet upholstery",
      imageUrl: "/img/furniture/WhatsApp Image 2025-07-03 at 08.29.45_beaec136_1751565163750.jpg",
      dimensions: "200cm L x 160cm W x 120cm H",
      material: "Forest green velvet, solid wood frame, brass feet",
      inStock: true,
      featured: true
    },
    {
      id: 33,
      name: "Green Velvet Platform Bed",
      category: "bedroom",
      price: 3280,
      description: "Statement bed with curved headboard in deep green velvet",
      imageUrl: "/img/furniture/WhatsApp Image 2025-07-03 at 08.29.45_cd9bbfad_1751565163751.jpg",
      dimensions: "200cm L x 180cm W x 110cm H",
      material: "Deep green velvet upholstery, hardwood frame",
      inStock: true,
      featured: false
    },
    {
      id: 34,
      name: "Emerald Velvet Wingback Bed",
      category: "bedroom",
      price: 3650,
      description: "Dramatic wingback bed in rich emerald velvet with brass details",
      imageUrl: "/img/furniture/WhatsApp Image 2025-07-03 at 08.29.46_63b0b657_1751565163751.jpg",
      dimensions: "220cm L x 180cm W x 130cm H",
      material: "Emerald velvet, solid wood frame, brass accents",
      inStock: true,
      featured: true
    },
    {
      id: 35,
      name: "Fluted Wood Headboard Bed",
      category: "bedroom",
      price: 4200,
      description: "Architectural bed with stunning fluted wood headboard and integrated nightstands",
      imageUrl: "/img/furniture/WhatsApp Image 2025-07-03 at 08.29.47_12834d40_1751565163753.jpg",
      dimensions: "240cm W x 200cm D x 130cm H",
      material: "Fluted oak, integrated storage, brass accents",
      inStock: true,
      featured: true
    },
    {
      id: 36,
      name: "Fluted Oak Platform Bed",
      category: "bedroom",
      price: 3850,
      description: "Modern platform bed with distinctive fluted oak construction",
      imageUrl: "/img/furniture/WhatsApp Image 2025-07-03 at 08.29.47_6de34b3a_1751565163753.jpg",
      dimensions: "220cm L x 200cm W x 80cm H",
      material: "Fluted oak throughout, platform design",
      inStock: true,
      featured: false
    },
    {
      id: 37,
      name: "Oak Fluted Storage Bed",
      category: "bedroom",
      price: 4500,
      description: "Ultimate storage bed with fluted oak design and integrated cabinetry",
      imageUrl: "/img/furniture/WhatsApp Image 2025-07-03 at 08.29.47_d1e2d157_1751565163753.jpg",
      dimensions: "250cm W x 220cm D x 130cm H",
      material: "Fluted oak, extensive storage, modular design",
      inStock: true,
      featured: true
    },
    {
      id: 38,
      name: "Fluted Wood Bedroom Suite",
      category: "bedroom",
      price: 5200,
      description: "Complete bedroom solution with fluted headboard and matching nightstands",
      imageUrl: "/img/furniture/WhatsApp Image 2025-07-03 at 08.29.48_005c07c5_1751565163754.jpg",
      dimensions: "280cm W x 220cm D x 130cm H",
      material: "Fluted oak construction, integrated nightstands",
      inStock: true,
      featured: true
    },
    {
      id: 39,
      name: "Contemporary Sectional Sofa",
      category: "seating",
      price: 4200,
      description: "Modular sectional with clean lines and neutral upholstery",
      imageUrl: "/img/furniture/WhatsApp Image 2025-07-03 at 08.29.48_bb37606e_1751565163754.jpg",
      dimensions: "300cm L x 200cm W x 80cm H",
      material: "Premium linen blend, hardwood frame, dark wood legs",
      inStock: true,
      featured: false
    },
    {
      id: 40,
      name: "Modern Sectional with Chaise",
      category: "seating",
      price: 4650,
      description: "Sophisticated sectional featuring chaise lounge and modular design",
      imageUrl: "/img/furniture/WhatsApp Image 2025-07-03 at 08.29.48_c199343d_1751565163754.jpg",
      dimensions: "320cm L x 180cm W x 85cm H",
      material: "Premium fabric, solid wood frame, tapered legs",
      inStock: true,
      featured: true
    },
    {
      id: 41,
      name: "Modular Sectional Sofa - Cream",
      category: "seating",
      price: 3850,
      description: "Elegant modular sectional with cream upholstery and wooden base trim",
      imageUrl: "/img/furniture/WhatsApp Image 2025-07-03 at 08.29.49_6334a403_1751565481135.jpg",
      dimensions: "280cm L x 180cm W x 80cm H",
      material: "Cream linen blend, solid wood base",
      inStock: true,
      featured: true
    },
    {
      id: 42,
      name: "Contemporary Corner Sectional",
      category: "seating",
      price: 3650,
      description: "Modern corner sectional with clean lines and neutral upholstery",
      imageUrl: "/img/furniture/WhatsApp Image 2025-07-03 at 08.29.49_700d49f9_1751565481134.jpg",
      dimensions: "260cm L x 160cm W x 75cm H",
      material: "Neutral fabric, wooden trim base",
      inStock: true,
      featured: false
    },
    {
      id: 43,
      name: "L-Shaped Modular Sofa",
      category: "seating",
      price: 4120,
      description: "Spacious L-shaped sectional perfect for modern living rooms",
      imageUrl: "/img/furniture/WhatsApp Image 2025-07-03 at 08.29.49_b1318cc4_1751565481135.jpg",
      dimensions: "300cm L x 200cm W x 85cm H",
      material: "Premium upholstery, solid wood base trim",
      inStock: true,
      featured: true
    },
    {
      id: 44,
      name: "Elegant Sectional with Ottoman",
      category: "seating",
      price: 4280,
      description: "Sophisticated sectional featuring integrated ottoman and refined styling",
      imageUrl: "/img/furniture/WhatsApp Image 2025-07-03 at 08.29.50_2ba78eb7_1751565481136.jpg",
      dimensions: "320cm L x 180cm W x 80cm H",
      material: "Neutral linen, walnut wood base",
      inStock: true,
      featured: false
    },
    {
      id: 45,
      name: "Contemporary Charcoal Sectional",
      category: "seating",
      price: 4450,
      description: "Modern sectional in rich charcoal with plush cushioning",
      imageUrl: "/img/furniture/WhatsApp Image 2025-07-03 at 08.29.50_f92c6ee1_1751565481137.jpg",
      dimensions: "310cm L x 190cm W x 85cm H",
      material: "Charcoal performance fabric, solid frame",
      inStock: true,
      featured: true
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

      {/* Hero Section */}
      <div className="relative">
        <div className="absolute inset-0 bg-black/40 z-10"></div>
        <div className="relative h-[60vh] bg-cover bg-center" style={{ backgroundImage: `url('/attached_assets/WhatsApp Image 2025-07-03 at 08.29.47_12834d40_1751565163753.jpg')` }}>
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
                    src={item.imageUrl}
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
                  <p className="text-neutral-600 mb-4line-clamp-2">{item.description}</p>
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
                <Link key={item.id} href={`/furniture/${item.id}`} className="group bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
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
                      <h4 className="text-lg font-semibold line-clamp-2 flex-1 mr-2">{item.name}</h4>
                      <span className="text-lg font-bold text-[#D3A265] whitespace-nowrap">${item.price.toLocaleString()}</span>
                    </div>
                    <p className="text-neutral-600 text-sm mb-3 line-clamp-2">{item.description}</p>
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
                </Link>
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