
import { Helmet } from "react-helmet-async";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const FAQ = () => {
  return (
    <>
      <Helmet>
        <title>FAQ | Imbayedu Art Gallery</title>
        <meta name="description" content="Frequently asked questions about Imbayedu Art Gallery" />
      </Helmet>
      
      <div className="pt-24 md:pt-32">
        <div className="bg-neutral-100 py-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl md:text-4xl font-['Playfair_Display'] font-bold text-neutral-900 text-center">
              Frequently Asked Questions
            </h1>
          </div>
        </div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Accordion type="single" collapsible className="w-full max-w-3xl mx-auto">
            <AccordionItem value="shipping">
              <AccordionTrigger>What are your shipping methods?</AccordionTrigger>
              <AccordionContent>
                We offer secure, insured shipping worldwide. Artworks are carefully packaged to ensure safe delivery. Local delivery within Zimbabwe is available for select areas.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="returns">
              <AccordionTrigger>What is your return policy?</AccordionTrigger>
              <AccordionContent>
                We offer a 14-day return policy for artworks in original condition. Please contact us for return shipping arrangements.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="payment">
              <AccordionTrigger>What payment methods do you accept?</AccordionTrigger>
              <AccordionContent>
                We accept major credit cards, bank transfers, and mobile money payments. All transactions are secure and encrypted.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="care">
              <AccordionTrigger>How should I care for my artwork?</AccordionTrigger>
              <AccordionContent>
                Avoid direct sunlight and maintain consistent room temperature. Dust with a soft, dry cloth. For specific care instructions, please refer to the documentation provided with your artwork.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </>
  );
};

export default FAQ;
