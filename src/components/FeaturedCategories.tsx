
import React from 'react';
import { Link } from 'react-router-dom';

interface CategoryCard {
  id: string;
  name: string;
  image: string;
  link: string;
}

const FeaturedCategories: React.FC = () => {
  const categories: CategoryCard[] = [
    {
      id: 'fresh-produce',
      name: 'Fresh Produce',
      image: 'https://images.unsplash.com/photo-1540148426945-6cf22a6b2383?q=80&w=1974&auto=format&fit=crop',
      link: '/products?category=fresh-produce',
    },
    {
      id: 'pantry',
      name: 'Pantry',
      image: 'https://images.unsplash.com/photo-1585670140241-2bed9efe80f9?q=80&w=1974&auto=format&fit=crop',
      link: '/products?category=pantry',
    },
    {
      id: 'frozen',
      name: 'Frozen',
      image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?q=80&w=1925&auto=format&fit=crop',
      link: '/products?category=frozen',
    },
    {
      id: 'beverages',
      name: 'Beverages',
      image: 'https://images.unsplash.com/photo-1534353473418-4cfa6c56fd38?q=80&w=1974&auto=format&fit=crop',
      link: '/products?category=beverages',
    },
  ];

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-8">Explore Categories</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((category) => (
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
