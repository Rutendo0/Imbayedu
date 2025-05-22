
import { Helmet } from "react-helmet-async";
import { Button } from "../components/ui/button";
import { Link } from "wouter";

const InteriorDesign = () => {
  const designServices = [
    {
      title: "Residential Design",
      description: "Transform your living spaces with our bespoke residential design services. We create harmonious environments that reflect your personality and lifestyle.",
      imageUrl: "/img/artwork/WhatsApp Image 2025-05-21 at 15.52.10.jpeg"
    },
    {
      title: "Commercial Spaces",
      description: "Elevate your business environment with our commercial interior design solutions that balance aesthetics with functionality.",
      imageUrl: "/img/artwork/WhatsApp Image 2025-05-21 at 15.52.13 (1).jpeg"
    },
    {
      title: "Art Curation",
      description: "Expert art placement and curation services to enhance your space with African contemporary art",
      imageUrl: "/img/artwork/WhatsApp Image 2025-05-21 at 15.52.13 (2).jpeg"
    },
    {
      title: "Luxury Styling",
      description: "Exclusive styling services that bring sophistication and elegance to your interior spaces",
      imageUrl: "/img/artwork/WhatsApp Image 2025-05-21 at 15.52.13 (3).jpeg"
    },
    {
      title: "Space Planning",
      description: "Strategic space planning that maximizes functionality while maintaining aesthetic harmony",
      imageUrl: "/img/artwork/WhatsApp Image 2025-05-21 at 15.52.13 (4).jpeg"
    },
    {
      title: "Custom Furniture",
      description: "Bespoke furniture design and selection to create unique, personalized spaces",
      imageUrl: "/img/artwork/WhatsApp Image 2025-05-21 at 15.52.13.jpeg"
    }
  ];

  const processSteps = [
    {
      number: "01",
      title: "Discovery & Consultation",
      description: "We begin with an in-depth consultation to understand your vision, lifestyle, and specific requirements for the space"
    },
    {
      number: "02",
      title: "Concept Development",
      description: "Our team creates detailed design concepts, including space planning, material selection, and artistic elements"
    },
    {
      number: "03",
      title: "Design Presentation",
      description: "We present comprehensive design proposals with detailed visualizations and material selections"
    },
    {
      number: "04",
      title: "Implementation",
      description: "Expert execution of the approved design, including project management and installation"
    }
  ];

  const expertise = [
    "Space Planning & Layout Design",
    "Color & Material Consultation",
    "Custom Furniture Design",
    "Art Curation & Placement",
    "Lighting Design",
    "Textile & Fabric Selection",
    "Project Management",
    "Sustainable Design Solutions"
  ];

  return (
    <>
      <Helmet>
        <title>Luxury Interior Design Services - Imbayedu Art Gallery</title>
        <meta name="description" content="Transform your space with Imbayedu's professional interior design and art curation services" />
      </Helmet>

      <div className="relative">
        <div className="absolute inset-0 bg-neutral-900/40 z-10"></div>
        <div className="relative h-[80vh] bg-cover bg-center" style={{ backgroundImage: `url('/img/artwork/WhatsApp Image 2025-05-15 at 09.30.08 (2).jpeg')` }}>
          <div className="absolute inset-0 flex items-center justify-center z-20">
            <div className="text-center text-white px-4">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-['Playfair_Display'] font-bold mb-6">
                Luxury Interior Design
              </h1>
              <p className="text-lg sm:text-xl md:text-2xl max-w-3xl mx-auto">
                Where Art Meets Architecture | Creating Timeless Spaces
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="prose prose-lg mx-auto mb-16 text-center max-w-3xl">
          <div className="bg-neutral-50 p-8 rounded-lg shadow-sm">
            <h2 className="text-2xl font-['Playfair_Display'] font-bold text-neutral-900 mb-4">
              Crafting Exceptional Spaces
            </h2>
            <p className="text-neutral-800">
              At Imbayedu, we believe in creating spaces that transcend mere aesthetics. Our approach combines artistic vision with functional design, creating environments that inspire and elevate daily living.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-16">
          {designServices.map((service, index) => (
            <div key={index} className="group bg-white p-6 rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl">
              <div className="aspect-[4/3] overflow-hidden rounded-lg mb-4">
                <img
                  src={service.imageUrl}
                  alt={service.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <h3 className="text-xl font-semibold text-neutral-900 mb-2">
                {service.title}
              </h3>
              <p className="text-neutral-600">
                {service.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-24 bg-neutral-50 p-12 rounded-lg">
          <h2 className="text-3xl font-['Playfair_Display'] font-bold text-center mb-12">
            Our Design Process
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {processSteps.map((step, index) => (
              <div key={index} className="text-center bg-white p-6 rounded-lg shadow-sm">
                <div className="text-4xl font-bold text-[#D3A265] mb-4">{step.number}</div>
                <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                <p className="text-neutral-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-24">
          <h2 className="text-3xl font-['Playfair_Display'] font-bold text-center mb-12">
            Our Expertise
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {expertise.map((item, index) => (
              <div key={index} className="bg-white p-4 text-center rounded-lg shadow-sm">
                <p className="text-neutral-800">{item}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-24 text-center bg-neutral-50 p-12 rounded-lg">
          <h2 className="text-3xl font-['Playfair_Display'] font-bold mb-6">
            Begin Your Design Journey
          </h2>
          <p className="text-neutral-600 max-w-2xl mx-auto mb-8">
            Transform your space into a masterpiece that reflects your unique style and vision. Our team of expert designers is ready to bring your dreams to life.
          </p>
          <Link href="/contact">
            <Button className="bg-[#D3A265] hover:bg-opacity-90 text-white px-8 py-6 text-lg">
              Schedule a Consultation
            </Button>
          </Link>
        </div>
      </div>
    </>
  );
};

export default InteriorDesign;
