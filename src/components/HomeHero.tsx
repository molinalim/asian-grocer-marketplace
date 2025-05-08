
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const HomeHero: React.FC = () => {
  return (
    <div className="relative bg-store-pattern bg-cover bg-center py-20 md:py-32">
      <div className="container mx-auto px-4">
        <div className="max-w-lg">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Authentic Asian Groceries
          </h1>
          <p className="text-lg text-white opacity-90 mb-8">
            Discover a wide selection of premium ingredients and foods from all across Asia. 
            Fresh produce, pantry staples, snacks, and more.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button asChild className="bg-primary hover:bg-primary-hover text-white px-8 py-6">
              <Link to="/products">Shop Now</Link>
            </Button>
            <Button asChild variant="outline" className="bg-white text-primary border-white hover:bg-opacity-90 px-8 py-6">
              <Link to="/about">Learn More</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeHero;
