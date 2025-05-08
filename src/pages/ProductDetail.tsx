
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Heart, ShoppingCart, Package, ArrowLeft } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { products } from '@/data/products';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';

const ProductDetail: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const { addItem } = useCart();
  const { toggleItem, isInWishlist } = useWishlist();
  
  // Find the product with the matching ID
  const product = products.find(p => p.id === productId);
  
  // If product not found, display error message
  if (!product) {
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
          
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Product Image */}
              <div className="rounded-lg overflow-hidden">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-auto object-cover"
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
