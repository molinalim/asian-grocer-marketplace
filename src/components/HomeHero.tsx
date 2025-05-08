
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const HomeHero: React.FC = () => {
  return (
    <div className="relative bg-[#c1e8b7] py-12 md:py-20">
      <div className="container mx-auto px-4 flex flex-col-reverse md:flex-row items-center">
        <div className="md:w-1/2 md:pr-8">
          <h2 className="text-2xl font-medium text-gray-700 mb-2">
            YOUR FAVOURITE
          </h2>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Fresh<br />Vegetables
          </h1>
          <Button asChild className="bg-[#F58634] hover:bg-[#e07a30] border-none rounded-full text-white px-8 py-6">
            <Link to="/products">SHOP NOW</Link>
          </Button>
        </div>
        <div className="md:w-1/2 mb-8 md:mb-0">
          <img 
            src="/lovable-uploads/53ec02e4-b9b4-4983-8ed9-a8582a41ee09.png" 
            alt="Fresh vegetables arrangement" 
            className="w-full h-auto object-contain"
          />
        </div>
      </div>
    </div>
  );
};

export default HomeHero;
