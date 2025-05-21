import { Helmet } from "react-helmet-async";
import { Button } from "../components/ui/button";
import { Link } from "wouter";

const InteriorDesign = () => {
  const designServices = [
    {
      title: "Art Curation & Installation",
      description: "Expert art placement and curation services to enhance your space with African contemporary art",
      imageUrl: "/img/artwork/WhatsApp Image 2025-05-15 at 09.30.03.jpeg"
    },
    {
      title: "Gallery & Exhibition Design",
      description: "Professional design services for galleries, museums, and exhibition spaces",
      imageUrl: "/img/artwork/WhatsApp Image 2025-05-15 at 09.30.04.jpeg"
    },
    {
      title: "Residential Art Consultation",
      description: "Personalized art selection and placement for private residences",
      imageUrl: "/img/artwork/WhatsApp Image 2025-05-15 at 09.30.05.jpeg"
    }
  ];

  const processSteps = [
    {
      number: "01",
      title: "Initial Consultation",
      description: "We begin with understanding your vision, space requirements, and artistic preferences"
    },
    {
      number: "02",
      title: "Design Development",
      description: "Our team creates a detailed design proposal including art selection and placement"
    },
    {
      number: "03",
      title: "Implementation",
      description: "Professional installation and styling of your selected artworks"
    }
  ];

  return (
    <>
      <Helmet>
        <title>Interior Design Services - Imbayedu Art Gallery</title>
        <meta name="description" content="Transform your space with Imbayedu's professional interior design and art curation services" />
      </Helmet>

      <div className="relative">
        <div className="absolute inset-0 bg-neutral-900/40 z-10"></div>
        <div className="relative h-[60vh] bg-cover bg-center" style={{ backgroundImage: `url('/img/artwork/WhatsApp Image 2025-05-15 at 09.30.08 (2).jpeg')` }}>
          <div className="absolute inset-0 flex items-center justify-center z-20">
            <div className="text-center text-white">
              <h1 className="text-4xl md:text-5xl font-['Playfair_Display'] font-bold mb-4">
                Interior Design
              </h1>
              <p className="text-lg md:text-xl max-w-2xl mx-auto">
                Where Spaces Speak and Stories Breathe
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="prose prose-lg mx-auto mb-16 text-center max-w-3xl">
          <p className="text-neutral-800 mb-6">
            At Imbayedu, interior design is not mere arrangement—it is alchemy. It is the sacred transformation of walls and floors into whispers of culture, warmth, and identity. Each room we touch becomes a living narrative—crafted with intention, layered with memory, and rooted in the rhythm of African elegance.
          </p>
          <p className="text-neutral-800 mb-6">
            We approach interiors as immersive experiences—spaces that stir the soul and serve the spirit. Our designs honor heritage while embracing innovation, blending ancestral wisdom with future-forward vision. Whether sculpting silence into a sanctuary or shaping color into conversation, our interiors are vessels of meaning.
          </p>
          <p className="text-neutral-800 mb-6">
            From curated homes to dynamic commercial realms, we bring a human-centered ethos to every surface, texture, and light beam. We believe in creating spaces that listen, spaces that hold, and spaces that rise with the dreams of those who dwell within them.
          </p>
          <h2 className="text-2xl font-['Playfair_Display'] font-bold text-neutral-900 mt-8 mb-4">
            Timeless. Textured. Thoughtful.
          </h2>
          <p className="text-neutral-800">
            At the heart of our practice is a belief: that good design elevates, and great design remembers. We do not chase trends—we cultivate environments that endure. Spaces where design breathes, and culture lives.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {designServices.map((service, index) => (
            <div key={index} className="group">
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

        <div className="mt-24">
          <h2 className="text-3xl font-['Playfair_Display'] font-bold text-center mb-12">
            Our Design Process
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {processSteps.map((step, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold text-[#D3A265] mb-4">{step.number}</div>
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-neutral-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-24 text-center">
          <h2 className="text-3xl font-['Playfair_Display'] font-bold mb-6">
            Ready to Transform Your Space?
          </h2>
          <p className="text-neutral-600 max-w-2xl mx-auto mb-8">
            Let our team of expert designers help you create a space that reflects your style and showcases the beauty of African contemporary art.
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