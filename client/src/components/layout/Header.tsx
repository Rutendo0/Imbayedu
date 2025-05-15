import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { ShoppingCart, Search, Heart, Menu, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/hooks/use-cart";

const Header = () => {
  const [location] = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { cartItems } = useCart();
  
  const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const isActive = (path: string) => {
    return location === path;
  };

  return (
    <header className={`bg-white fixed w-full z-30 transition-shadow ${isScrolled ? 'shadow-md' : ''}`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4 md:py-6">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center">
              <span className="text-2xl font-['Playfair_Display'] font-bold text-primary">IMBAYEDU</span>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-10">
            <Link href="/" className={`nav-link text-sm font-medium text-neutral-900 hover:text-accent ${isActive('/') ? 'active after:w-full' : ''} relative after:absolute after:content-[''] after:h-[1px] after:bottom-[-2px] after:left-0 after:bg-black after:transition-[width] after:duration-300 after:ease-in-out`}>
              Home
            </Link>
            <Link href="/artworks" className={`nav-link text-sm font-medium text-neutral-900 hover:text-accent ${isActive('/artworks') ? 'active after:w-full' : ''} relative after:absolute after:content-[''] after:h-[1px] after:bottom-[-2px] after:left-0 after:bg-black after:transition-[width] after:duration-300 after:ease-in-out`}>
              Artworks
            </Link>
            <Link href="/artists" className={`nav-link text-sm font-medium text-neutral-900 hover:text-accent ${isActive('/artists') ? 'active after:w-full' : ''} relative after:absolute after:content-[''] after:h-[1px] after:bottom-[-2px] after:left-0 after:bg-black after:transition-[width] after:duration-300 after:ease-in-out`}>
              Artists
            </Link>
            <Link href="/about" className={`nav-link text-sm font-medium text-neutral-900 hover:text-accent ${isActive('/about') ? 'active after:w-full' : ''} relative after:absolute after:content-[''] after:h-[1px] after:bottom-[-2px] after:left-0 after:bg-black after:transition-[width] after:duration-300 after:ease-in-out`}>
              About
            </Link>
            <Link href="/contact" className={`nav-link text-sm font-medium text-neutral-900 hover:text-accent ${isActive('/contact') ? 'active after:w-full' : ''} relative after:absolute after:content-[''] after:h-[1px] after:bottom-[-2px] after:left-0 after:bg-black after:transition-[width] after:duration-300 after:ease-in-out`}>
              Contact
            </Link>
          </nav>
          
          {/* Right side icons */}
          <div className="flex items-center space-x-6">
            <button className="text-neutral-900 hover:text-accent">
              <Search size={20} />
            </button>
            <button className="text-neutral-900 hover:text-accent">
              <Heart size={20} />
            </button>
            <Link href="/cart" className="text-neutral-900 hover:text-accent relative">
              <ShoppingCart size={20} />
              {totalItems > 0 && (
                <Badge className="absolute -top-2 -right-2 bg-[#D3A265] text-white text-xs w-4 h-4 rounded-full flex items-center justify-center p-0">
                  {totalItems}
                </Badge>
              )}
            </Link>
            <button 
              className="text-neutral-900 hover:text-accent md:hidden"
              onClick={toggleMenu}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 py-2 px-4">
          <div className="flex flex-col space-y-2 pb-3 pt-2">
            <Link href="/" onClick={closeMenu} className="text-base font-medium text-neutral-900 hover:text-accent block px-3 py-2">
              Home
            </Link>
            <Link href="/artworks" onClick={closeMenu} className="text-base font-medium text-neutral-900 hover:text-accent block px-3 py-2">
              Artworks
            </Link>
            <Link href="/artists" onClick={closeMenu} className="text-base font-medium text-neutral-900 hover:text-accent block px-3 py-2">
              Artists
            </Link>
            <Link href="/about" onClick={closeMenu} className="text-base font-medium text-neutral-900 hover:text-accent block px-3 py-2">
              About
            </Link>
            <Link href="/contact" onClick={closeMenu} className="text-base font-medium text-neutral-900 hover:text-accent block px-3 py-2">
              Contact
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
