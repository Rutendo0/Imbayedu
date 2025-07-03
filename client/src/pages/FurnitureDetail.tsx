
import React, { useState } from "react";
import { useParams, Link } from "wouter";
import { Helmet } from "react-helmet-async";
import { Button } from "../components/ui/button";
import { ArrowLeft, ShoppingCart, Heart, Share2, ChevronLeft, ChevronRight } from "lucide-react";

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

const FurnitureDetail = () => {
  const { id } = useParams();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState("beige");
  const [selectedSize, setSelectedSize] = useState("queen");

  // Enhanced furniture data with multiple angles
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
      featured: true,
      details: {
        weight: "45kg",
        warranty: "5 years",
        assembly: "Professional assembly recommended",
        care: "Regular leather conditioning required"
      }
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
      featured: true,
      details: {
        weight: "35kg",
        warranty: "10 years",
        assembly: "Professional assembly recommended",
        care: "Clean with wood cleaner, avoid moisture"
      }
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
      featured: true,
      details: {
        weight: "65kg",
        warranty: "7 years on frame, 2 years on hardware",
        assembly: "Professional assembly recommended",
        care: "Dust regularly with soft cloth, avoid direct sunlight"
      }
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
      featured: true,
      details: {
        weight: "75kg",
        warranty: "10 years on frame, 3 years on hardware",
        assembly: "Professional assembly included",
        care: "Clean with wood-specific products, avoid moisture"
      }
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
      featured: false,
      details: {
        weight: "25kg",
        warranty: "5 years",
        assembly: "Minimal assembly required",
        care: "Clean with wood cleaner, avoid moisture"
      }
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
      featured: false,
      details: {
        weight: "35kg",
        warranty: "5 years on frame, 2 years on hardware",
        assembly: "Minimal assembly required",
        care: "Clean with damp cloth, avoid abrasive cleaners"
      }
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
      featured: true,
      details: {
        weight: "85kg",
        warranty: "10 years on frame, 2 years on upholstery",
        assembly: "Professional assembly included",
        care: "Vacuum upholstery regularly, spot clean as needed"
      }
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
      colors: ["Beige", "Gray", "Natural"],
      sizes: ["Queen", "King"],
      inStock: true,
      featured: false,
      details: {
        weight: "65kg",
        warranty: "8 years on frame, 2 years on upholstery",
        assembly: "Professional assembly included",
        care: "Vacuum upholstery regularly, spot clean as needed"
      }
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
      colors: ["Natural Oak", "Dark Oak"],
      inStock: true,
      featured: true,
      details: {
        weight: "85kg",
        warranty: "12 years on frame, 3 years on hardware",
        assembly: "Professional assembly recommended",
        care: "Clean with wood cleaner, avoid moisture"
      }
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
      colors: ["Forest Green", "Navy", "Charcoal"],
      sizes: ["Queen", "King"],
      inStock: true,
      featured: true,
      details: {
        weight: "75kg",
        warranty: "10 years on frame, 2 years on upholstery",
        assembly: "Professional assembly recommended",
        care: "Professional velvet cleaning recommended"
      }
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
      colors: ["Natural Oak", "Dark Walnut"],
      sizes: ["King", "Super King"],
      inStock: true,
      featured: true,
      details: {
        weight: "120kg",
        warranty: "15 years on frame, 5 years on hardware",
        assembly: "Professional assembly included",
        care: "Clean with wood-specific products, dust regularly"
      }
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
      colors: ["Neutral", "Light Gray", "Charcoal"],
      inStock: true,
      featured: false,
      details: {
        weight: "95kg",
        warranty: "10 years on frame, 3 years on upholstery",
        assembly: "Professional assembly recommended",
        care: "Professional cleaning recommended, vacuum regularly"
      }
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
      colors: ["Cream", "Light Gray", "Natural"],
      inStock: true,
      featured: true,
      details: {
        weight: "95kg",
        warranty: "10 years on frame, 3 years on upholstery",
        assembly: "Professional assembly recommended",
        care: "Professional cleaning recommended, vacuum regularly"
      }
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
      colors: ["Charcoal", "Dark Gray", "Black"],
      inStock: true,
      featured: true,
      details: {
        weight: "110kg",
        warranty: "12 years on frame, 4 years on upholstery",
        assembly: "Professional assembly included",
        care: "Vacuum regularly, spot clean as needed"
      }
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
      colors: ["Dark Walnut", "Medium Oak"],
      inStock: true,
      featured: true,
      details: {
        weight: "78kg",
        warranty: "12 years on frame, 3 years on hardware",
        assembly: "Professional assembly recommended",
        care: "Clean with wood cleaner, avoid moisture"
      }
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
      featured: true,
      details: {
        weight: "85kg",
        warranty: "10 years on frame, 2 years on upholstery",
        assembly: "Professional assembly included",
        care: "Vacuum upholstery regularly, spot clean as needed"
      }
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
      colors: ["Natural", "Light Gray", "Cream"],
      inStock: true,
      featured: true,
      details: {
        weight: "65kg",
        warranty: "8 years on frame, 3 years on upholstery",
        assembly: "Professional assembly recommended",
        care: "Professional cleaning recommended, rotate cushions regularly"
      }
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
      colors: ["Rich Walnut", "Natural Walnut"],
      inStock: true,
      featured: true,
      details: {
        weight: "68kg",
        warranty: "10 years on frame, 3 years on hardware",
        assembly: "Professional assembly included",
        care: "Clean with wood-specific products, avoid direct sunlight"
      }
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
      colors: ["Natural", "Light Gray", "Cream"],
      inStock: true,
      featured: true,
      details: {
        weight: "72kg",
        warranty: "8 years on frame, 3 years on upholstery",
        assembly: "Professional assembly recommended",
        care: "Professional cleaning recommended, rotate cushions regularly"
      }
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
      colors: ["Cream", "Natural Stone"],
      inStock: true,
      featured: true,
      details: {
        weight: "95kg",
        warranty: "5 years on structure",
        assembly: "Professional delivery and setup included",
        care: "Clean with mild soap and water, avoid abrasive cleaners"
      }
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
      colors: ["Forest Green", "Navy", "Charcoal"],
      inStock: true,
      featured: true,
      details: {
        weight: "45kg",
        warranty: "8 years on frame, 2 years on upholstery",
        assembly: "Minimal assembly required",
        care: "Professional velvet cleaning recommended"
      }
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
      colors: ["Natural Oak", "Dark Oak"],
      inStock: true,
      featured: true,
      details: {
        weight: "52kg",
        warranty: "12 years on frame, 3 years on upholstery",
        assembly: "Professional assembly included",
        care: "Clean wood with appropriate products, vacuum upholstery regularly"
      }
    }
  ];
    

  const furniture = furnitureItems.find(item => item.id === parseInt(id || "0"));

  if (!furniture) {
    return (
      <div className="pt-24 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Furniture Not Found</h1>
          <Link href="/furniture-catalog">
            <Button>Back to Catalog</Button>
          </Link>
        </div>
      </div>
    );
  }

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % furniture.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + furniture.images.length) % furniture.images.length);
  };

  return (
    <>
      <Helmet>
        <title>{furniture.name} - Imbayedu Art Collective</title>
        <meta name="description" content={furniture.description} />
      </Helmet>

      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Breadcrumb */}
          <div className="mb-8">
            <Link href="/furniture-catalog" className="inline-flex items-center text-neutral-600 hover:text-[#D3A265] transition-colors">
              <ArrowLeft size={16} className="mr-2" />
              Back to Furniture Catalog
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Image Gallery */}
            <div className="space-y-4">
              {/* Main Image */}
              <div className="relative aspect-square bg-neutral-100 rounded-xl overflow-hidden">
                <ImageLoader
                  src={furniture.images[currentImageIndex]}
                  alt={`${furniture.name} - View ${currentImageIndex + 1}`}
                  aspectRatio="square"
                  className="w-full h-full"
                />
                
                {/* Navigation Arrows */}
                {furniture.images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 transition-colors"
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 transition-colors"
                    >
                      <ChevronRight size={20} />
                    </button>
                  </>
                )}

                {/* Image Counter */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                  {currentImageIndex + 1} / {furniture.images.length}
                </div>
              </div>

              {/* Thumbnail Gallery */}
              <div className="grid grid-cols-5 gap-2">
                {furniture.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`aspect-square rounded-lg overflow-hidden border-2 transition-colors ${
                      currentImageIndex === index ? 'border-[#D3A265]' : 'border-transparent'
                    }`}
                  >
                    <ImageLoader
                      src={image}
                      alt={`${furniture.name} thumbnail ${index + 1}`}
                      aspectRatio="square"
                      className="w-full h-full hover:opacity-80 transition-opacity"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Product Details */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl md:text-4xl font-['Playfair_Display'] font-bold mb-2">
                  {furniture.name}
                </h1>
                <p className="text-2xl font-bold text-[#D3A265] mb-4">
                  ${furniture.price.toLocaleString()}
                </p>
                <p className="text-neutral-600 leading-relaxed">
                  {furniture.description}
                </p>
              </div>

              {/* Options */}
              <div className="space-y-4">
                {furniture.colors && (
                  <div>
                    <h3 className="font-semibold mb-2">Color</h3>
                    <div className="flex gap-2">
                      {furniture.colors.map((color) => (
                        <button
                          key={color}
                          onClick={() => setSelectedColor(color.toLowerCase())}
                          className={`px-4 py-2 border rounded-lg transition-colors ${
                            selectedColor === color.toLowerCase()
                              ? 'border-[#D3A265] bg-[#D3A265] text-white'
                              : 'border-neutral-300 hover:border-[#D3A265]'
                          }`}
                        >
                          {color}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {furniture.sizes && (
                  <div>
                    <h3 className="font-semibold mb-2">Size</h3>
                    <div className="flex gap-2">
                      {furniture.sizes.map((size) => (
                        <button
                          key={size}
                          onClick={() => setSelectedSize(size.toLowerCase())}
                          className={`px-4 py-2 border rounded-lg transition-colors ${
                            selectedSize === size.toLowerCase()
                              ? 'border-[#D3A265] bg-[#D3A265] text-white'
                              : 'border-neutral-300 hover:border-[#D3A265]'
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Specifications */}
              <div className="bg-neutral-50 p-6 rounded-xl">
                <h3 className="font-semibold mb-4">Specifications</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-neutral-600">Dimensions:</span>
                    <p className="font-medium">{furniture.dimensions}</p>
                  </div>
                  <div>
                    <span className="text-neutral-600">Material:</span>
                    <p className="font-medium">{furniture.material}</p>
                  </div>
                  {furniture.details.weight && (
                    <div>
                      <span className="text-neutral-600">Weight:</span>
                      <p className="font-medium">{furniture.details.weight}</p>
                    </div>
                  )}
                  {furniture.details.warranty && (
                    <div>
                      <span className="text-neutral-600">Warranty:</span>
                      <p className="font-medium">{furniture.details.warranty}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-4">
                <div className="flex gap-3">
                  <Button className="flex-1 bg-[#D3A265] hover:bg-[#BA8F58] text-white py-3">
                    <ShoppingCart size={20} className="mr-2" />
                    Add to Cart
                  </Button>
                  <Button variant="outline" size="icon" className="border-[#D3A265] text-[#D3A265] hover:bg-[#D3A265] hover:text-white py-3 px-3">
                    <Heart size={20} />
                  </Button>
                  <Button variant="outline" size="icon" className="border-[#D3A265] text-[#D3A265] hover:bg-[#D3A265] hover:text-white py-3 px-3">
                    <Share2 size={20} />
                  </Button>
                </div>

                <div className="text-sm text-neutral-600 space-y-1">
                  <p>✓ {furniture.details.assembly}</p>
                  <p>✓ Free shipping on orders over $1,000</p>
                  <p>✓ 30-day return policy</p>
                </div>
              </div>

              {/* Care Instructions */}
              <div className="border-t pt-6">
                <h3 className="font-semibold mb-2">Care Instructions</h3>
                <p className="text-sm text-neutral-600">{furniture.details.care}</p>
              </div>
            </div>
          </div>

          {/* Custom Design CTA */}
          <div className="mt-16 text-center bg-[#8B5A2B] text-white p-12 rounded-xl">
            <h2 className="text-2xl md:text-3xl font-['Playfair_Display'] font-bold mb-4">
              Love this piece but want it customized?
            </h2>
            <p className="text-lg max-w-2xl mx-auto mb-6 text-neutral-300">
              We can customize colors, materials, dimensions, and finishes to perfectly match your space.
            </p>
            <Link href="/contact">
              <Button className="bg-[#D3A265] hover:bg-[#BA8F58] text-white px-8 py-3">
                Request Custom Quote
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default FurnitureDetail;
