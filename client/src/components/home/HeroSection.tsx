import { Link } from "wouter";

const HeroSection = () => {
  return (
    <section className="pt-24 md:pt-32 lg:pt-24 relative">
      <div className="w-full h-[70vh] bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1577720580479-7d839d829c73?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080&q=80')" }}>
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        <div className="absolute inset-0 flex items-center justify-center text-center px-4">
          <div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-['Playfair_Display'] font-bold text-white mb-6">Discover Unique African Art</h1>
            <p className="text-lg md:text-xl text-white max-w-3xl mx-auto mb-8">Explore our curated collection of contemporary African artworks from talented Imbayedu artists</p>
            <Link href="/artworks" className="inline-block bg-[#D3A265] hover:bg-opacity-90 text-white font-medium px-8 py-3 rounded-sm transition duration-300">
              Shop Collection
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
