import { Link } from "wouter";
import { useState, useEffect, useRef } from "react";
import { Play, Pause } from "lucide-react";

const HeroSection = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);

  // Function to toggle play/pause
  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play()
          .then(() => {
            setIsPlaying(true);
          })
          .catch(error => {
            console.error("Video playback failed:", error);
            setIsPlaying(false);
          });
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Handle when video has loaded
  const handleVideoLoaded = () => {
    setVideoLoaded(true);
  };

  return (
    <section className="pt-24 md:pt-32 lg:pt-24 relative">
      <div className="w-full h-[80vh] overflow-hidden relative">
        {/* Static background image (shown before video plays) */}
        <div 
          className={`absolute inset-0 bg-cover bg-center transition-opacity duration-500 ${isPlaying ? 'opacity-0' : 'opacity-100'}`}
          style={{ backgroundImage: "url('/img/artwork/WhatsApp Image 2025-05-15 at 09.30.08.jpeg')" }}
        />
        
        {/* Video Background */}
        <video 
          ref={videoRef}
          muted
          loop
          playsInline
          onLoadedData={handleVideoLoaded}
          className={`absolute w-full h-full object-cover transition-opacity duration-500 ${isPlaying ? 'opacity-100' : 'opacity-0'}`}
        >
          <source src="/video/WhatsApp Video 2025-05-15 at 12.22.31.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        
        {/* Dark overlay for better text visibility */}
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        
        {/* Play/Pause button */}
        {videoLoaded && (
          <button 
            onClick={togglePlay}
            className="absolute bottom-8 right-8 z-20 bg-white bg-opacity-20 hover:bg-opacity-30 backdrop-blur-sm text-white rounded-full p-4 transition-all duration-300"
            aria-label={isPlaying ? "Pause video" : "Play video"}
          >
            {isPlaying ? <Pause size={24} /> : <Play size={24} />}
          </button>
        )}
        
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
