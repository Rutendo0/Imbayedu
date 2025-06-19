
import React from "react";
import { Helmet } from "react-helmet-async";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../components/ui/accordion";

const FAQ = () => {
  // Scroll to anchor on mount
  React.useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      const id = hash.replace('#', '');
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, []);

  return (
    <>
      <Helmet>
        <title>FAQ | Imbayedu Art Collective</title>
        <meta name="description" content="Frequently asked questions about Imbayedu Art Collective" />
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
            <div id="shipping" className="scroll-mt-32">
              <AccordionItem value="shipping">
                <AccordionTrigger>Shipping & Returns</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4">
                    <h3 className="font-semibold">Shipping Information</h3>
                    <p>We offer secure, insured shipping worldwide. All artworks are carefully packaged to ensure safe delivery.</p>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>Local delivery within Zimbabwe is available for select areas</li>
                      <li>International shipping takes 7-14 business days</li>
                      <li>Tracking information is provided for all shipments</li>
                    </ul>
                    <h3 className="font-semibold pt-4">Returns Policy</h3>
                    <p>We offer a 14-day return policy for artworks in original condition. Contact us for return shipping arrangements.</p>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </div>

            <div id="store-policy" className="scroll-mt-32">
              <AccordionItem value="store-policy">
                <AccordionTrigger>Store Policy</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4">
                    <p>Our store policies are designed to ensure a transparent and secure shopping experience:</p>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>All artworks are authentic with certificates of authenticity</li>
                      <li>Prices are listed in USD and include standard shipping</li>
                      <li>Custom framing services are available upon request</li>
                      <li>We reserve the right to refuse service to anyone</li>
                    </ul>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </div>

            <div id="payment" className="scroll-mt-32">
              <AccordionItem value="payment">
                <AccordionTrigger>Payment Methods</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4">
                    <p>We accept the following payment methods:</p>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>Major credit cards (Visa, MasterCard, American Express)</li>
                      <li>Bank transfers</li>
                      <li>Mobile money payments</li>
                      <li>PayPal for international transactions</li>
                    </ul>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </div>

            <div id="artwork-care" className="scroll-mt-32">
              <AccordionItem value="artwork-care">
                <AccordionTrigger>Artwork Care</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4">
                    <h3 className="font-semibold">General Care Guidelines</h3>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>Avoid direct sunlight and maintain consistent room temperature</li>
                      <li>Clean with a soft, dry cloth only</li>
                      <li>Keep artwork away from heat sources and humid areas</li>
                      <li>Handle artwork by the edges or frame only</li>
                    </ul>
                    <p className="pt-4">For specific care instructions, please refer to the documentation provided with your artwork.</p>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </div>
          </Accordion>
        </div>
      </div>
    </>
  );
};

export default FAQ;
