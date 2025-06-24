import { Helmet } from "react-helmet";
import { Link } from "wouter";

const About = () => {
  return (
    <>
      <Helmet>
        <title>About Imbayedu Art Collective</title>
        <meta name="description" content="Learn about Imbayedu Art Collective, our mission to showcase exceptional contemporary African art, and our commitment to supporting talented artists." />
      </Helmet>
      
      <div className="pt-24 md:pt-32">
        <div className="bg-neutral-100 py-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl md:text-4xl font-['Playfair_Display'] font-bold text-neutral-900 text-center">
              About Imbayedu
            </h1>
          </div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <h2 className="text-2xl md:text-3xl font-['Playfair_Display'] font-bold text-neutral-900 mb-6">
                Our Story
              </h2>
              <p className="text-neutral-700 mb-4">
                Imbayedu Art Collective was founded in 2018 with a singular mission: to showcase the extraordinary talent of contemporary African artists to a global audience.
              </p>
              <p className="text-neutral-700 mb-4">
                The name "Imbayedu" draws inspiration from various African languages, embodying the concepts of heritage, creativity, and cultural exchange. We believe that art transcends boundaries and has the power to connect people across different backgrounds and experiences.
              </p>
              <p className="text-neutral-700">
                What began as a small passion project has grown into a respected gallery representing artists from across the African continent and diaspora. We're proud to provide a platform for both established and emerging artists, helping to elevate their voices and share their unique perspectives with art lovers worldwide.
              </p>
            </div>
            <div>
              <img 
                src="https://images.unsplash.com/photo-1551913902-c92207136625?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80" 
                alt="Imbayedu Art Collective Interior" 
                className="rounded-md shadow-lg w-full h-auto"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
            <div className="order-2 lg:order-1">
              <img 
                src="https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80" 
                alt="Artist at work in studio" 
                className="rounded-md shadow-lg w-full h-auto"
              />
            </div>
            <div className="order-1 lg:order-2">
              <h2 className="text-2xl md:text-3xl font-['Playfair_Display'] font-bold text-neutral-900 mb-6">
                Our Mission
              </h2>
              <p className="text-neutral-700 mb-4">
                At Imbayedu, we are dedicated to promoting the rich diversity of contemporary African art and supporting the artists who create it. We strive to:
              </p>
              <ul className="list-disc pl-6 text-neutral-700 space-y-3 mb-4">
                <li>Showcase exceptional artwork that challenges perceptions and sparks dialogue</li>
                <li>Provide a supportive platform for both established and emerging African artists</li>
                <li>Create meaningful connections between artists and collectors</li>
                <li>Educate our audience about the cultural contexts and significance of the artwork we represent</li>
                <li>Contribute to the global appreciation and understanding of contemporary African art</li>
              </ul>
              <p className="text-neutral-700">
                We believe that art has the power to transform spaces, perspectives, and lives. Through our curated collections, we aim to bring the vibrancy, complexity, and beauty of African artistic expression into homes and spaces around the world.
              </p>
            </div>
          </div>

          <div className="bg-neutral-100 p-8 rounded-lg mb-16">
            <h2 className="text-2xl md:text-3xl font-['Playfair_Display'] font-bold text-neutral-900 mb-6 text-center">
              Visit Our Gallery
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <p className="text-neutral-700 mb-4">
                  Experience our artwork in person at our gallery space in Johannesburg. Our knowledgeable staff is available to guide you through our collections and help you find the perfect piece for your space.
                </p>
                <div className="mb-6">
                  <h3 className="font-semibold text-neutral-900 mb-2">Location</h3>
                  <p className="text-neutral-700">123 Art Collective Lane<br />Johannesburg, South Africa</p>
                </div>
                <div className="mb-6">
                  <h3 className="font-semibold text-neutral-900 mb-2">Gallery Hours</h3>
                  <ul className="text-neutral-700">
                    <li>Monday - Friday: 10:00 AM - 6:00 PM</li>
                    <li>Saturday: 11:00 AM - 5:00 PM</li>
                    <li>Sunday: Closed</li>
                  </ul>
                </div>
                <Link href="/contact">
                  <button className="bg-[#D3A265] hover:bg-opacity-90 text-white font-medium px-6 py-3 rounded-sm transition duration-300">
                    Contact Us
                  </button>
                </Link>
              </div>
              <div>
                <img 
                  src="https://images.unsplash.com/photo-1572947650440-e8a97ef053b2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80" 
                  alt="Inside Imbayedu Gallery" 
                  className="rounded-md shadow-lg w-full h-auto"
                />
              </div>
            </div>
          </div>

          <div className="text-center">
            <h2 className="text-2xl md:text-3xl font-['Playfair_Display'] font-bold text-neutral-900 mb-6">
              Explore Our Collection
            </h2>
            <p className="text-neutral-700 mb-8 max-w-3xl mx-auto">
              Discover the exceptional artwork in our collection. From vibrant paintings to striking sculptures, we offer a diverse range of contemporary African art for every taste and space.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/artworks">
                <button className="bg-[#D3A265] hover:bg-opacity-90 text-white font-medium px-8 py-3 rounded-sm transition duration-300">
                  Browse Artworks
                </button>
              </Link>
              <Link href="/artists">
                <button className="border border-neutral-900 text-neutral-900 hover:bg-neutral-900 hover:text-white font-medium px-8 py-3 rounded-sm transition duration-300">
                  Meet Our Artists
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default About;
