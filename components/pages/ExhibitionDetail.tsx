
'use client'

import { useParams } from "next/navigation";

export default function ExhibitionDetail() {
  const { id } = useParams();

  return (
    <div className="pt-24 md:pt-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-['Playfair_Display'] font-bold text-neutral-900 mb-6">
            Exhibition Details {id}
          </h1>
          {/* Exhibition details will be implemented here */}
        </div>
      </div>
  );
}
