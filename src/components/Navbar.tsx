
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, User, Heart, Menu, Search, X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import SearchBar from './SearchBar';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleSearch = () => {
    setSearchOpen(!searchOpen);
  };

  const handleSearch = (searchTerm: string) => {
    // Will implement search functionality later
    console.log('Searching for:', searchTerm);
    setSearchOpen(false);
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <span className="text-2xl font-bold text-primary">Asian<span className="text-secondary">Grocer</span></span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="font-medium hover:text-primary transition-colors">Home</Link>
            <Link to="/products" className="font-medium hover:text-primary transition-colors">Products</Link>
            <Link to="/about" className="font-medium hover:text-primary transition-colors">About</Link>
            <Link to="/contact" className="font-medium hover:text-primary transition-colors">Contact</Link>
          </nav>

          {/* Desktop Action Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <button
              onClick={toggleSearch}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Search"
            >
              <Search size={20} />
            </button>
            <Link to="/wishlist" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <Heart size={20} />
            </Link>
            <Link to="/cart" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <ShoppingCart size={20} />
            </Link>
            <Link to="/account" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <User size={20} />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center space-x-2 md:hidden">
            <Link to="/cart" className="p-2">
              <ShoppingCart size={20} />
            </Link>
            <button
              onClick={toggleMenu}
              className="p-2"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
        
        {/* Search dropdown */}
        {searchOpen && (
          <div className="absolute left-0 right-0 bg-white shadow-md p-4 border-t">
            <div className="container mx-auto">
              <SearchBar onSearch={handleSearch} />
            </div>
          </div>
        )}
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white shadow-md">
          <div className="container mx-auto px-4 py-2">
            <nav className="flex flex-col space-y-3 pb-3">
              <Link to="/" className="py-2 hover:text-primary" onClick={toggleMenu}>Home</Link>
              <Link to="/products" className="py-2 hover:text-primary" onClick={toggleMenu}>Products</Link>
              <Link to="/about" className="py-2 hover:text-primary" onClick={toggleMenu}>About</Link>
              <Link to="/contact" className="py-2 hover:text-primary" onClick={toggleMenu}>Contact</Link>
              <hr className="my-2" />
              <div className="flex items-center space-x-4">
                <Link to="/wishlist" className="flex items-center py-2 hover:text-primary" onClick={toggleMenu}>
                  <Heart size={18} className="mr-2" /> Wishlist
                </Link>
                <Link to="/account" className="flex items-center py-2 hover:text-primary" onClick={toggleMenu}>
                  <User size={18} className="mr-2" /> Account
                </Link>
              </div>
              <div className="pt-2">
                <SearchBar onSearch={handleSearch} />
              </div>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
