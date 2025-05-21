import { Link } from "wouter";
import { Facebook, Instagram, Twitter, MapPin, Phone, Mail, Clock } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-neutral-900 text-white pt-16 pb-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Company Info */}
          <div>
            <h3 className="text-xl font-['Playfair_Display'] font-semibold mb-6">Imbayedu Art Gallery</h3>
            <p className="text-neutral-400 mb-6">Showcasing exceptional contemporary African art from established and emerging artists.</p>
            <div className="flex space-x-4">
              <a href="#" className="text-white hover:text-[#D3A265] transition duration-300">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-white hover:text-[#D3A265] transition duration-300">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-white hover:text-[#D3A265] transition duration-300">
                <Twitter size={20} />
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="text-neutral-400 hover:text-white transition duration-300">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/artworks" className="text-neutral-400 hover:text-white transition duration-300">
                  Shop All Art
                </Link>
              </li>
              <li>
                <Link href="/artists" className="text-neutral-400 hover:text-white transition duration-300">
                  Artists
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-neutral-400 hover:text-white transition duration-300">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-neutral-400 hover:text-white transition duration-300">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Customer Service */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Customer Service</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/faq" className="text-neutral-400 hover:text-white transition duration-300">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/faq#shipping" className="text-neutral-400 hover:text-white transition duration-300">
                  Shipping & Returns
                </Link>
              </li>
              <li>
                <Link href="/policies" className="text-neutral-400 hover:text-white transition duration-300">
                  Store Policy
                </Link>
              </li>
              <li>
                <Link href="/faq#payment" className="text-neutral-400 hover:text-white transition duration-300">
                  Payment Methods
                </Link>
              </li>
              <li>
                <Link href="/faq#care" className="text-neutral-400 hover:text-white transition duration-300">
                  Artwork Care
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Contact Us</h3>
            <ul className="space-y-3 text-neutral-400">
              <li className="flex items-start">
                <MapPin className="mt-1 mr-3" size={18} />
                <span>Pro Flora Farm, Concession, Zimbabwe</span>
              </li>
              <li className="flex items-center">
                <Phone className="mr-3" size={18} />
                <span>078 336 1999</span>
              </li>
              <li className="flex items-center">
                <Mail className="mr-3" size={18} />
                <span>info@imbayedu.com</span>
              </li>
              <li className="flex items-start">
                <Clock className="mt-1 mr-3" size={18} />
                <span>Mon-Fri: 10am-6pm<br />Sat: 11am-5pm</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-neutral-800 text-center text-neutral-500 text-sm">
          <p>© {new Date().getFullYear()} Imbayedu Art Gallery. All rights reserved.</p>
          <div className="mt-4 flex justify-center space-x-6">
            <a href="#" className="hover:text-white transition duration-300">Privacy Policy</a>
            <a href="#" className="hover:text-white transition duration-300">Terms of Service</a>
            <a href="#" className="hover:text-white transition duration-300">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
