
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import CategoryFilter from '@/components/CategoryFilter';
import SearchBar from '@/components/SearchBar';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { fetchProducts, fetchCategories, fetchProductsByCategory } from '@/services/productService';
import { Category } from '@/components/CategoryFilter';
import { Product } from '@/components/ProductCard';
import { useQuery } from '@tanstack/react-query';

const ProductsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    searchParams.get('category')
  );
  const [searchTerm, setSearchTerm] = useState('');
  
  const { addItem } = useCart();
  const { toggleItem } = useWishlist();
  
  // Fetch categories
  const { 
    data: categories = [], 
    isLoading: isCategoriesLoading 
  } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories
  });

  // Fetch products based on selected category
  const { 
    data: products = [], 
    isLoading: isProductsLoading 
  } = useQuery({
    queryKey: ['products', selectedCategory],
    queryFn: () => selectedCategory ? fetchProductsByCategory(selectedCategory) : fetchProducts()
  });

  // Filter products by search term
  const filteredProducts = searchTerm 
    ? products.filter(product => {
        const searchLower = searchTerm.toLowerCase();
        return product.name.toLowerCase().includes(searchLower) || 
               product.description.toLowerCase().includes(searchLower);
      })
    : products;

  // Update URL params when category changes
  useEffect(() => {
    if (selectedCategory) {
      setSearchParams({ category: selectedCategory });
    } else {
      setSearchParams({});
    }
  }, [selectedCategory, setSearchParams]);

  // Handle category selection
  const handleCategorySelect = (categoryId: string | null) => {
    setSelectedCategory(categoryId);
  };

  // Handle search
  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow bg-neutral py-8">
        <div className="container mx-auto px-4">
          <div className="mb-8 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
            <h1 className="text-3xl font-bold">Browse Products</h1>
            <div className="max-w-md w-full">
              <SearchBar onSearch={handleSearch} />
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row gap-6">
            {/* Sidebar Filters */}
            <aside className="w-full md:w-64">
              <div className="bg-white p-4 rounded-lg shadow-sm">
                {isCategoriesLoading ? (
                  <div className="animate-pulse space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-10 bg-gray-200 rounded"></div>
                    <div className="h-10 bg-gray-200 rounded"></div>
                  </div>
                ) : (
                  <CategoryFilter
                    categories={categories}
                    selectedCategory={selectedCategory}
                    onSelectCategory={handleCategorySelect}
                  />
                )}
              </div>
            </aside>
            
            {/* Product Grid */}
            <div className="flex-grow">
              {isProductsLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {[...Array(8)].map((_, i) => (
                    <div key={i} className="bg-white rounded-lg shadow-md p-4 animate-pulse">
                      <div className="h-48 bg-gray-200 rounded-md mb-4"></div>
                      <div className="h-4 bg-gray-200 rounded mb-2 w-3/4"></div>
                      <div className="h-4 bg-gray-200 rounded mb-4 w-1/2"></div>
                      <div className="h-10 bg-gray-200 rounded"></div>
                    </div>
                  ))}
                </div>
              ) : filteredProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onAddToCart={addItem}
                      onAddToWishlist={toggleItem}
                    />
                  ))}
                </div>
              ) : (
                <div className="bg-white p-8 rounded-lg shadow-sm text-center">
                  <h3 className="text-xl font-medium mb-2">No products found</h3>
                  <p className="text-gray-600">
                    Try changing your search criteria or browse all categories.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ProductsPage;
