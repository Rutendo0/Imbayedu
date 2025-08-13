import { useQuery } from "@tanstack/react-query";
import { Testimonial } from "@shared/schema";
import { Star, StarHalf } from "lucide-react";

const Testimonials = () => {
  const { data: testimonials, isLoading, error } = useQuery<Testimonial[]>({
    queryKey: ['/api/testimonials/featured'],
  });

  if (isLoading) {
    return (
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-['Playfair_Display'] font-bold text-neutral-900 mb-4">Client Testimonials</h2>
            <p className="text-neutral-600 max-w-3xl mx-auto">Hear what our clients have to say about their experience with Imbayedu Art Collective</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-[#F9F9F9] p-8 rounded-md shadow-sm animate-pulse">
                <div className="h-4 bg-gray-200 rounded mb-6 w-1/4"></div>
                <div className="h-24 bg-gray-200 rounded mb-6"></div>
                <div className="h-5 bg-gray-200 rounded mb-2 w-1/2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error || !testimonials) {
    return null;
  }

  const renderStars = (rating: number) => {
    const stars: React.ReactElement[] = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={`star-${i}`} className="fill-[#D3A265] text-[#D3A265]" size={18} />);
    }

    if (hasHalfStar) {
      stars.push(<StarHalf key="half-star" className="fill-[#D3A265] text-[#D3A265]" size={18} />);
    }

    return stars;
  };

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-['Playfair_Display'] font-bold text-neutral-900 mb-4">Client Testimonials</h2>
          <p className="text-neutral-600 max-w-3xl mx-auto">Hear what our clients have to say about their experience with Imbayedu Art Collective</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="bg-[#F9F9F9] p-8 rounded-md shadow-sm">
              <div className="flex items-center mb-6">
                <div className="text-[#D3A265] flex">
                  {renderStars(testimonial.rating)}
                </div>
              </div>
              <p className="text-neutral-700 italic mb-6">&quot;{testimonial.comment}&quot;</p>
              <div>
                <h4 className="font-['Playfair_Display'] font-semibold text-neutral-900">{testimonial.name}</h4>
                <p className="text-sm text-neutral-600">{testimonial.location}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
