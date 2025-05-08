
import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-neutral-800 text-white pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About section */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-accent">AsianGrocer</h3>
            <p className="text-gray-300 text-sm leading-relaxed mb-4">
              Your one-stop destination for authentic Asian groceries, from fresh produce to pantry essentials.
              We bring the flavors of Asia directly to your kitchen.
            </p>
            <div className="flex space-x-4">
              {/* Social media icons would go here */}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-accent">Quick Links</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><Link to="/" className="hover:text-accent transition-colors">Home</Link></li>
              <li><Link to="/products" className="hover:text-accent transition-colors">Shop</Link></li>
              <li><Link to="/about" className="hover:text-accent transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-accent transition-colors">Contact</Link></li>
              <li><Link to="/privacy-policy" className="hover:text-accent transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-accent transition-colors">Terms & Conditions</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-accent">Categories</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><Link to="/products?category=fresh-produce" className="hover:text-accent transition-colors">Fresh Produce</Link></li>
              <li><Link to="/products?category=pantry" className="hover:text-accent transition-colors">Pantry</Link></li>
              <li><Link to="/products?category=frozen" className="hover:text-accent transition-colors">Frozen</Link></li>
              <li><Link to="/products?category=beverages" className="hover:text-accent transition-colors">Beverages</Link></li>
              <li><Link to="/products?category=snacks" className="hover:text-accent transition-colors">Snacks</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-accent">Contact Us</h3>
            <ul className="space-y-4 text-sm text-gray-300">
              <li className="flex items-start">
                <MapPin size={18} className="mr-2 mt-0.5 text-accent" />
                <span>123 Asian Market Street,<br />Foodie City, FC 12345</span>
              </li>
              <li className="flex items-center">
                <Phone size={18} className="mr-2 text-accent" />
                <span>(123) 456-7890</span>
              </li>
              <li className="flex items-center">
                <Mail size={18} className="mr-2 text-accent" />
                <span>info@asiangrocer.com</span>
              </li>
            </ul>
          </div>
        </div>

        <hr className="border-gray-700 my-6" />

        <div className="text-center text-gray-400 text-sm">
          <p>&copy; {new Date().getFullYear()} AsianGrocer. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
