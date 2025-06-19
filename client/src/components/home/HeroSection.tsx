
import { Link } from "wouter";

const HeroSection = () => {
  return (
    <section className="h-screen relative overflow-hidden">
      {/* Full screen background image */}
      <div 
        className="absolute inset-0 bg-cover bg-center transition-opacity duration-500"
        style={{ 
          backgroundImage: "url('/img/artwork/WhatsApp Image 2025-05-15 at 09.30.05 (2).jpeg')",
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      />
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-30" />
      
      {/* Content */}
      <div className="relative h-full flex items-center justify-center text-center px-4">
        <div>
          <h1 className="text-5xl md:text-7xl font-['Playfair_Display'] font-bold text-white mb-8">
            African Art Collective
          </h1>
          <Link 
            href="/artworks" 
            className="inline-block bg-[#D3A265] hover:bg-opacity-90 text-white text-lg font-medium px-12 py-4 transition duration-300"
          >
            View Collection
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
