import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, RotateCw, Move3D } from 'lucide-react';
import { Button } from './button';

interface Furniture3DViewerProps {
  images: string[];
  name: string;
  className?: string;
}

export const Furniture3DViewer: React.FC<Furniture3DViewerProps> = ({
  images,
  name,
  className = ""
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isRotating, setIsRotating] = useState(false);
  const [rotationX, setRotationX] = useState(0);
  const [rotationY, setRotationY] = useState(0);
  const [is3DMode, setIs3DMode] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [lastMousePos, setLastMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-rotation effect
  useEffect(() => {
    if (isRotating && is3DMode) {
      const interval = setInterval(() => {
        setRotationY(prev => (prev + 1) % 360);
      }, 50);
      return () => clearInterval(interval);
    }
  }, [isRotating, is3DMode]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!is3DMode) return;
    setIsDragging(true);
    setLastMousePos({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !is3DMode) return;

    const deltaX = e.clientX - lastMousePos.x;
    const deltaY = e.clientY - lastMousePos.y;

    setRotationY(prev => prev + deltaX * 0.5);
    setRotationX(prev => Math.max(-60, Math.min(60, prev - deltaY * 0.5)));

    setLastMousePos({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const resetRotation = () => {
    setRotationX(0);
    setRotationY(0);
  };

  const toggle3DMode = () => {
    setIs3DMode(!is3DMode);
    if (!is3DMode) {
      resetRotation();
    }
  };

  // Generate different angle views using CSS transforms
  const generateAngleViews = () => {
    const angles = [
      { name: 'Front', rotateX: 0, rotateY: 0 },
      { name: 'Right Side', rotateX: 0, rotateY: 45 },
      { name: 'Profile', rotateX: 0, rotateY: 90 },
      { name: 'Left Side', rotateX: 0, rotateY: -45 },
      { name: 'Top View', rotateX: -45, rotateY: 0 },
      { name: 'Isometric', rotateX: -20, rotateY: 45 },
      { name: 'Studio', rotateX: -15, rotateY: 25 },
      { name: 'Showroom', rotateX: -10, rotateY: -25 }
    ];

    return angles.map((angle, index) => (
      <button
        key={angle.name}
        onClick={() => {
          setRotationX(angle.rotateX);
          setRotationY(angle.rotateY);
          setIs3DMode(true);
          setIsRotating(false); // Stop auto-rotation when selecting a specific view
        }}
        className="px-3 py-1 text-xs bg-neutral-100 hover:bg-[#D3A265] hover:text-white rounded transition-colors"
      >
        {angle.name}
      </button>
    ));
  };

  return (
    <div className={`relative ${className}`}>
      {/* Main viewer container */}
      <div 
        ref={containerRef}
        className="relative aspect-square bg-neutral-100 rounded-xl overflow-hidden cursor-pointer"
        style={{ perspective: '1000px' }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {/* 3D Transform Container */}
        <div
          className="w-full h-full transition-transform duration-500 ease-out"
          style={{
            transform: is3DMode 
              ? `perspective(1200px) rotateX(${rotationX}deg) rotateY(${rotationY}deg) scale3d(0.85, 0.85, 0.85) translateZ(20px)`
              : 'translateZ(0)',
            transformStyle: 'preserve-3d',
            transformOrigin: 'center center'
          }}
        >
          {/* Main image */}
          <img
            src={images[currentImageIndex]}
            alt={`${name} - View ${currentImageIndex + 1}`}
            className="w-full h-full object-cover"
            style={{
              filter: is3DMode ? 'brightness(1.1) contrast(1.1)' : 'none'
            }}
          />

          {/* Enhanced shadow and depth effects for 3D */}
          {is3DMode && (
            <>
              {/* Main shadow overlay */}
              <div 
                className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/25 pointer-events-none"
                style={{
                  opacity: Math.abs(rotationX) / 60 * 0.4 + Math.abs(rotationY) / 180 * 0.3
                }}
              />
              {/* Depth highlight */}
              <div 
                className="absolute inset-0 bg-gradient-to-tl from-white/10 via-transparent to-transparent pointer-events-none"
                style={{
                  opacity: Math.abs(rotationX) / 60 * 0.2 + Math.abs(rotationY) / 180 * 0.15
                }}
              />
            </>
          )}
        </div>

        {/* Navigation arrows (only in 2D mode) */}
        {!is3DMode && images.length > 1 && (
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

        {/* Image counter */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
          {currentImageIndex + 1} / {images.length}
        </div>

        {/* 3D mode indicator with rotation values */}
        {is3DMode && (
          <div className="absolute top-4 left-4 bg-[#D3A265] text-white px-2 py-1 rounded text-xs font-medium">
            3D Mode
            <div className="text-[10px] opacity-75 mt-1">
              X: {rotationX}° Y: {rotationY}°
            </div>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="mt-4 space-y-3">
        {/* Mode toggle and rotation controls */}
        <div className="flex items-center justify-between">
          <Button
            onClick={toggle3DMode}
            variant={is3DMode ? "default" : "outline"}
            size="sm"
            className={is3DMode ? "bg-[#D3A265] hover:bg-[#BA8F58]" : "border-[#D3A265] text-[#D3A265] hover:bg-[#D3A265] hover:text-white"}
          >
            <Move3D size={16} className="mr-1" />
            {is3DMode ? "Exit 3D" : "3D View"}
          </Button>

          {is3DMode && (
            <div className="flex gap-2">
              <Button
                onClick={() => setIsRotating(!isRotating)}
                size="sm"
                variant="outline"
                className="border-[#D3A265] text-[#D3A265] hover:bg-[#D3A265] hover:text-white"
              >
                <RotateCw size={16} className={`mr-1 ${isRotating ? 'animate-spin' : ''}`} />
                {isRotating ? "Stop" : "Auto"}
              </Button>
              <Button
                onClick={resetRotation}
                size="sm"
                variant="outline"
                className="border-neutral-300 hover:bg-neutral-100"
              >
                Reset
              </Button>
            </div>
          )}
        </div>

        {/* Quick angle views */}
        {is3DMode && (
          <div className="space-y-2">
            <p className="text-sm font-medium text-neutral-700">Quick Views:</p>
            <div className="flex flex-wrap gap-2">
              {generateAngleViews()}
            </div>
          </div>
        )}

        {/* Thumbnail gallery */}
        <div className="grid grid-cols-5 gap-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={`aspect-square rounded-lg overflow-hidden border-2 transition-colors ${
                currentImageIndex === index ? 'border-[#D3A265]' : 'border-transparent'
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

        {/* Instructions */}
        {is3DMode && (
          <p className="text-xs text-neutral-500 text-center">
            Drag to rotate • Try Studio/Showroom views for professional angles • Auto-rotate for continuous movement
          </p>
        )}
      </div>
      {/* Enhanced viewing info */}
      <div className="bg-gradient-to-r from-neutral-50 to-neutral-100 p-4 rounded-lg border">
        <h4 className="font-semibold text-sm mb-2 text-[#8B5A2B]">Enhanced 3D Viewing Experience</h4>
        <div className="text-xs text-neutral-600 space-y-1">
          <p>• <strong>3D Mode:</strong> Explore furniture from multiple angles with realistic depth</p>
          <p>• <strong>Auto-Rotation:</strong> Continuous 360° view for complete inspection</p>
          <p>• <strong>Quick Views:</strong> Predefined angles including studio and showroom perspectives</p>
          <p>• <strong>Interactive:</strong> Drag to manually rotate and examine details</p>
          <p>• <strong>Multi-Image:</strong> Switch between different photos while in 3D mode</p>
        </div>
      </div>
    </div>
  );
};

export default Furniture3DViewer;