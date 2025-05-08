
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import HomeHero from '@/components/HomeHero';
import FeaturedCategories from '@/components/FeaturedCategories';
import ProductCard, { Product } from '@/components/ProductCard';
import PromotionalBanner from '@/components/PromotionalBanner';
import { products } from '@/data/products';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';

const Index: React.FC = () => {
  const { addItem } = useCart();
  const { toggleItem } = useWishlist();
  
  // Get featured products (first 8)
  const featuredProducts = products.slice(0, 8);
  
  return (
    <div className="min-h-screen flex flex-col bg-[#F9FCF7]">
      <Navbar />
      
      <main className="flex-grow">
        <HomeHero />
        
        <FeaturedCategories />
        
        <section className="py-12 bg-[#F2FCE2]">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold mb-8 text-primary">Featured Products</h2>
            <div className="product-grid">
              {featuredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={addItem}
                  onAddToWishlist={toggleItem}
                />
              ))}
            </div>
          </div>
        </section>
        
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-primary rounded-lg p-6 text-center text-white">
              <h3 className="text-xl font-bold mb-3">Breakfast</h3>
              <button className="border border-white rounded-full px-4 py-1 text-sm hover:bg-white hover:text-primary transition-colors">CLICK HERE</button>
            </div>
            
            <div className="bg-[#F58634] rounded-lg p-6 text-center text-white">
              <h3 className="text-xl font-bold mb-3">Dessert Recipes</h3>
              <button className="border border-white rounded-full px-4 py-1 text-sm hover:bg-white hover:text-[#F58634] transition-colors">CLICK HERE</button>
            </div>
            
            <div className="bg-primary rounded-lg p-6 text-center text-white">
              <h3 className="text-xl font-bold mb-3">Dinner Recipes</h3>
              <button className="border border-white rounded-full px-4 py-1 text-sm hover:bg-white hover:text-primary transition-colors">CLICK HERE</button>
            </div>
          </div>
        </div>
        
        <div className="bg-[#C1E8B7] py-16 mt-8">
          <div className="container mx-auto px-4">
            <PromotionalBanner
              title="Fresh Organic Vegetables"
              description="Discover a wide selection of premium vegetables and foods from all across Asia."
              backgroundImage=""
              link="/products?category=vegetables"
              className="bg-transparent"
            />
          </div>
        </div>
        
        <section className="py-12">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-primary">Why Shop With Us?</h2>
            <p className="max-w-2xl mx-auto text-gray-600 mb-10">
              Fresh Food brings organic, farm-fresh vegetables and Asian groceries right to your door.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-6 bg-white bg-opacity-80 backdrop-blur-sm rounded-lg shadow-sm">
                <div className="w-16 h-16 bg-primary bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2">Authentic Products</h3>
                <p className="text-gray-600">
                  Imported directly from Asia to ensure authenticity and quality.
                </p>
              </div>
              
              <div className="p-6 bg-white bg-opacity-80 backdrop-blur-sm rounded-lg shadow-sm">
                <div className="w-16 h-16 bg-primary bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2">Fast Delivery</h3>
                <p className="text-gray-600">
                  Quick and reliable shipping to get your ingredients to you on time.
                </p>
              </div>
              
              <div className="p-6 bg-white bg-opacity-80 backdrop-blur-sm rounded-lg shadow-sm">
                <div className="w-16 h-16 bg-primary bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2">Cooking Support</h3>
                <p className="text-gray-600">
                  Access to recipes and cooking tips to help you create authentic Asian dishes.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
