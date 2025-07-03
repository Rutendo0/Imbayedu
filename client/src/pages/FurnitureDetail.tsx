
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
      id: 8,
      name: "Luxury Bed Frame",
      category: "bedroom",
      price: 2800,
      description: "King-size bed with upholstered headboard featuring channel tufting and solid wood base. A statement piece that combines comfort with sophisticated design.",
      images: [
        "/attached_assets/WhatsApp Image 2025-07-03 at 08.29.40_3f0bd6a4_1751564818212.jpg",
        "/attached_assets/WhatsApp Image 2025-07-03 at 08.29.40_57059051_1751564818212.jpg",
        "/attached_assets/WhatsApp Image 2025-07-03 at 08.29.40_ead737ac_1751564818213.jpg",
        "/attached_assets/WhatsApp Image 2025-07-03 at 08.29.41_cc45739f_1751564818213.jpg",
        "/attached_assets/WhatsApp Image 2025-07-03 at 08.29.41_eda4682e_1751564818214.jpg"
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
