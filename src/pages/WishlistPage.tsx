
import React from 'react';
import { useWishlist } from '@/context/WishlistContext';
import { useCart } from '@/context/CartContext';
import { Heart, ShoppingCart, X } from 'lucide-react';
import { Link } from 'react-router-dom';

const WishlistPage: React.FC = () => {
  const { items, removeItem, clearWishlist } = useWishlist();
  const { addItem: addToCart } = useCart();

  const moveToCart = (productId: string) => {
    const item = items.find((item) => item.id === productId);
    if (item) {
      addToCart(item);
      removeItem(productId);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Wishlist</h1>
        
        {items.length > 0 && (
          <button 
            onClick={clearWishlist} 
            className="text-sm text-gray-600 hover:text-red-500 transition-colors"
          >
            Clear All
          </button>
        )}
      </div>
      
      {items.length === 0 ? (
        <div className="text-center py-12">
          <Heart className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-4 text-lg font-medium text-gray-900">Your wishlist is empty</h3>
          <p className="mt-2 text-sm text-gray-500">
            Items you add to your wishlist will appear here.
          </p>
          <div className="mt-6">
            <Link
              to="/products"
              className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              Browse Products
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 gap-6">
          {items.map((product) => (
            <div 
              key={product.id} 
              className="relative flex flex-col bg-white bg-opacity-80 rounded-lg shadow-md overflow-hidden transition-transform hover:shadow-lg"
            >
              <button 
                onClick={() => removeItem(product.id)} 
                className="absolute top-2 right-2 p-1 bg-white bg-opacity-80 rounded-full hover:bg-gray-100"
                aria-label="Remove from wishlist"
              >
                <X className="h-4 w-4 text-gray-700" />
              </button>
              
              <Link to={`/product/${product.id}`} className="block">
                <div className="aspect-w-16 aspect-h-9">
                  <img 
                    src={product.imageUrl} 
                    alt={product.name}
                    className="object-cover w-full h-48"
                  />
                </div>
                
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
                  <p className="mt-1 text-xl font-bold text-primary">${product.price.toFixed(2)}</p>
                </div>
              </Link>
              
              <div className="p-4 pt-0 mt-auto">
                <button
                  onClick={() => moveToCart(product.id)}
                  className="w-full px-4 py-2 flex items-center justify-center bg-primary text-white rounded-md hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                >
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Move to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WishlistPage;
