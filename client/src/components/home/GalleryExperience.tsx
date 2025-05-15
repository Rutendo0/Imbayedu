import { Link } from "wouter";

const GalleryExperience = () => {
  return (
    <section className="py-16 bg-neutral-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-['Playfair_Display'] font-bold text-neutral-900 mb-6">Experience Our Gallery</h2>
            <p className="text-neutral-700 mb-8">
              Imbayedu Art Gallery is more than just an online platform. Visit our physical gallery space to experience the full impact of these exceptional artworks in person. Our knowledgeable staff is available to guide you through our collections and help you find the perfect piece for your space.
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
              src="https://images.unsplash.com/photo-1551913902-c92207136625?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80" 
              alt="Gallery Interior" 
              className="w-full rounded-md shadow-md"
            />
            <img 
              src="https://images.unsplash.com/photo-1470058869958-2a77ade41c02?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80" 
              alt="Art Viewing Experience" 
              className="w-full rounded-md shadow-md"
            />
            <img 
              src="https://images.unsplash.com/photo-1515169067868-5387ec356754?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80" 
              alt="Gallery Event" 
              className="w-full rounded-md shadow-md"
            />
            <img 
              src="https://images.unsplash.com/photo-1513364776144-60967b0f800f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80" 
              alt="Artist Studio" 
              className="w-full rounded-md shadow-md"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default GalleryExperience;
