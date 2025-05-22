
import { Helmet } from "react-helmet-async";
import { Button } from "../components/ui/button";
import { Link } from "wouter";

const InteriorDesign = () => {
  const designServices = [
    {
      title: "Residential Design",
      description: "Crafting bespoke living spaces that reflect your personality. From luxurious penthouses to cozy family homes, we create environments that inspire.",
      imageUrl: "/img/artwork/WhatsApp Image 2025-05-21 at 15.52.10.jpeg"
    },
    {
      title: "Art Curation",
      description: "Expert art placement and curation services, featuring contemporary African art that transforms spaces into personal galleries.",
      imageUrl: "/img/artwork/WhatsApp Image 2025-05-21 at 15.52.13 (2).jpeg"
    },
    {
      title: "Custom Furniture",
      description: "Bespoke furniture design that combines functionality with artistry, creating unique pieces that complement your space.",
      imageUrl: "/img/artwork/WhatsApp Image 2025-05-21 at 15.52.13.jpeg"
    }
  ];

  const projectGallery = [
    {
      image: "/img/artwork/WhatsApp Image 2025-05-21 at 15.52.14 (1).jpeg",
      title: "Modern Luxury Villa"
    },
    {
      image: "/img/artwork/WhatsApp Image 2025-05-21 at 15.52.14 (2).jpeg",
      title: "Contemporary Gallery Space"
    },
    {
      image: "/img/artwork/WhatsApp Image 2025-05-21 at 15.52.14 (3).jpeg",
      title: "Artistic Living Room"
    }
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

  return (
    <>
      <Helmet>
        <title>Luxury Interior Design Services - Imbayedu Art Gallery</title>
        <meta name="description" content="Transform your space with Imbayedu's professional interior design and art curation services" />
      </Helmet>

      <div className="relative">
        <div className="absolute inset-0 bg-black/50 z-10"></div>
        <div className="relative h-[90vh] bg-cover bg-center" style={{ backgroundImage: `url('/img/artwork/WhatsApp Image 2025-05-21 at 15.52.14 (4).jpeg')` }}>
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-24">
          {designServices.map((service, index) => (
            <div key={index} className="group">
              <div className="aspect-[3/4] overflow-hidden mb-6">
                <img
                  src={service.imageUrl}
                  alt={service.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {projectGallery.map((project, index) => (
              <div key={index} className="group relative overflow-hidden">
                <div className="aspect-[4/5] overflow-hidden">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                  <h3 className="text-white text-xl font-semibold">{project.title}</h3>
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

        <div className="text-center bg-neutral-900 text-white p-16 rounded-xl">
          <h2 className="text-3xl md:text-4xl font-['Playfair_Display'] font-bold mb-6">
            Begin Your Design Journey
          </h2>
          <p className="text-lg max-w-2xl mx-auto mb-8 text-neutral-300">
            Transform your space into a masterpiece that reflects your unique style and vision.
          </p>
          <Link href="/contact">
            <Button className="bg-[#D3A265] hover:bg-[#BA8F58] text-white px-8 py-6 text-lg">
              Schedule a Consultation
            </Button>
          </Link>
        </div>
      </div>
    </>
  );
};

export default InteriorDesign;
