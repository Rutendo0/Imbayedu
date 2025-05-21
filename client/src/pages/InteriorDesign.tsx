
import { Helmet } from "react-helmet";

const InteriorDesign = () => {
  return (
    <>
      <Helmet>
        <title>Interior Design Services - Imbayedu Art Gallery</title>
        <meta name="description" content="Transform your space with Imbayedu's professional interior design services. We combine African art with contemporary design principles." />
      </Helmet>
      
      <div className="pt-24 md:pt-32">
        <div className="bg-neutral-100 py-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl md:text-4xl font-['Playfair_Display'] font-bold text-neutral-900 text-center">
              Interior Design Services
            </h1>
          </div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <h2 className="text-2xl md:text-3xl font-['Playfair_Display'] font-bold text-neutral-900 mb-6">
                Transform Your Space
              </h2>
              <p className="text-neutral-700 mb-4">
                At Imbayedu, we offer professional interior design services that blend contemporary African art with modern design principles. Our expert designers work closely with you to create spaces that reflect your unique style while celebrating African culture and aesthetics.
              </p>
              <ul className="list-disc pl-6 text-neutral-700 space-y-3 mb-8">
                <li>Art Placement Consultation</li>
                <li>Color Scheme Development</li>
                <li>Space Planning</li>
                <li>Custom Art Commissions</li>
                <li>Full Room Design</li>
              </ul>
              <button className="bg-[#D3A265] hover:bg-opacity-90 text-white font-medium px-8 py-3 rounded-sm transition duration-300">
                Schedule Consultation
              </button>
            </div>
            <div>
              <img 
                src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80" 
                alt="Interior Design Services" 
                className="rounded-md shadow-lg w-full h-auto"
              />
            </div>
          </div>

          <div className="text-center mb-16">
            <h2 className="text-2xl md:text-3xl font-['Playfair_Display'] font-bold text-neutral-900 mb-6">
              Our Design Process
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
              <div className="p-6 bg-neutral-50 rounded-lg">
                <h3 className="text-xl font-semibold mb-4">1. Consultation</h3>
                <p className="text-neutral-700">Initial meeting to understand your vision, style preferences, and space requirements.</p>
              </div>
              <div className="p-6 bg-neutral-50 rounded-lg">
                <h3 className="text-xl font-semibold mb-4">2. Design Development</h3>
                <p className="text-neutral-700">Creation of mood boards, color schemes, and space planning concepts.</p>
              </div>
              <div className="p-6 bg-neutral-50 rounded-lg">
                <h3 className="text-xl font-semibold mb-4">3. Implementation</h3>
                <p className="text-neutral-700">Execution of the design plan, including art selection and placement.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default InteriorDesign;
