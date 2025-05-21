
import React from 'react';
import { Button } from '../ui/button';
import { Calendar, Clock, MapPin, Users, Ticket } from 'lucide-react';
import { Link } from 'wouter';

const Exhibitions = () => {
  const exhibitions = [
    {
      id: 1,
      title: "Contemporary African Expressions",
      date: "June 15-30, 2024",
      time: "10:00 AM - 6:00 PM",
      venue: "National Gallery of Zimbabwe, Harare",
      description: "A showcase of emerging contemporary African artists exploring themes of identity and culture.",
      entryFee: "$10",
      artists: [
        "Zinhle Mkhize",
        "Koffi Adama",
        "Thabo Mbeki"
      ],
      address: "20 Julius Nyerere Way, Harare",
      specialNotes: "Opening reception on June 15th at 6:00 PM"
    },
    {
      id: 2,
      title: "Urban African Art Festival",
      date: "July 10-20, 2024",
      time: "11:00 AM - 7:00 PM",
      venue: "Bulawayo Art Gallery",
      description: "Exhibition featuring urban contemporary artworks from Zimbabwe's leading artists.",
      entryFee: "$15",
      artists: [
        "O'Neal Tanaka Maisiri",
        "Thabo Mbeki",
        "Zinhle Mkhize"
      ],
      address: "95 Main Street, Bulawayo",
      specialNotes: "Live art demonstrations every weekend"
    },
    {
      id: 3,
      title: "Traditional Meets Modern",
      date: "August 5-15, 2024",
      time: "10:00 AM - 5:00 PM",
      venue: "Marondera Arts Center",
      description: "A unique exhibition bridging traditional African art forms with contemporary expressions.",
      entryFee: "$8",
      artists: [
        "Koffi Adama",
        "O'Neal Tanaka Maisiri",
      ],
      address: "45 The Green, Marondera",
      specialNotes: "Artist talks every Wednesday at 2:00 PM"
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-['Playfair_Display'] font-bold text-neutral-900 mb-6">
            Upcoming Exhibitions
          </h2>
          <p className="text-neutral-600 max-w-3xl mx-auto text-lg">
            Visit our exhibitions to experience African art in person and meet our talented artists
          </p>
        </div>
        
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {exhibitions.map((exhibition) => (
            <div 
              key={exhibition.id}
              className="bg-neutral-50 p-8 rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
            >
              <h3 className="text-xl font-['Playfair_Display'] font-semibold text-neutral-900 mb-4">
                {exhibition.title}
              </h3>
              
              <div className="space-y-3 mb-4">
                <div className="flex items-center text-neutral-700">
                  <Calendar className="w-5 h-5 mr-2 text-[#D3A265]" />
                  <span>{exhibition.date}</span>
                </div>
                
                <div className="flex items-center text-neutral-700">
                  <Clock className="w-5 h-5 mr-2 text-[#D3A265]" />
                  <span>{exhibition.time}</span>
                </div>
                
                <div className="flex items-start text-neutral-700">
                  <MapPin className="w-5 h-5 mr-2 mt-1 text-[#D3A265]" />
                  <div>
                    <div>{exhibition.venue}</div>
                    <div className="text-sm text-neutral-500">{exhibition.address}</div>
                  </div>
                </div>
                
                <div className="flex items-center text-neutral-700">
                  <Ticket className="w-5 h-5 mr-2 text-[#D3A265]" />
                  <span>Entry Fee: {exhibition.entryFee}</span>
                </div>
                
                <div className="flex items-start text-neutral-700">
                  <Users className="w-5 h-5 mr-2 mt-1 text-[#D3A265]" />
                  <div>
                    <div className="font-medium mb-1">Featured Artists:</div>
                    <div className="text-sm text-neutral-600">
                      {exhibition.artists.join(", ")}
                    </div>
                  </div>
                </div>
              </div>

              <p className="text-neutral-600 mb-4">{exhibition.description}</p>
              
              <div className="text-sm text-[#D3A265]">
                <strong>Note:</strong> {exhibition.specialNotes}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Exhibitions;
