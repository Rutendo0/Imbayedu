import { useState } from "react";
import { useToast } from "../../hooks/use-toast";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    setTimeout(() => {
      toast({
        title: "Subscription successful",
        description: "Thank you for subscribing to our newsletter!",
      });
      setEmail("");
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <section className="py-16 bg-[#D3A265]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-['Playfair_Display'] font-bold text-white mb-4">Stay Updated</h2>
          <p className="text-white opacity-90 mb-8">
            Subscribe to our newsletter to receive updates on new arrivals, special promotions, and upcoming exhibitions.
          </p>
          
          <form 
            className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto"
            onSubmit={handleSubmit}
          >
            <Input
              type="email"
              placeholder="Your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-grow px-4 py-3 rounded-sm focus:outline-none"
              required
            />
            <Button 
              type="submit" 
              className="bg-neutral-900 text-white font-medium px-8 py-3 rounded-sm hover:bg-opacity-90 transition duration-300 whitespace-nowrap"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Subscribing..." : "Subscribe"}
            </Button>
          </form>
          
          <p className="text-white opacity-70 text-sm mt-4">
            By subscribing, you agree to our Privacy Policy and consent to receive updates from Imbayedu Art Collective.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
