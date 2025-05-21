
import { Helmet } from "react-helmet-async";
import { Button } from "../components/ui/button";
import { Link } from "wouter";

const InteriorDesign = () => {
  const designs = [
    {
      title: "Modern Art Space Design",
      imageUrl: "/img/artwork/WhatsApp Image 2025-05-15 at 09.30.03.jpeg",
      description: "Contemporary gallery space with optimal lighting"
    },
    {
      title: "Cultural Exhibition Area",
      imageUrl: "/img/artwork/WhatsApp Image 2025-05-15 at 09.30.04.jpeg", 
      description: "Gallery-inspired interior with cultural elements"
    },
    {
      title: "Artist Studio Space",
      imageUrl: "/img/artwork/WhatsApp Image 2025-05-15 at 09.30.05.jpeg",
      description: "Creative studio optimized for artists"
    }
  ];

  return (
    <>
      <Helmet>
        <title>Interior Design Services - Imbayedu Art Gallery</title>
        <meta name="description" content="Transform your space with Imbayedu's professional interior design services" />
      </Helmet>
      
      <div className="pt-24 md:pt-32">
        <div className="bg-neutral-100 py-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl md:text-4xl font-['Playfair_Display'] font-bold text-neutral-900 text-center mb-4">
              Interior Design Services
            </h1>
            <p className="text-center text-neutral-600 max-w-2xl mx-auto">
              Transform your space with our professional interior design services. We specialize in creating harmonious environments that blend art with functionality.
            </p>
          </div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {designs.map((design, index) => (
              <div key={index} className="group">
                <div className="aspect-[4/3] overflow-hidden bg-neutral-100 rounded-lg mb-4">
                  <img 
                    src={design.imageUrl}
                    alt={design.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>
                <h3 className="text-xl font-semibold text-neutral-900 mb-2">
                  {design.title}
                </h3>
                <p className="text-neutral-600">
                  {design.description}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <h2 className="text-2xl md:text-3xl font-['Playfair_Display'] font-bold text-neutral-900 mb-6">
              Our Design Process
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-6 bg-neutral-50 rounded-lg">
                <h3 className="text-xl font-semibold mb-4">1. Consultation</h3>
                <p className="text-neutral-600">We begin with understanding your vision and requirements for the space.</p>
              </div>
              <div className="p-6 bg-neutral-50 rounded-lg">
                <h3 className="text-xl font-semibold mb-4">2. Design Development</h3>
                <p className="text-neutral-600">Creation of detailed design concepts and space planning.</p>
              </div>
              <div className="p-6 bg-neutral-50 rounded-lg">
                <h3 className="text-xl font-semibold mb-4">3. Implementation</h3>
                <p className="text-neutral-600">Execution of the design plan with careful attention to detail.</p>
              </div>
            </div>
          </div>

          <div className="mt-16 text-center">
            <Link href="/contact">
              <Button className="bg-[#D3A265] hover:bg-opacity-90 text-white">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default InteriorDesign;
