import { Link } from "wouter";
import { useEffect, useRef } from "react";

const HeroSection = () => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Ensure the video plays automatically when loaded
    if (videoRef.current) {
      videoRef.current.play().catch(error => {
        console.error("Video autoplay was prevented:", error);
      });
    }
  }, []);

  return (
    <section className="pt-24 md:pt-32 lg:pt-24 relative">
      <div className="w-full h-[80vh] overflow-hidden relative">
        {/* Video Background */}
        <video 
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          className="absolute w-full h-full object-cover"
        >
          <source src="/video/WhatsApp Video 2025-05-15 at 12.22.31.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        
        {/* Dark overlay for better text visibility */}
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        
        {/* Content */}
        <div className="absolute inset-0 flex items-center justify-center text-center px-4">
          <div className="z-10">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-['Playfair_Display'] font-bold text-white mb-6 drop-shadow-lg">
              Discover Unique African Art
            </h1>
            <p className="text-lg md:text-xl text-white max-w-3xl mx-auto mb-10 drop-shadow-md">
              Explore our curated collection of contemporary African artworks from talented Imbayedu artists
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/artworks" className="inline-block bg-[#D3A265] hover:bg-opacity-90 text-white font-medium px-8 py-4 rounded-sm transition duration-300">
                Shop Collection
              </Link>
              <Link href="/artists" className="inline-block bg-transparent border-2 border-white hover:bg-white hover:text-black text-white font-medium px-8 py-4 rounded-sm transition duration-300">
                Meet Our Artists
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
