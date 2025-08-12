import Link from "next/link";

const GalleryExperience = () => {
  return (
    <section className="py-16 bg-neutral-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-['Playfair_Display'] font-bold text-neutral-900 mb-6">Experience Our Gallery</h2>
            <p className="text-neutral-700 mb-8">
              Imbayedu Art Collective is more than just an online platform. Visit our physical gallery space to experience the full impact of these exceptional artworks in person. Our knowledgeable staff is available to guide you through our collections and help you find the perfect piece for your space.
            </p>
            
            <div className="mb-8">
              <h3 className="text-xl font-['Playfair_Display'] font-semibold text-neutral-900 mb-3">Gallery Hours</h3>
              <ul className="space-y-2 text-neutral-700">
                <li className="flex justify-between">
                  <span>Monday - Friday</span>
                  <span>10:00 AM - 6:00 PM</span>
                </li>
                <li className="flex justify-between">
                  <span>Saturday</span>
                  <span>11:00 AM - 5:00 PM</span>
                </li>
                <li className="flex justify-between">
                  <span>Sunday</span>
                  <span>Closed</span>
                </li>
              </ul>
            </div>
            
            <Link 
              href="/contact" 
              className="inline-block bg-[#D3A265] hover:bg-opacity-90 text-white font-medium px-8 py-3 rounded-sm transition duration-300"
            >
              Plan Your Visit
            </Link>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <img 
              src="/img/artwork/WhatsApp Image 2025-05-15 at 09.30.06.jpeg" 
              alt="Imbayedu Artwork Display" 
              className="w-full h-64 object-cover rounded-md shadow-md"
            />
            <img 
              src="/img/artwork/WhatsApp Image 2025-05-15 at 09.30.07 (2).jpeg" 
              alt="African Art Collection" 
              className="w-full h-64 object-cover rounded-md shadow-md"
            />
            <img 
              src="/img/artwork/WhatsApp Image 2025-05-15 at 09.30.08 (1).jpeg" 
              alt="Contemporary African Painting" 
              className="w-full h-64 object-cover rounded-md shadow-md"
            />
            <img 
              src="/img/artwork/WhatsApp Image 2025-05-15 at 09.30.09.jpeg" 
              alt="Vibrant Art Exhibition" 
              className="w-full h-64 object-cover rounded-md shadow-md"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default GalleryExperience;
