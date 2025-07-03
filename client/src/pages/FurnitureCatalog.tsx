
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
      name: "Modern Leather Armchair",
      category: "seating",
      price: 1250,
      description: "Handcrafted leather armchair with oak frame. This contemporary piece combines traditional craftsmanship with modern design sensibilities.",
      images: [
        "/img/artwork/WhatsApp Image 2025-05-22 at 11.04.44.jpeg",
        "/img/artwork/WhatsApp Image 2025-05-22 at 11.04.45.jpeg",
        "/img/artwork/WhatsApp Image 2025-05-22 at 11.04.46.jpeg"
      ],
      dimensions: "80cm W x 85cm D x 75cm H",
      material: "Premium leather, oak wood",
      colors: ["Black", "Brown", "Tan"],
      inStock: true,
      featured: true
    },
    {
      id: 2,
      name: "Walnut Wood Cabinet",
      category: "storage",
      price: 1450,
      description: "Elegant walnut cabinet with brass legs and clean lines",
      images: [
        "/img/furniture/WhatsApp Image 2025-07-03 at 08.29.20_51b60c5f_1751565128999.jpg",
        "/img/furniture/WhatsApp Image 2025-07-03 at 08.29.28_d740f086_1751565129002.jpg",
        "/img/furniture/WhatsApp Image 2025-07-03 at 08.29.32_e121794c_1751565129003.jpg"
      ],
      dimensions: "90cm W x 45cm D x 120cm H",
      material: "Walnut wood, brass hardware",
      inStock: true,
      featured: true
    },
    {
      id: 3,
      name: "Modern Chest of Drawers",
      category: "storage",
      price: 1680,
      description: "Four-drawer chest with contrasting wood and black front panels",
      images: [
        "/img/furniture/WhatsApp Image 2025-07-03 at 08.29.21_a470a034_1751565129000.jpg",
        "/img/furniture/WhatsApp Image 2025-07-03 at 08.29.23_a7a905d5_1751565129000.jpg",
        "/img/furniture/WhatsApp Image 2025-07-03 at 08.29.25_60fb09d8_1751565129001.jpg"
      ],
      dimensions: "80cm W x 45cm D x 110cm H",
      material: "Walnut wood, black oak veneer, brass handles",
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
        "/img/furniture/WhatsApp Image 2025-07-03 at 08.29.25_f9723f98_1751565129001.jpg",
        "/img/furniture/WhatsApp Image 2025-07-03 at 08.29.26_6f47d61c_1751565129002.jpg",
        "/img/furniture/WhatsApp Image 2025-07-03 at 08.29.33_0631bd50_1751565129003.jpg"
      ],
      dimensions: "180cm W x 45cm D x 75cm H",
      material: "Fluted walnut wood, brass hardware",
      inStock: true,
      featured: true
    },
    {
      id: 5,
      name: "Artisan Wood Side Table",
      category: "tables",
      price: 750,
      description: "Sculptural side table showcasing natural wood grain",
      images: [
        "/img/furniture/WhatsApp Image 2025-07-03 at 08.29.35_22146ac0_1751565129003.jpg",
        "/img/furniture/WhatsApp Image 2025-07-03 at 08.29.57_ba11e897_1751565540912.jpg",
        "/img/furniture/WhatsApp Image 2025-07-03 at 08.29.58_d04c5f50_1751565540914.jpg"
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
        "/img/furniture/WhatsApp Image 2025-07-03 at 08.29.37_8853a2d6_1751565129004.jpg",
        "/img/furniture/WhatsApp Image 2025-07-03 at 08.29.38_c01f8729_1751565129004.jpg",
        "/img/furniture/WhatsApp Image 2025-07-03 at 08.29.39_6765d7a7_1751565129005.jpg"
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
        "/img/furniture/WhatsApp Image 2025-07-03 at 08.29.40_3f0bd6a4_1751565129005.jpg",
        "/img/furniture/WhatsApp Image 2025-07-03 at 08.29.39_8b7ee9a0_1751565129004.jpg",
        "/img/furniture/WhatsApp Image 2025-07-03 at 08.29.39_b7d51203_1751565129005.jpg",
        "/img/furniture/WhatsApp Image 2025-07-03 at 08.29.40_57059051_1751565129006.jpg"
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
        "/img/furniture/WhatsApp Image 2025-07-03 at 08.29.42_00f2934c_1751565163746.jpg",
        "/img/furniture/WhatsApp Image 2025-07-03 at 08.29.42_e08b64ea_1751565163747.jpg",
        "/img/furniture/WhatsApp Image 2025-07-03 at 08.29.42_ed286796_1751565163747.jpg"
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
        "/img/furniture/WhatsApp Image 2025-07-03 at 08.29.43_4c7a47f1_1751565163748.jpg",
        "/img/furniture/WhatsApp Image 2025-07-03 at 08.29.43_5d40e9c7_1751565163748.jpg",
        "/img/furniture/WhatsApp Image 2025-07-03 at 08.29.44_0e29464a_1751565163749.jpg"
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
        "/img/furniture/WhatsApp Image 2025-07-03 at 08.29.45_beaec136_1751565163750.jpg",
        "/img/furniture/WhatsApp Image 2025-07-03 at 08.29.45_cd9bbfad_1751565163751.jpg",
        "/img/furniture/WhatsApp Image 2025-07-03 at 08.29.46_63b0b657_1751565163751.jpg"
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
        "/img/furniture/WhatsApp Image 2025-07-03 at 08.29.47_12834d40_1751565163753.jpg",
        "/img/furniture/WhatsApp Image 2025-07-03 at 08.29.47_6de34b3a_1751565163753.jpg",
        "/img/furniture/WhatsApp Image 2025-07-03 at 08.29.47_d1e2d157_1751565163753.jpg",
        "/img/furniture/WhatsApp Image 2025-07-03 at 08.29.48_005c07c5_1751565163754.jpg"
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
        "/img/furniture/WhatsApp Image 2025-07-03 at 08.29.48_bb37606e_1751565163754.jpg",
        "/img/furniture/WhatsApp Image 2025-07-03 at 08.29.48_c199343d_1751565163754.jpg",
        "/img/furniture/WhatsApp Image 2025-07-03 at 08.29.49_6334a403_1751565481135.jpg"
      ],
      dimensions: "300cm L x 200cm W x 80cm H",
      material: "Premium linen blend, hardwood frame, dark wood legs",
      inStock: true,
      featured: false
    },
    {
      id: 13,
      name: "Modular Sectional Sofa - Cream",
      category: "seating",
      price: 3850,
      description: "Elegant modular sectional with cream upholstery and wooden base trim",
      images: [
        "/img/furniture/WhatsApp Image 2025-07-03 at 08.29.49_700d49f9_1751565481134.jpg",
        "/img/furniture/WhatsApp Image 2025-07-03 at 08.29.49_b1318cc4_1751565481135.jpg",
        "/img/furniture/WhatsApp Image 2025-07-03 at 08.29.50_2ba78eb7_1751565481136.jpg"
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
        "/img/furniture/WhatsApp Image 2025-07-03 at 08.29.50_f92c6ee1_1751565481137.jpg",
        "/img/furniture/WhatsApp Image 2025-07-03 at 08.29.51_2c988d20_1751565481137.jpg",
        "/img/furniture/WhatsApp Image 2025-07-03 at 08.29.51_35217d8c_1751565481138.jpg"
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
      description: "Elegant eight-drawer dresser showcasing beautiful wood grain patterns",
      images: [
        "/img/furniture/WhatsApp Image 2025-07-03 at 08.29.52_958fd19b_1751565481140.jpg",
        "/img/furniture/WhatsApp Image 2025-07-03 at 08.29.52_7abfea1b_1751565481139.jpg",
        "/img/furniture/WhatsApp Image 2025-07-03 at 08.29.52_b8f388c2_1751565481140.jpg"
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
        "/img/furniture/WhatsApp Image 2025-07-03 at 08.29.53_40316adc_1751565481141.jpg",
        "/img/furniture/WhatsApp Image 2025-07-03 at 08.29.53_78929b86_1751565481141.jpg",
        "/img/furniture/WhatsApp Image 2025-07-03 at 08.29.53_b9aaafa1_1751565481142.jpg"
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
      name: "Classic Sofa with Walnut Base",
      category: "seating",
      price: 2850,
      description: "Timeless sofa design with elegant walnut wood base and neutral upholstery",
      images: [
        "/img/furniture/WhatsApp Image 2025-07-03 at 08.29.54_5d71d380_1751565481143.jpg",
        "/img/furniture/WhatsApp Image 2025-07-03 at 08.29.54_8caea5b9_1751565481143.jpg",
        "/img/furniture/WhatsApp Image 2025-07-03 at 08.29.54_c4441db1_1751565481143.jpg"
      ],
      dimensions: "220cm L x 90cm W x 80cm H",
      material: "Premium linen blend, walnut wood base",
      inStock: true,
      featured: true
    },
    {
      id: 18,
      name: "Curved Walnut Tall Cabinet",
      category: "storage",
      price: 3480,
      description: "Elegant tall cabinet with curved edges and rich walnut finish on brass legs",
      images: [
        "/img/furniture/WhatsApp Image 2025-07-03 at 08.29.55_2702d5aa_1751565540908.jpg",
        "/img/furniture/WhatsApp Image 2025-07-03 at 08.29.55_fad333ab_1751565540910.jpg",
        "/img/furniture/WhatsApp Image 2025-07-03 at 08.29.56_5b025cf7_1751565540910.jpg"
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
        "/img/furniture/WhatsApp Image 2025-07-03 at 08.29.55_f03d6cc6_1751565540909.jpg",
        "/img/furniture/WhatsApp Image 2025-07-03 at 08.29.56_adf0f063_1751565540911.jpg",
        "/img/furniture/WhatsApp Image 2025-07-03 at 08.29.56_dcfa4fe4_1751565540911.jpg"
      ],
      dimensions: "220cm L x 90cm W x 80cm H",
      material: "Neutral linen blend, walnut wood frame",
      inStock: true,
      featured: true
    },
    {
      id: 20,
      name: "Sculptural Round Coffee Table",
      category: "tables",
      price: 2450,
      description: "Modern round coffee table with sculptural cream base and smooth finish",
      images: [
        "/img/furniture/WhatsApp Image 2025-07-03 at 08.29.57_28c56216_1751565540912.jpg",
        "/img/furniture/WhatsApp Image 2025-07-03 at 08.29.58_5c45e522_1751565540913.jpg",
        "/img/furniture/WhatsApp Image 2025-07-03 at 08.29.58_b99b40a3_1751565540913.jpg"
      ],
      dimensions: "120cm Diameter x 45cm H",
      material: "Cream stone composite, sculptural base",
      inStock: true,
      featured: true
    },
    {
      id: 21,
      name: "Forest Green Velvet Armchair",
      category: "seating",
      price: 1850,
      description: "Luxurious armchair in rich forest green velvet with brass legs",
      images: [
        "/img/furniture/WhatsApp Image 2025-07-03 at 08.29.59_8a30662e_1751565540914.jpg",
        "/img/furniture/WhatsApp Image 2025-07-03 at 08.30.00_0a90b311_1751565540915.jpg",
        "/img/furniture/WhatsApp Image 2025-07-03 at 08.30.00_c603a5cc_1751565540916.jpg"
      ],
      dimensions: "80cm W x 85cm D x 75cm H",
      material: "Forest green velvet, brass legs, premium construction",
      inStock: true,
      featured: true
    },
    {
      id: 22,
      name: "Fluted Oak Armchair",
      category: "seating",
      price: 2150,
      description: "Architectural armchair featuring fluted oak construction with neutral cushions",
      images: [
        "/img/furniture/WhatsApp Image 2025-07-03 at 08.30.00_f148ff6c_1751565540916.jpg",
        "/img/furniture/WhatsApp Image 2025-07-03 at 08.30.01_5e1928f1_1751565540916.jpg",
        "/img/furniture/WhatsApp Image 2025-07-03 at 08.30.01_6feaacb2_1751565540917.jpg"
      ],
      dimensions: "85cm W x 90cm D x 80cm H",
      material: "Fluted oak frame, neutral upholstery",
      inStock: true,
      featured: true
    },
    {
      id: 23,
      name: "Modern Dining Chair Set",
      category: "seating",
      price: 1200,
      description: "Contemporary dining chairs with clean lines and premium upholstery",
      images: [
        "/img/furniture/WhatsApp Image 2025-07-03 at 08.30.01_ce4434c0_1751565658114.jpg",
        "/img/furniture/WhatsApp Image 2025-07-03 at 08.30.02_27a93443_1751565658114.jpg",
        "/img/furniture/WhatsApp Image 2025-07-03 at 08.30.02_94aaf941_1751565658115.jpg"
      ],
      dimensions: "45cm W x 50cm D x 85cm H",
      material: "Premium upholstery, solid wood frame",
      inStock: true,
      featured: false
    },
    {
      id: 24,
      name: "Executive Dining Table",
      category: "tables",
      price: 3800,
      description: "Sophisticated dining table with rich wood finish and brass details",
      images: [
        "/img/furniture/WhatsApp Image 2025-07-03 at 08.30.02_ff34bf05_1751565658115.jpg",
        "/img/furniture/WhatsApp Image 2025-07-03 at 08.30.03_a5d646a1_1751565658116.jpg",
        "/img/furniture/WhatsApp Image 2025-07-03 at 08.30.03_ad278f0b_1751565658116.jpg"
      ],
      dimensions: "240cm L x 100cm W x 75cm H",
      material: "Premium wood, brass accents",
      inStock: true,
      featured: true
    },
    {
      id: 25,
      name: "Contemporary Bar Stools",
      category: "seating",
      price: 850,
      description: "Modern bar stools with adjustable height and swivel function",
      images: [
        "/img/furniture/WhatsApp Image 2025-07-03 at 08.30.03_cba09154_1751565658116.jpg",
        "/img/furniture/WhatsApp Image 2025-07-03 at 08.30.04_765a89e7_1751565658117.jpg",
        "/img/furniture/WhatsApp Image 2025-07-03 at 08.30.04_9325438e_1751565658117.jpg"
      ],
      dimensions: "40cm W x 40cm D x 85-110cm H",
      material: "Steel frame, premium upholstery",
      inStock: true,
      featured: false
    },
    {
      id: 26,
      name: "Luxury Office Chair",
      category: "seating",
      price: 1680,
      description: "Executive office chair with premium leather and ergonomic design",
      images: [
        "/img/furniture/WhatsApp Image 2025-07-03 at 08.30.04_a5d2e4db_1751565658118.jpg",
        "/img/furniture/WhatsApp Image 2025-07-03 at 08.30.05_3a7d2017_1751565658119.jpg",
        "/img/furniture/WhatsApp Image 2025-07-03 at 08.30.05_70e40450_1751565658120.jpg"
      ],
      dimensions: "70cm W x 75cm D x 115cm H",
      material: "Premium leather, aluminum base",
      inStock: true,
      featured: false
    },
    {
      id: 27,
      name: "Outdoor Patio Set",
      category: "outdoor",
      price: 2400,
      description: "Weather-resistant patio furniture set with cushions",
      images: [
        "/img/furniture/WhatsApp Image 2025-07-03 at 08.30.05_d511b7ae_1751565658120.jpg",
        "/img/furniture/WhatsApp Image 2025-07-03 at 08.29.56_fbbc7a75_1751565540912.jpg",
        "/img/furniture/WhatsApp Image 2025-07-03 at 08.29.59_54577024_1751565540914.jpg"
      ],
      dimensions: "Various sizes",
      material: "Weather-resistant materials, outdoor cushions",
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
        <div className="relative h-[60vh] bg-cover bg-center" style={{ backgroundImage: `url('/img/furniture/WhatsApp Image 2025-07-03 at 08.29.47_12834d40_1751565163753.jpg')` }}>
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
