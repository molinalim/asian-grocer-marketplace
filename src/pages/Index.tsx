
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
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        <HomeHero />
        
        <FeaturedCategories />
        
        <section className="py-12 bg-neutral">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold mb-8">Featured Products</h2>
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
        
        <div className="container mx-auto px-4">
          <PromotionalBanner
            title="Lunar New Year Special"
            description="Celebrate with traditional foods and ingredients! Limited time offers on festive essentials."
            backgroundImage="https://images.unsplash.com/photo-1582559934353-2e47140e7501?q=80&w=1635&auto=format&fit=crop"
            link="/products?category=seasonal"
          />
        </div>
        
        <section className="py-12">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Why Shop With Us?</h2>
            <p className="max-w-2xl mx-auto text-gray-600 mb-10">
              AsianGrocer brings the authentic flavors of Asia to your home with carefully sourced products.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-6 bg-white rounded-lg shadow-sm">
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
              
              <div className="p-6 bg-white rounded-lg shadow-sm">
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
              
              <div className="p-6 bg-white rounded-lg shadow-sm">
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
        
        <div className="container mx-auto px-4">
          <PromotionalBanner
            title="Join Our Cooking Classes"
            description="Learn to cook authentic Asian dishes from expert chefs. Online and in-store options available."
            backgroundImage="https://images.unsplash.com/photo-1556911220-e15b29be8c8f?q=80&w=1470&auto=format&fit=crop"
            link="/cooking-classes"
          />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
