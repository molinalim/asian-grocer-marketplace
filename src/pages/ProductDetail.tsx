
import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Heart, ShoppingCart, Package, ArrowLeft } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { Product } from '@/components/ProductCard';

const ProductDetail: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { toggleItem, isInWishlist } = useWishlist();
  
  const { data: product, isLoading, isError } = useQuery({
    queryKey: ['product', productId],
    queryFn: async (): Promise<Product | null> => {
      if (!productId) return null;
      
      // Fetch product details
      const { data: productData, error: productError } = await supabase
        .from('Products')
        .select(`
          product_id,
          name,
          description,
          price,
          sku,
          category_id,
          Categories(name)
        `)
        .eq('product_id', productId)
        .single();
        
      if (productError) throw new Error(productError.message);
      if (!productData) return null;
      
      // Fetch product images
      const { data: imageData, error: imageError } = await supabase
        .from('ProductImages')
        .select('url, alt_text, is_primary')
        .eq('product_id', productId)
        .order('is_primary', { ascending: false });
        
      if (imageError) throw new Error(imageError.message);
      
      // Find primary image or use the first one
      const primaryImage = imageData?.find(img => img.is_primary) || imageData?.[0];
      
      return {
        id: productData.product_id,
        name: productData.name,
        price: productData.price,
        description: productData.description || 'No description available',
        imageUrl: primaryImage?.url || 'https://placehold.co/400?text=No+Image',
        category: productData.Categories?.name?.toLowerCase() || 'uncategorized',
        barcode: productData.sku
      };
    }
  });
  
  // Handle product not found
  if (isError || (!isLoading && !product)) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="container mx-auto px-4 py-12 flex-grow">
          <div className="max-w-lg mx-auto text-center">
            <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
            <p className="mb-6">The product you are looking for does not exist or has been removed.</p>
            <Button asChild>
              <Link to="/products">View All Products</Link>
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (isLoading || !product) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="container mx-auto px-4 py-12 flex-grow">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="h-96 bg-gray-200 rounded-lg"></div>
              <div className="space-y-4">
                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                <div className="h-6 bg-gray-200 rounded w-1/4"></div>
                <div className="h-px bg-gray-200 my-6"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Format the price
  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(product.price);
  
  // Handle add to cart
  const handleAddToCart = () => {
    addItem(product);
  };
  
  // Handle add to wishlist
  const handleToggleWishlist = () => {
    toggleItem(product);
  };
  
  const inWishlist = isInWishlist(product.id);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow bg-neutral py-8">
        <div className="container mx-auto px-4">
          {/* Breadcrumbs */}
          <nav className="mb-6">
            <ol className="flex items-center text-sm">
              <li className="flex items-center">
                <Link to="/" className="text-gray-500 hover:text-primary">Home</Link>
                <span className="mx-2 text-gray-400">/</span>
              </li>
              <li className="flex items-center">
                <Link to="/products" className="text-gray-500 hover:text-primary">Products</Link>
                <span className="mx-2 text-gray-400">/</span>
              </li>
              <li className="text-gray-900 font-medium truncate">{product.name}</li>
            </ol>
          </nav>
          
          <div className="bg-white bg-opacity-60 backdrop-blur-md p-6 rounded-lg shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Product Image */}
              <div className="rounded-lg overflow-hidden">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-auto object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://placehold.co/400?text=No+Image';
                  }}
                />
              </div>
              
              {/* Product Details */}
              <div>
                <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
                <p className="text-2xl font-bold text-primary mb-4">{formattedPrice}</p>
                
                <div className="border-t border-b py-4 my-6">
                  <p className="text-gray-700 leading-relaxed">{product.description}</p>
                </div>
                
                <div className="flex items-center text-sm text-gray-500 mb-6">
                  <Package size={16} className="mr-2" />
                  <span>Category: <span className="capitalize">{product.category}</span></span>
                </div>
                
                <div className="flex flex-col md:flex-row gap-4">
                  <Button 
                    onClick={handleAddToCart}
                    className="flex-grow flex items-center justify-center gap-2"
                  >
                    <ShoppingCart size={18} /> Add to Cart
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={handleToggleWishlist}
                    className={`flex items-center justify-center gap-2 ${
                      inWishlist ? 'border-secondary text-secondary' : ''
                    }`}
                  >
                    <Heart size={18} fill={inWishlist ? 'currentColor' : 'none'} />
                    {inWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
                  </Button>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-6">
            <Link to="/products" className="inline-flex items-center text-primary hover:underline">
              <ArrowLeft size={16} className="mr-2" /> Back to all products
            </Link>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ProductDetail;
