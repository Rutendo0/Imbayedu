import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { ShoppingCart, Search, Heart, Menu, X, User } from "lucide-react";
import { Badge } from "../ui/badge";
import { useCart } from "../../hooks/use-cart";

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
      {/* Top announcement bar */}
      <div className="bg-[#F8F8F8] text-sm py-2">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex justify-center">
          <p className="text-center text-neutral-600">Free shipping on orders over $500 • Artwork ships with Certificate of Authenticity</p>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center">
              <span className="text-2xl font-['Playfair_Display'] font-bold text-black tracking-wide">IMBAYEDU</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex space-x-8">
            <Link href="/" className={`nav-link text-sm font-medium text-neutral-900 hover:text-[#D3A265] ${isActive('/') ? 'text-[#D3A265]' : ''}`}>
              Home
            </Link>
            <div className="relative group">
              <Link href="/artworks" className={`nav-link text-sm font-medium text-neutral-900 hover:text-[#D3A265] ${isActive('/artworks') ? 'text-[#D3A265]' : ''}`}>
                Shop Art
              </Link>
              <div className="absolute hidden group-hover:block bg-white shadow-lg p-6 z-50 left-1/2 transform -translate-x-1/2 w-[500px] grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium mb-2 uppercase text-xs tracking-wider">By Category</h3>
                  <ul className="space-y-2">
                    <li><Link href="/artworks?category=1" className="text-neutral-700 hover:text-[#D3A265]">Paintings</Link></li>
                    <li><Link href="/artworks?category=2" className="text-neutral-700 hover:text-[#D3A265]">Mixed Media</Link></li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-medium mb-2 uppercase text-xs tracking-wider">By Collection</h3>
                  <ul className="space-y-2">
                    <li><Link href="/artworks?collection=1" className="text-neutral-700 hover:text-[#D3A265]">Abstract Expressions</Link></li>
                    <li><Link href="/artworks?collection=2" className="text-neutral-700 hover:text-[#D3A265]">Cultural Portraits</Link></li>
                    <li><Link href="/artworks?collection=3" className="text-neutral-700 hover:text-[#D3A265]">Mixed Media</Link></li>
                  </ul>
                </div>
              </div>
            </div>
            <Link href="/artists" className={`nav-link text-sm font-medium text-neutral-900 hover:text-[#D3A265] ${isActive('/artists') ? 'text-[#D3A265]' : ''}`}>
              Artists
            </Link>
            <Link href="/about" className={`nav-link text-sm font-medium text-neutral-900 hover:text-[#D3A265] ${isActive('/about') ? 'text-[#D3A265]' : ''}`}>
              About
            </Link>
            <Link href="/interior-design" className={`nav-link text-sm font-medium text-neutral-900 hover:text-[#D3A265] ${isActive('/interior-design') ? 'text-[#D3A265]' : ''}`}>
              Interior Design
            </Link>
            <Link href="/furniture-catalog" className={`nav-link text-sm font-medium text-neutral-900 hover:text-[#D3A265] ${isActive('/furniture-catalog') ? 'text-[#D3A265]' : ''}`}>
              Furniture
            </Link>
            <Link href="/contact" className={`nav-link text-sm font-medium text-neutral-900 hover:text-[#D3A265] ${isActive('/contact') ? 'text-[#D3A265]' : ''}`}>
              Contact
            </Link>
          </nav>

          {/* Right side icons */}
          <div className="flex items-center space-x-6">
            <button className="text-neutral-900 hover:text-[#D3A265] hidden sm:block">
              <Search size={20} />
            </button>
            <button className="text-neutral-900 hover:text-[#D3A265] hidden sm:block">
              <User size={20} />
            </button>
            <button className="text-neutral-900 hover:text-[#D3A265] hidden sm:block">
              <Heart size={20} />
            </button>
            <Link href="/cart" className="text-neutral-900 hover:text-[#D3A265] relative">
              <ShoppingCart size={20} />
              {totalItems > 0 && (
                <Badge className="absolute -top-2 -right-2 bg-[#D3A265] text-white text-xs w-4 h-4 rounded-full flex items-center justify-center p-0">
                  {totalItems}
                </Badge>
              )}
            </Link>
            <button 
              className="text-neutral-900 hover:text-[#D3A265] lg:hidden ml-2"
              onClick={toggleMenu}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-200 py-2 px-4 shadow-md">
          <div className="flex flex-col space-y-2 pb-3 pt-2">
            <Link href="/" onClick={closeMenu} className="text-base font-medium text-neutral-900 hover:text-[#D3A265] block px-3 py-2">
              Home
            </Link>
            <Link href="/artworks" onClick={closeMenu} className="text-base font-medium text-neutral-900 hover:text-[#D3A265] block px-3 py-2">
              Shop Art
            </Link>
            <div className="pl-5 py-1 space-y-2">
              <h3 className="text-xs uppercase tracking-wider text-neutral-500">Categories</h3>
              <Link href="/artworks?category=1" onClick={closeMenu} className="text-sm text-neutral-700 hover:text-[#D3A265] block py-1">
                Paintings
              </Link>
              <Link href="/artworks?category=2" onClick={closeMenu} className="text-sm text-neutral-700 hover:text-[#D3A265] block py-1">
                Mixed Media
              </Link>
            </div>
            <Link href="/artists" onClick={closeMenu} className="text-base font-medium text-neutral-900 hover:text-[#D3A265] block px-3 py-2">
              Artists
            </Link>
            <Link href="/about" onClick={closeMenu} className="text-base font-medium text-neutral-900 hover:text-[#D3A265] block px-3 py-2">
              About
            </Link>
            <Link href="/interior-design" onClick={closeMenu} className="text-base font-medium text-neutral-900 hover:text-[#D3A265] block px-3 py-2">
              Interior Design
            </Link>
            <Link href="/furniture-catalog" onClick={closeMenu} className="text-base font-medium text-neutral-900 hover:text-[#D3A265] block px-3 py-2">
              Furniture
            </Link>
            <Link href="/contact" onClick={closeMenu} className="text-base font-medium text-neutral-900 hover:text-[#D3A265] block px-3 py-2">
              Contact
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;