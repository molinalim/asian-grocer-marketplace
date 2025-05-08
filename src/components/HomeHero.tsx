import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
const HomeHero: React.FC = () => {
  return <div className="relative bg-[#c1e8b7] py-12 md:py-20">
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
          <img alt="Fresh vegetables arrangement" className="w-full h-auto object-contain" src="/lovable-uploads/50c1ac29-cdec-4dda-84f8-4c1b4dc4006f.png" />
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-12 md:h-16 overflow-hidden">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="absolute bottom-0 left-0 w-full h-full">
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V56.44Z" fill="#F9FCF7"></path>
        </svg>
      </div>
    </div>;
};
export default HomeHero;