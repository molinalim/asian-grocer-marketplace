
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Edit, Trash, Plus } from 'lucide-react';
import { Product } from '@/components/ProductCard';
import SearchBar from '@/components/SearchBar';
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const AdminProductsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const { data: products = [], isLoading } = useQuery({
    queryKey: ['adminProducts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('Products')
        .select(`
          product_id,
          name,
          price,
          description,
          category_id,
          Categories(name),
          ProductImages(image_id, url, is_primary)
        `);

      if (error) {
        toast({
          title: "Error loading products",
          description: error.message,
          variant: "destructive",
        });
        return [];
      }

      return data.map((item: any) => {
        const primaryImage = item.ProductImages?.find((img: any) => img.is_primary) || 
                            (item.ProductImages?.length ? item.ProductImages[0] : null);
        
        return {
          id: item.product_id,
          name: item.name || 'Unnamed Product',
          price: item.price || 0,
          description: item.description || '',
          category: item.Categories?.name || 'Uncategorized',
          imageUrl: primaryImage?.url || 'https://placehold.co/200?text=No+Image',
        };
      });
    }
  });
  
  const deleteProductMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('Products')
        .delete()
        .eq('product_id', id);
        
      if (error) throw error;
      return id;
    },
    onSuccess: (id) => {
      queryClient.invalidateQueries({ queryKey: ['adminProducts'] });
      toast({
        title: "Product deleted",
        description: "The product has been successfully deleted.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error deleting product",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    }
  });

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      deleteProductMutation.mutate(id);
    }
  };
  
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Products</h1>
        <Link 
          to="/admin/products/add"
          className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-hover"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Product
        </Link>
      </div>
      
      <div className="mb-6">
        <SearchBar onSearch={handleSearch} placeholder="Search products..." />
      </div>
      
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Product
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Price
              </th>
              <th scope="col" className="relative px-6 py-3">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {isLoading ? (
              // Loading state
              Array(5).fill(0).map((_, index) => (
                <tr key={`loading-${index}`}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0 bg-gray-200 rounded-full animate-pulse"></div>
                      <div className="ml-4">
                        <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="h-4 bg-gray-200 rounded w-12 animate-pulse"></div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex justify-end space-x-2">
                      <div className="h-5 w-5 bg-gray-200 rounded animate-pulse"></div>
                      <div className="h-5 w-5 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                  </td>
                </tr>
              ))
            ) : filteredProducts.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">
                  No products found
                </td>
              </tr>
            ) : (
              filteredProducts.map((product) => (
                <tr key={product.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0">
                        <img 
                          className="h-10 w-10 rounded-full object-cover" 
                          src={product.imageUrl} 
                          alt={product.name}
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://placehold.co/200?text=No+Image';
                          }}
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {product.name}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500 capitalize">
                      {product.category.replace('-', ' ')}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">${product.price.toFixed(2)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <Link 
                        to={`/admin/products/edit/${product.id}`}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        <Edit className="h-5 w-5" />
                        <span className="sr-only">Edit</span>
                      </Link>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="text-red-600 hover:text-red-900"
                        disabled={deleteProductMutation.isPending}
                      >
                        <Trash className="h-5 w-5" />
                        <span className="sr-only">Delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminProductsPage;
