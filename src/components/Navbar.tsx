
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Heart, Menu, Search, X, LogOut } from 'lucide-react';
import { Button } from "@/components/ui/button";
import SearchBar from './SearchBar';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { user, isAuthenticated, logout, isAdmin } = useAuth();
  const { itemCount: cartItemCount } = useCart();
  const { items: wishlistItems } = useWishlist();
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    if (userMenuOpen) setUserMenuOpen(false);
  };

  const toggleSearch = () => {
    setSearchOpen(!searchOpen);
  };

  const toggleUserMenu = () => {
    setUserMenuOpen(!userMenuOpen);
    if (isMenuOpen) setIsMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
    navigate('/');
  };

  const handleSearch = (searchTerm: string) => {
    // Will implement search functionality later
    console.log('Searching for:', searchTerm);
    setSearchOpen(false);
    navigate(`/products?search=${searchTerm}`);
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <span className="text-2xl font-bold text-primary">Fresh<span className="text-secondary">Food</span></span>
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
              className="p-2 hover:bg-gray-100 rounded-full transition-colors text-primary"
              aria-label="Search"
            >
              <Search size={20} />
            </button>
            <Link to="/wishlist" className="p-2 hover:bg-gray-100 rounded-full transition-colors relative text-primary">
              <Heart size={20} />
              {wishlistItems.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-secondary text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
                  {wishlistItems.length}
                </span>
              )}
            </Link>
            <Link to="/cart" className="p-2 hover:bg-gray-100 rounded-full transition-colors relative text-primary">
              <ShoppingCart size={20} />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-secondary text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </Link>
            
            {/* User Menu */}
            <div className="relative">
              <button
                onClick={toggleUserMenu}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors text-primary"
                aria-label="Account"
              >
                <User size={20} />
              </button>
              
              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                  {isAuthenticated ? (
                    <>
                      <div className="px-4 py-2 text-sm text-gray-700 border-b">
                        <p>Hello, {user?.name}</p>
                        <p className="text-xs text-gray-500">{user?.email}</p>
                      </div>
                      <Link 
                        to="/account/profile" 
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        My Account
                      </Link>
                      <Link 
                        to="/account/orders" 
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        Order History
                      </Link>
                      <Link 
                        to="/account/wishlist" 
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        Wishlist
                      </Link>
                      {isAdmin() && (
                        <Link 
                          to="/admin" 
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          Admin Dashboard
                        </Link>
                      )}
                      <button 
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <div className="flex items-center">
                          <LogOut size={16} className="mr-2" />
                          Logout
                        </div>
                      </button>
                    </>
                  ) : (
                    <>
                      <Link 
                        to="/login" 
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        Login
                      </Link>
                      <Link 
                        to="/register" 
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        Register
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center space-x-2 md:hidden">
            <Link to="/cart" className="p-2 relative text-primary">
              <ShoppingCart size={20} />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-secondary text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </Link>
            <button
              onClick={toggleMenu}
              className="p-2 text-primary"
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
              
              {isAuthenticated ? (
                <>
                  <div className="flex items-center py-2">
                    <User size={18} className="mr-2" />
                    <div>
                      <p className="font-medium">{user?.name}</p>
                      <p className="text-xs text-gray-500">{user?.email}</p>
                    </div>
                  </div>
                  <Link to="/account/profile" className="flex items-center py-2 hover:text-primary" onClick={toggleMenu}>
                    My Account
                  </Link>
                  <Link to="/account/orders" className="flex items-center py-2 hover:text-primary" onClick={toggleMenu}>
                    Order History
                  </Link>
                  <Link to="/account/wishlist" className="flex items-center py-2 hover:text-primary" onClick={toggleMenu}>
                    <Heart size={18} className="mr-2" /> Wishlist
                  </Link>
                  {isAdmin() && (
                    <Link to="/admin" className="flex items-center py-2 hover:text-primary" onClick={toggleMenu}>
                      Admin Dashboard
                    </Link>
                  )}
                  <button 
                    onClick={handleLogout}
                    className="flex items-center py-2 hover:text-primary w-full text-left"
                  >
                    <LogOut size={18} className="mr-2" /> Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="flex items-center py-2 hover:text-primary" onClick={toggleMenu}>
                    <User size={18} className="mr-2" /> Login
                  </Link>
                  <Link to="/register" className="flex items-center py-2 hover:text-primary" onClick={toggleMenu}>
                    Register
                  </Link>
                </>
              )}
              
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
