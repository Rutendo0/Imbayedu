
'use client'

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "../ui/button";
import { Furniture3DViewer } from "../ui/furniture-3d-viewer";
import { ArrowLeft, ShoppingCart, Heart, Share2 } from "lucide-react";

// Removed unused ImageLoader interface and component

const FurnitureDetail = () => {
  const { id } = useParams() as { id?: string | string[] };
  const [selectedColor, setSelectedColor] = useState("beige");
  const [selectedSize, setSelectedSize] = useState("queen");

  // Enhanced furniture data with multiple angles
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
      featured: false,
      details: {
        weight: "35kg",
        assembly: "Professional assembly recommended",
        care: "Clean with wood cleaner, avoid moisture"
      }
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
      material: "Walnut wood, brass hardware",
      inStock: true,
      featured: true,
      details: {
        weight: "65kg",
        assembly: "Professional assembly recommended",
        care: "Clean with wood cleaner, avoid moisture"
      }
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
        "/img/furniture/WhatsApp Image 2025-07-03 at 08.29.56 (3).jpg",
        "/img/furniture/WhatsApp Image 2025-07-03 at 08.29.56 (4).jpg",
        "/img/furniture/WhatsApp Image 2025-07-03 at 08.29.55 (2).jpg"
      ],
      dimensions: "80cm W x 45cm D x 110cm H",
      material: "Walnut wood, brass hardware",
      inStock: true,
      featured: false,
      details: {
        weight: "35kg",
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
        "/img/furniture/WhatsApp Image 2025-07-03 at 08.29.52 (2).jpg",
        "/img/furniture/WhatsApp Image 2025-07-03 at 08.29.52 (3).jpg",
        "/img/furniture/WhatsApp Image 2025-07-03 at 08.29.52.jpg",
        "/img/furniture/WhatsApp Image 2025-07-03 at 08.29.51.jpg",
      ],
      dimensions: "180cm W x 45cm D x 75cm H",
      material: "Fluted walnut wood, brass hardware",
      inStock: true,
      featured: true,
      details: {
        weight: "75kg",
        assembly: "Professional assembly included",
        care: "Clean with wood-specific products, avoid moisture"
      }
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
      featured: false,
      details: {
        weight: "25kg",
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
        "/img/furniture/WhatsApp Image 2025-07-03 at 08.29.37.jpg",
        "/img/furniture/WhatsApp Image 2025-07-03 at 08.29.38.jpg",
        "/img/furniture/WhatsApp Image 2025-07-03 at 08.29.39.jpg",
        "/img/furniture/WhatsApp Image 2025-07-03 at 08.29.33.jpg", 
        "/img/furniture/WhatsApp Image 2025-07-03 at 08.29.35.jpg"  
      ],
      dimensions: "50cm W x 40cm D x 60cm H",
      material: "Oak wood, marble veneer, soft-close drawers",
      inStock: true,
      featured: false,
      details: {
        weight: "35kg",
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
      featured: true,
      details: {
        weight: "85kg",
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
       "/img/furniture/WhatsApp Image 2025-07-03 at 08.29.42 (2).jpg",
        "/img/furniture/WhatsApp Image 2025-07-03 at 08.29.42 (3).jpg",
        "/img/furniture/WhatsApp Image 2025-07-03 at 08.29.42.jpg"
      ],
      dimensions: "200cm L x 160cm W x 35cm H",
      material: "Premium linen upholstery, solid wood frame",
      colors: ["Beige", "Gray", "Natural"],
      sizes: ["Queen", "King"],
      inStock: true,
      featured: false,
      details: {
        weight: "65kg",
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
       "/img/furniture/WhatsApp Image 2025-07-03 at 08.29.44.jpg",
        "/img/furniture/WhatsApp Image 2025-07-03 at 08.29.43 (3).jpg",
         "/img/furniture/WhatsApp Image 2025-07-03 at 08.29.43.jpg",
        "/img/furniture/WhatsApp Image 2025-07-03 at 08.29.43 (2).jpg"
      ],
      dimensions: "180cm W x 45cm D x 75cm H",
      material: "Solid oak, brass hardware and legs",
      colors: ["Natural Oak", "Dark Oak"],
      inStock: true,
      featured: false,
      details: {
        weight: "85kg",
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
       "/img/furniture/WhatsApp Image 2025-07-03 at 08.29.45.jpg",
        "/img/furniture/WhatsApp Image 2025-07-03 at 08.29.45 (2).jpg",
        "/img/furniture/WhatsApp Image 2025-07-03 at 08.29.44 (3).jpg",
        "/img/furniture/WhatsApp Image 2025-07-03 at 08.29.44 (2).jpg"
      ],
      dimensions: "200cm L x 160cm W x 120cm H",
      material: "Forest green velvet, solid wood frame, brass feet",
      colors: ["Forest Green", "Navy", "Charcoal"],
      sizes: ["Queen", "King"],
      inStock: true,
      featured: false,
      details: {
        weight: "75kg",
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
         "/img/furniture/WhatsApp Image 2025-07-03 at 08.29.47.jpg",
        "/img/furniture/WhatsApp Image 2025-07-03 at 08.29.47 (3).jpg",
        "/img/furniture/WhatsApp Image 2025-07-03 at 08.29.47 (2).jpg",
        "/img/furniture/WhatsApp Image 2025-07-03 at 08.29.46 (3).jpg",
        "/img/furniture/WhatsApp Image 2025-07-03 at 08.29.46 (2).jpg",
        "/img/furniture/WhatsApp Image 2025-07-03 at 08.29.46.jpg"
      ],
      dimensions: "240cm W x 200cm D x 130cm H",
      material: "Fluted oak, integrated storage, brass accents",
      colors: ["Natural Oak", "Dark Walnut"],
      sizes: ["King", "Super King"],
      inStock: true,
      featured: true,
      details: {
        weight: "120kg",
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
       "/img/furniture/WhatsApp Image 2025-07-03 at 08.29.48 (2).jpg",
        "/img/furniture/WhatsApp Image 2025-07-03 at 08.29.48.jpg",
        "/img/furniture/WhatsApp Image 2025-07-03 at 08.29.48 (3).jpg",
         "/img/furniture/WhatsApp Image 2025-07-03 at 08.29.49 (3).jpg",
          "/img/furniture/WhatsApp Image 2025-07-03 at 08.29.49 (2).jpg",
           "/img/furniture/WhatsApp Image 2025-07-03 at 08.29.49.jpg",
            "/img/furniture/WhatsApp Image 2025-07-03 at 08.29.50 (3).jpg",
        "/img/funiture/WhatsApp Image 2025-07-03 at 08.29.50.jpg"
      ],
      dimensions: "300cm L x 200cm W x 80cm H",
      material: "Premium linen blend, hardwood frame, dark wood legs",
      colors: ["White", "Cream", "Charcoal"],
      inStock: true,
      featured: false,
      details: {
        weight: "95kg",
        assembly: "Professional assembly recommended",
        care: "Professional cleaning recommended, vacuum regularly"
      }
    },
    {
      id: 13,
      name: "Modular Sofa ",
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
      colors: ["Cream", "Light Gray", "Natural"],
      inStock: true,
      featured: true,
      details: {
        weight: "95kg",
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
         "/img/furniture/WhatsApp Image 2025-07-03 at 08.29.50 (2).jpg",
        "/img/furniture/WhatsApp Image 2025-07-03 at 08.29.51 (2).jpg",
        "/img/furniture/WhatsApp Image 2025-07-03 at 08.29.51 (3).jpg"
      ],
      dimensions: "310cm L x 190cm W x 85cm H",
      material: "Charcoal performance fabric, solid frame",
      colors: ["Charcoal", "Dark Gray", "Black"],
      inStock: true,
      featured: true,
      details: {
        weight: "110kg",
        assembly: "Professional assembly included",
        care: "Vacuum regularly, spot clean as needed"
      }
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
      colors: ["Dark Walnut", "Medium Oak"],
      inStock: true,
      featured: true,
      details: {
        weight: "78kg",
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
      featured: true,
      details: {
        weight: "85kg",
        assembly: "Professional assembly included",
        care: "Vacuum upholstery regularly, spot clean as needed"
      }
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
      colors: ["Natural", "Light Gray", "Cream"],
      inStock: true,
      featured: true,
      details: {
        weight: "65kg",
        assembly: "Professional assembly recommended",
        care: "Professional cleaning recommended, rotate cushions regularly"
      }
    },
    {
      id: 18,
      name: " Walnut  Cabinet",
      category: "storage",
      price: 3480,
      description: "Elegant  cabinet with curved edges and rich walnut finish on brass legs",
      images: [
         "/img/furniture/WhatsApp Image 2025-07-03 at 08.29.58.jpg",
        "/img/furniture/WhatsApp Image 2025-07-03 at 08.29.59 (2).jpg",
        "/img/furniture/WhatsApp Image 2025-07-03 at 08.29.58 (2).jpg",
        "/img/furniture/WhatsApp Image 2025-07-03 at 08.29.59 (3).jpg"
      ],
      dimensions: "65cm W x 45cm D x 140cm H",
      material: "Walnut wood, brass legs, curved construction",
      colors: ["Rich Walnut", "Natural Walnut"],
      inStock: true,
      featured: false,
      details: {
        weight: "68kg",
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
       "/img/furniture/WhatsApp Image 2025-07-03 at 08.30.01 (2).jpg",
        "/img/furniture/WhatsApp Image 2025-07-03 at 08.30.01 (3).jpg",
        "/img/furniture/WhatsApp Image 2025-07-03 at 08.30.02 (2).jpg"
      ],
      dimensions: "220cm L x 90cm W x 80cm H",
      material: "Neutral linen blend, walnut wood frame",
      colors: ["Natural", "Light Gray", "Cream"],
      inStock: true,
      featured: true,
      details: {
        weight: "72kg",
        assembly: "Professional assembly recommended",
        care: "Professional cleaning recommended, rotate cushions regularly"
      }
    },
   
    {
      id: 20,
      name: " Armchair",
      category: "seating",
      price: 1850,
      description: "Luxurious armchair  with brass legs",
      images: [
        "/img/furniture/WhatsApp Image 2025-07-03 at 08.30.05 (3).jpg"
      ],
      dimensions: "80cm W x 85cm D x 75cm H",
      material: "Forest green velvet, brass legs, premium construction",
      colors: ["Forest Green", "Navy", "Charcoal"],
      inStock: true,
      featured: false,
      details: {
        weight: "45kg",
        assembly: "Minimal assembly required",
        care: "Professional velvet cleaning recommended"
      }
    },
    {
      id: 21,
      name: "Storage Cabinets",
      category: "storage",
      price: 2150,
      description: "Architectural cabinets featuring fluted oak construction ",
      images: [
        "/img/furniture/WhatsApp Image 2025-07-03 at 08.29.39 (2).jpg",
        "/img/furniture/WhatsApp Image 2025-07-03 at 08.29.39 (3).jpg"
      ],
      dimensions: "85cm W x 90cm D x 80cm H",
      material: "Fluted oak frame, neutral upholstery",
      colors: ["Natural Oak", "Dark Oak"],
      inStock: true,
      featured: false,
      details: {
        weight: "52kg",
        assembly: "Professional assembly included",
        care: "Clean wood with appropriate products, vacuum upholstery regularly"
      }
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
        "/img/furniture/WhatsApp Image 2025-07-03 at 08.30.02 (3).jpg"
      ],
      dimensions: "45cm W x 50cm D x 85cm H",
      material: "Premium upholstery, solid wood frame",
      colors: ["Natural", "Gray", "Black"],
      inStock: true,
      featured: false,
      details: {
        weight: "8kg per chair",
        assembly: "Minimal assembly required",
        care: "Vacuum regularly, spot clean as needed"
      }
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
      colors: ["Natural Wood", "Dark Walnut"],
      inStock: true,
      featured: true,
      details: {
        weight: "95kg",
        assembly: "Professional assembly included",
        care: "Clean with wood-specific products, use coasters"
      }
    },
    {
      id: 24,
      name: "Contemporary Stools",
      category: "seating",
      price: 850,
      description: "Modern stools with adjustable height and swivel function",
      images: [
        "/img/furniture/WhatsApp Image 2025-07-03 at 08.30.04.jpg",
        "/img/furniture/WhatsApp Image 2025-07-03 at 08.30.04 (3).jpg",
        "/img/furniture/WhatsApp Image 2025-07-03 at 08.30.05.jpg",
        "/img/furniture/WhatsApp Image 2025-07-03 at 08.30.05 (2).jpg"
      ],
      dimensions: "40cm W x 40cm D x 85-110cm H",
      material: "Steel frame, premium upholstery",
      colors: ["Black", "Gray", "White"],
      inStock: true,
      featured: false,
      details: {
        weight: "12kg per stool",
        assembly: "Minimal assembly required",
        care: "Wipe clean with damp cloth"
      }
    },
    {
      id: 25,
      name: "Outdoor Patio Set",
      category: "outdoor",
      price: 2400,
      description: "Weather-resistant patio furniture set with cushions",
      images: [
        "/img/furniture/WhatsApp Image 2025-07-03 at 08.30.03.jpg",
        "/img/furniture/WhatsApp Image 2025-07-03 at 08.30.04 (2).jpg"
      ],
      dimensions: "Various sizes included",
      material: "Weather-resistant materials, outdoor cushions",
      colors: ["Natural", "Gray", "Navy"],
      inStock: true,
      featured: false,
      details: {
        weight: "Various weights",
        assembly: "Professional assembly recommended",
        care: "Weather-resistant, store cushions when not in use"
      }
    }
  ];
    

  const idStr = Array.isArray(id) ? id[0] : id
  const furniture = furnitureItems.find(item => item.id === parseInt(String(idStr ?? "0"), 10));

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

  // Image navigation functions removed as they're handled by the Furniture3DViewer component

  return (
    <>
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
            {/* Enhanced 3D Image Viewer */}
            <div className="space-y-4">
              <Furniture3DViewer
                images={furniture.images}
                name={furniture.name}
                className="w-full"
              />
              
              {/* Enhanced viewing info */}
              <div className="bg-neutral-50 p-4 rounded-lg">
                <h4 className="font-semibold text-sm mb-2">Image Gallery</h4>
                <div className="text-xs text-neutral-600 space-y-1">
                  <p>• Use navigation arrows to browse through different views</p>
                  <p>• Click on thumbnails for quick image switching</p>
                  <p>• Multiple angles available for comprehensive viewing</p>
                  <p>• High-quality images showcase all furniture details</p>
                </div>
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
