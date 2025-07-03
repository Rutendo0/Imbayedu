
import React, { useState } from 'react';
import { Link } from 'wouter';
import { Button } from './button';
import { ShoppingCart, Heart, Move3D } from 'lucide-react';

interface FurnitureCard3DProps {
  furniture: {
    id: number;
    name: string;
    price: number;
    description: string;
    images: string[];
    dimensions: string;
    material: string;
  };
}

export const FurnitureCard3D: React.FC<FurnitureCard3DProps> = ({ furniture }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  return (
    <Link 
      href={`/furniture/${furniture.id}`} 
      className="group bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
    >
      <div 
        className="relative aspect-square overflow-hidden"
        style={{ perspective: '1000px' }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* 3D Transform Container */}
        <div
          className="w-full h-full transition-transform duration-700 ease-out"
          style={{
            transform: isHovered 
              ? 'rotateY(15deg) rotateX(5deg) scale3d(1.05, 1.05, 1.05)'
              : 'rotateY(0deg) rotateX(0deg) scale3d(1, 1, 1)',
            transformStyle: 'preserve-3d'
          }}
        >
          <img
            src={furniture.images[currentImageIndex]}
            alt={furniture.name}
            className="w-full h-full object-cover transition-all duration-700"
            style={{
              filter: isHovered ? 'brightness(1.1) contrast(1.1)' : 'brightness(1) contrast(1)'
            }}
          />

          {/* Subtle shadow overlay for depth */}
          <div 
            className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/10 pointer-events-none transition-opacity duration-700"
            style={{ opacity: isHovered ? 1 : 0 }}
          />
        </div>

        {/* Image cycling on hover */}
        {furniture.images.length > 1 && isHovered && (
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
            {furniture.images.map((_, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.preventDefault();
                  setCurrentImageIndex(index);
                }}
                className={`w-2 h-2 rounded-full transition-colors ${
                  currentImageIndex === index ? 'bg-white' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        )}

        {/* 3D indicator */}
        <div className={`absolute top-2 right-2 bg-[#D3A265] text-white p-1 rounded transition-opacity duration-300 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}>
          <Move3D size={12} />
        </div>
      </div>

      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h4 className="text-lg font-semibold line-clamp-2 flex-1 mr-2">{furniture.name}</h4>
          <span className="text-lg font-bold text-[#D3A265] whitespace-nowrap">${furniture.price.toLocaleString()}</span>
        </div>
        <p className="text-neutral-600 text-sm mb-3 line-clamp-2">{furniture.description}</p>
        <div className="flex gap-2">
          <Button 
            size="sm" 
            className="flex-1 bg-[#D3A265] hover:bg-[#BA8F58] text-white text-xs"
            onClick={(e) => e.preventDefault()}
          >
            <ShoppingCart size={14} className="mr-1" />
            Add to Cart
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="border-[#D3A265] text-[#D3A265] hover:bg-[#D3A265] hover:text-white"
            onClick={(e) => e.preventDefault()}
          >
            <Heart size={14} />
          </Button>
        </div>
      </div>
    </Link>
  );
};

export default FurnitureCard3D;
