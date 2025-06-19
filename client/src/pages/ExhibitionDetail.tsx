
import { useParams } from "wouter";
import { Helmet } from "react-helmet-async";

export default function ExhibitionDetail() {
  const { id } = useParams();

  return (
    <>
      <Helmet>
        <title>Exhibition Details | Imbayedu Art Collective</title>
        <meta name="description" content="View exhibition details at Imbayedu Art Collective" />
      </Helmet>
      
      <div className="pt-24 md:pt-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-['Playfair_Display'] font-bold text-neutral-900 mb-6">
            Exhibition Details {id}
          </h1>
          {/* Exhibition details will be implemented here */}
        </div>
      </div>
    </>
  );
}
