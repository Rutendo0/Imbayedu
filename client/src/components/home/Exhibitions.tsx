
import React from 'react';

const Exhibitions = () => {
  const exhibitions = [
    {
      id: 1,
      title: "Contemporary African Expressions",
      date: "June 15-30, 2024",
      venue: "National Gallery of Zimbabwe, Harare",
      description: "A showcase of emerging contemporary African artists exploring themes of identity and culture."
    },
    {
      id: 2,
      title: "Urban African Art Festival",
      date: "July 10-20, 2024",
      venue: "Bulawayo Art Gallery",
      description: "Exhibition featuring urban contemporary artworks from Zimbabwe's leading artists."
    },
    {
      id: 3,
      title: "Traditional Meets Modern",
      date: "August 5-15, 2024",
      venue: "Marondera Arts Center",
      description: "A unique exhibition bridging traditional African art forms with contemporary expressions."
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-['Playfair_Display'] font-bold text-neutral-900 mb-4">
            Upcoming Exhibitions
          </h2>
          <p className="text-neutral-600 max-w-3xl mx-auto">
            Visit our exhibitions to experience African art in person and meet our talented artists
          </p>
        </div>
        
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {exhibitions.map((exhibition) => (
            <div 
              key={exhibition.id}
              className="bg-neutral-50 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <h3 className="text-xl font-['Playfair_Display'] font-semibold text-neutral-900 mb-2">
                {exhibition.title}
              </h3>
              <div className="text-[#D3A265] font-medium mb-2">{exhibition.date}</div>
              <div className="text-neutral-700 font-medium mb-3">{exhibition.venue}</div>
              <p className="text-neutral-600">{exhibition.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Exhibitions;
