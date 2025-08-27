'use client'

import React, { useState } from "react";
import { Button } from "../ui/button";
import Link from "next/link";
import { Play } from "lucide-react";

interface ImageLoaderProps {
  src: string;
  alt: string;
  aspectRatio?: "square" | "portrait" | "landscape" | "wide";
  className?: string;
}

const ImageLoader = ({ src, alt, aspectRatio = "square", className = "" }: ImageLoaderProps) => {
  const [isLoading, setIsLoading] = useState(true);

  const imageAspectRatios = {
    square: "1/1",
    portrait: "3/4",
    landscape: "4/3",
    wide: "16/9"
  };

   const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const paddingBottom = imageAspectRatios[aspectRatio as keyof typeof imageAspectRatios] || imageAspectRatios["square"];

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

const InteriorDesign = () => {
  const designServices = [
    {
      title: "Residential Design",
      description: "Crafting bespoke living spaces that reflect your personality. From luxurious penthouses to cozy family homes, we create environments that inspire.",
      imageUrl: "/img/artwork/WhatsApp Image 2025-05-21 at 15.52.14 (5).jpeg",
    },
    {
      title: "Art Curation",
      description: "Expert art placement and curation services, featuring contemporary African art that transforms spaces into personal galleries.",
      imageUrl: "/img/artwork/WhatsApp Image 2025-05-15 at 09.30.05 (1).jpeg",
    },
    {
      title: "Custom Furniture",
      description: "Bespoke furniture design that combines functionality with artistry, creating unique pieces that complement your space.",
      imageUrl: "/img/artwork/WhatsApp Image 2025-05-22 at 11.04.46 (1).jpeg"
    }
  ];

  const projectGallery = [
    {
      image: "/img/artwork/WhatsApp Image 2025-05-22 at 11.04.48.jpeg",
      title: "Marbella Villa",
      description: "The light and comfort of a Mediterranean villa"
    },
    {
      image: "/img/artwork/WhatsApp Image 2025-05-22 at 11.04.47 (1).jpeg",
      title: "Executive Office",
      description: "Modern workspace with artistic elements"
    },
    {
      image: "/img/artwork/WhatsApp Image 2025-05-22 at 11.04.46.jpeg",
      title: "Modern Mansion",
      description: "Elegant fusion of modern and traditional"
    },
    {
      image: "/img/artwork/WhatsApp Image 2025-05-22 at 11.04.43.jpeg",
      title: "Private Gallery",
      description: "Custom-designed art display space"
    },
    {
      image: "/img/artwork/WhatsApp Image 2025-05-22 at 11.04.44 (1).jpeg",
      title: "Urban Loft",
      description: "Industrial chic with artistic touches"
    },
    {
      image: "/img/artwork/WhatsApp Image 2025-05-22 at 11.04.45 (1).jpeg",
      title: "Luxurious living room",
      description: "Luxurious living with curated art collection"
    },
    {
      image: "/img/artwork/WhatsApp Image 2025-05-21 at 15.52.14 (3).jpeg",
      title: "Residential Villa",
      description: "Luxurious living with curated art collection"
    },
    {
      image: "/img/artwork/WhatsApp Image 2025-05-22 at 11.04.45.jpeg",
      title: "Luxurious Living Room",
      description: "Luxurious living with curated art collection"
    },
    {
      image: "/img/artwork/WhatsApp Image 2025-05-21 at 15.52.14.jpeg",
      title: "Contemporary Design",
      description: "Modern interior with artistic elements"
    },
    {
      image: "/img/artwork/WhatsApp Image 2025-05-21 at 15.52.13 (4).jpeg",
      title: "Elegant Space",
      description: "Sophisticated design with curated art"
    },
     {
      image: "/img/artwork/WhatsApp Image 2025-06-10 at 07.59.31.jpg",
      title: "Sunset Villa",
      description: "The light and comfort of a the villa"
    },
    {
      image: "/img/artwork/WhatsApp Image 2025-06-10 at 07.59.32.jpg",
      title: "Bedroom ",
      description: "The light and radiance of the room "
    },
      {
      image: "/img/artwork/inte4.jpeg",
      title: "Art And Design ",
      description: "The fusion of art and design "
    },
      {
      image: "/img/artwork/inte3.jpeg",
      title: "Office Space ",
      description: "The balance of light and work "
    },
      {
      image: "/img/artwork/inte2.jpeg",
      title: "Lounge Space ",
      description: "The light and radiance of the room "
    },
      {
      image: "/img/artwork/inte6.jpeg",
      title: "Cozy Corner ",
      description: "Where comfort meets style "
    },
      {
      image: "/img/artwork/WhatsApp Image 2025-05-21 at 15.52.13 (3).jpeg",
      title: "Artistic Vibes",
      description: "Nurturing creativity through design"
    },
      {
      image: "/img/artwork/WhatsApp Image 2025-05-21 at 15.52.14 (1).jpeg",
      title: "Warm Artistry ",
      description: "Living spaces inspired by art "
    },
    {
      image: "/img/artwork/WhatsApp Image 2025-05-22 at 11.04.43 (1).jpeg",
      title: "Luxury Interior",
      description: "Premium design with attention to detail"
    },
    {
      image: "/img/artwork/WhatsApp Image 2025-05-22 at 11.04.44.jpeg",
      title: "Modern Living",
      description: "Contemporary style meets comfort"
    },
   
  ];

  const values = [
    {
      title: "Artistry",
      description: "Every design is a unique masterpiece, blending aesthetics with functionality"
    },
    {
      title: "Innovation",
      description: "Pushing boundaries with contemporary design solutions"
    },
    {
      title: "Excellence",
      description: "Uncompromising attention to detail in every project"
    }
  ];

  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  
  return (
    <>
      {/* Head metadata handled by app/interior-design/page.tsx metadata export */}

      <div className="relative">
        <div className="absolute inset-0 bg-black/50 z-10"></div>
        <div className="relative h-[90vh] bg-cover bg-center" style={{ backgroundImage: `url('/img/artwork/WhatsApp Image 2025-05-22 at 11.04.43.jpeg')` }}>
          <div className="absolute inset-0 flex items-center justify-center z-20">
            <div className="text-center text-white px-4">
              <h1 className="text-5xl sm:text-6xl md:text-7xl font-['Playfair_Display'] font-bold mb-6">
                Luxury Interior Design
              </h1>
              <p className="text-xl sm:text-2xl md:text-3xl max-w-3xl mx-auto font-light">
                Where Art Meets Architecture
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-24">
        <div className="max-w-4xl mx-auto text-center mb-20">
          <h2 className="text-3xl md:text-4xl font-['Playfair_Display'] font-bold mb-8">
            Crafting Exceptional Spaces
          </h2>
          <p className="text-lg text-neutral-600 leading-relaxed">
            At Imbayedu, we believe in creating more than just beautiful spaces. Our designs are a harmonious blend of contemporary aesthetics, African artistry, and functional excellence. Each project is a unique journey in transforming spaces into living works of art.
          </p>
        </div>


         <div className="container mx-auto px-4 py-16">
  <div className="max-w-6xl mx-auto mb-24">
    <h2 className="text-3xl md:text-4xl font-['Playfair_Display'] font-bold mb-8 text-center">
      Our Design Process
    </h2>
    
    <div className="relative aspect-video bg-neutral-100 rounded-xl overflow-hidden shadow-lg">
      {!isVideoPlaying ? (
        // Video Thumbnail with Play Button
        <div className="relative w-full h-full">
          <ImageLoader
            src="/img/artwork/WhatsApp Image 2025-05-21 at 15.52.13 (4).jpeg" // Your thumbnail image
            alt="Design process video thumbnail"
            aspectRatio="wide"
            className="w-full h-full"
          />
          <button 
            className="absolute inset-0 flex items-center justify-center w-full h-full group"
            onClick={() => setIsVideoPlaying(true)}
          >
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-all duration-300"></div>
            <div className="relative z-10 flex items-center justify-center w-20 h-20 bg-[#D3A265] rounded-full hover:bg-[#BA8F58] transition-all duration-300 group-hover:scale-110">
              <Play className="text-white ml-1" size={28} fill="white" />
            </div>
          </button>
        </div>
      ) : (
        // Video Player
        <video 
          className="w-full h-full object-cover" 
          controls 
          autoPlay
          onEnded={() => setIsVideoPlaying(false)}
        >
          <source src="/img/artwork/WhatsApp Video 2025-05-22 at 17.16.46.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      )}
    </div>
    
    <p className="text-center text-neutral-600 mt-6">
      Watch how we transform spaces into works of art
    </p>
  </div>
</div>



        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-24">
          {designServices.map((service, index) => (
            <div key={index} className="group">
              <div className="aspect-[3/4] overflow-hidden mb-6">
                <ImageLoader
                  src={service.imageUrl}
                  alt={service.title}
                  aspectRatio="portrait"
                  className="transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <h3 className="text-2xl font-['Playfair_Display'] font-semibold mb-4">
                {service.title}
              </h3>
              <p className="text-neutral-600">
                {service.description}
              </p>
            </div>
          ))}
        </div>

        <div className="bg-neutral-50 py-24 px-8 rounded-xl mb-24">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-['Playfair_Display'] font-bold mb-8">
              Recent Projects
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projectGallery.map((project, index) => (
              <div key={index} className="group relative overflow-hidden rounded-xl shadow-lg">
                <div className="aspect-[4/5] overflow-hidden">
                  <ImageLoader
                    src={project.image}
                    alt={project.title}
                    aspectRatio="portrait"
                    className="transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                  <h3 className="text-white text-xl font-semibold mb-2">{project.title}</h3>
                  <p className="text-white/90 text-sm">{project.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-24">
          {values.map((value, index) => (
            <div key={index} className="text-center">
              <h3 className="text-2xl font-['Playfair_Display'] font-semibold mb-4">
                {value.title}
              </h3>
              <p className="text-neutral-600">
                {value.description}
              </p>
            </div>
          ))}
        </div>

        <div className="text-center bg-[#8B5A2B] text-white p-16 rounded-xl">
          <h2 className="text-3xl md:text-4xl font-['Playfair_Display'] font-bold mb-6">
            Begin Your Design Journey
          </h2>
          <p className="text-lg max-w-2xl mx-auto mb-8 text-neutral-300">
            Transform your space into a masterpiece that reflects your unique style and vision.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
              <Button className="bg-[#D3A265] hover:bg-[#BA8F58] text-white px-8 py-6 text-lg">
                Schedule a Consultation
              </Button>
            </Link>
            <Link href="/furniture-catalog">
              <Button variant="outline" className="border-white text-white hover:bg-white hover:text-[#8B5A2B] px-8 py-6 text-lg">
                Browse Furniture
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default InteriorDesign;