import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface FurnitureGalleryProps {
  images: string[];
  name: string;
  className?: string;
}

export const Furniture3DViewer: React.FC<FurnitureGalleryProps> = ({
  images,
  name,
  className = ""
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className={`relative ${className}`}>
      {/* Main image container */}
      <div className="relative aspect-square bg-neutral-100 rounded-xl overflow-hidden">
        {/* Main image */}
        <img
          src={images[currentImageIndex]}
          alt={`${name} - View ${currentImageIndex + 1}`}
          className="w-full h-full object-cover"
        />

        {/* Navigation arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 transition-colors shadow-md"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 transition-colors shadow-md"
            >
              <ChevronRight size={20} />
            </button>
          </>
        )}

        {/* Image counter */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
          {currentImageIndex + 1} / {images.length}
        </div>
      </div>

      {/* Thumbnail gallery */}
      <div className="mt-4">
        <div className="grid grid-cols-5 gap-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={`aspect-square rounded-lg overflow-hidden border-2 transition-colors ${
                currentImageIndex === index ? 'border-[#D3A265]' : 'border-neutral-300 hover:border-[#D3A265]'
              }`}
            >
              <img
                src={image}
                alt={`${name} thumbnail ${index + 1}`}
                className="w-full h-full object-cover hover:opacity-80 transition-opacity"
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Furniture3DViewer;