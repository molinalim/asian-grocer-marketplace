
import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchCategories } from '@/services/productService';

interface CategoryCard {
  id: string;
  name: string;
  image: string;
  link: string;
}

// Mapping of category slugs to image URLs - we'll use this until we have images in the database
const categoryImages: Record<string, string> = {
  'pantry': 'https://images.unsplash.com/photo-1585670140241-2bed9efe80f9?q=80&w=1974&auto=format&fit=crop',
  'beverages': 'https://images.unsplash.com/photo-1534353473418-4cfa6c56fd38?q=80&w=1974&auto=format&fit=crop',
  'fresh-produce': 'https://images.unsplash.com/photo-1540148426945-6cf22a6b2383?q=80&w=1974&auto=format&fit=crop',
  'frozen': 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?q=80&w=1925&auto=format&fit=crop',
  'snacks': 'https://images.unsplash.com/photo-1614735241165-6756e1df61ab?q=80&w=1974&auto=format&fit=crop',
};

const FeaturedCategories: React.FC = () => {
  const { data: categories = [], isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
  });

  // Transform database categories into CategoryCard format with images
  const featuredCategories: CategoryCard[] = categories
    .slice(0, 4) // Take first 4 categories to feature
    .map(category => ({
      id: category.id,
      name: category.name,
      image: categoryImages[category.id] || 'https://placehold.co/800x600?text=Category',
      link: `/products?category=${category.id}`,
    }));

  if (isLoading) {
    return (
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold mb-8">Explore Categories</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div 
                key={i} 
                className="rounded-lg overflow-hidden aspect-square bg-gray-200 animate-pulse"
              ></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-8">Explore Categories</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {featuredCategories.map((category) => (
            <Link
              key={category.id}
              to={category.link}
              className="relative rounded-lg overflow-hidden aspect-square group"
            >
              <img
                src={category.image}
                alt={category.name}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 transition-opacity group-hover:bg-opacity-30 flex items-center justify-center">
                <h3 className="text-white text-lg md:text-xl font-bold">{category.name}</h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedCategories;
