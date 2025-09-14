import Link from "next/link";
import { Facebook, Instagram, Twitter, MapPin, Phone, Mail, Clock } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-neutral-900 text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Company Info */}
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <img 
                src="/img/artwork/WhatsApp Image 2025-06-24 at 02.31.06.jpg" 
                alt="Imbayedu Logo" 
                className="w-16 h-16 object-cover rounded-md"
              />
              <h3 className="text-2xl font-['Playfair_Display'] font-semibold">Imbayedu Art Collective</h3>
            </div>
            <p className="text-neutral-400 leading-relaxed">Showcasing exceptional contemporary African art from established and emerging artists.</p>
            <div className="flex items-center space-x-4">
              <a href="#" className="text-neutral-400 hover:text-[#D3A265] transition-colors duration-300">
                <Facebook strokeWidth={1.5} />
              </a>
              <a href="#" className="text-neutral-400 hover:text-[#D3A265] transition-colors duration-300">
                <Instagram strokeWidth={1.5} />
              </a>
              <a href="#" className="text-neutral-400 hover:text-[#D3A265] transition-colors duration-300">
                <Twitter strokeWidth={1.5} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold tracking-wide uppercase">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="text-neutral-400 hover:text-[#D3A265] transition-colors duration-300">Home</Link>
              </li>
              <li>
                <Link href="/artworks" className="text-neutral-400 hover:text-[#D3A265] transition-colors duration-300">Shop All Art</Link>
              </li>
              <li>
                <Link href="/artists" className="text-neutral-400 hover:text-[#D3A265] transition-colors duration-300">Artists</Link>
              </li>
              <li>
                <Link href="/about" className="text-neutral-400 hover:text-[#D3A265] transition-colors duration-300">About Us</Link>
              </li>
              <li>
                <Link href="/contact" className="text-neutral-400 hover:text-[#D3A265] transition-colors duration-300">Contact</Link>
              </li>
              <li>
                <Link href="/interior-design" className="text-neutral-400 hover:text-[#D3A265] transition-colors duration-300">Interior Design</Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold tracking-wide uppercase">Customer Service</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/faq" className="text-neutral-400 hover:text-[#D3A265] transition-colors duration-300">FAQ</Link>
              </li>

              <li>
                <Link href="/faq#store-policy" className="text-neutral-400 hover:text-[#D3A265] transition-colors duration-300">Store Policy</Link>
              </li>
              <li>
                <Link href="/faq#payment" className="text-neutral-400 hover:text-[#D3A265] transition-colors duration-300">Payment Methods</Link>
              </li>
              <li>
                <Link href="/faq#artwork-care" className="text-neutral-400 hover:text-[#D3A265] transition-colors duration-300">Artwork Care</Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold tracking-wide uppercase">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start space-x-3">
                <MapPin className="text-[#D3A265] mt-1" size={18} />
                <span className="text-neutral-400">Pro Flora Farm, Concession, Zimbabwe</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="text-[#D3A265]" size={18} />
                <span className="text-neutral-400">078 336 1999</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="text-[#D3A265]" size={18} />
                <span className="text-neutral-400">info@imbayedu.com</span>
              </li>
              <li className="flex items-start space-x-3">
                <Clock className="text-[#D3A265] mt-1" size={18} />
                <div className="text-neutral-400">
                  <div>Mon-Fri: 10am-6pm</div>
                  <div>Sat: 11am-5pm</div>
                </div>
              </li>
            </ul>
          </div>
        </div>
        {/* Professional Niakazi Attribution */}
          <div className="mt-6 pt-6 border-t border-neutral-800 text-center">
            <a 
              href="https://www.niakazi.com/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-[#D3A265] hover:text-white font-semibold text-base px-6 py-2 border border-[#D3A265] hover:bg-[#D3A265] rounded transition-all duration-300"
            >
              <span className="text-lg">⚡</span>
              DESIGNED BY NIAKAZI
            </a>
          </div>

        {/* Copyright */}
        <div className="py-8 border-t border-neutral-800">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-neutral-400 text-sm">© {new Date().getFullYear()} Imbayedu Art Collective. All rights reserved.</p>
            <div className="flex items-center space-x-6">
              <a href="#" className="text-neutral-400 hover:text-[#D3A265] text-sm transition-colors duration-300">Privacy Policy</a>
              <a href="#" className="text-neutral-400 hover:text-[#D3A265] text-sm transition-colors duration-300">Terms of Service</a>
              <a href="#" className="text-neutral-400 hover:text-[#D3A265] text-sm transition-colors duration-300">Cookie Policy</a>
            </div>
          </div>
          
        </div>
      </div>
    </footer>
  );
};

export default Footer;