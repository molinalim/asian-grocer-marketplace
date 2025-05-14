
import React from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowRight } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/CartContext';

const CartPage: React.FC = () => {
  const { items, removeItem, updateQuantity, clearCart, total } = useCart();
  
  // Format price
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow bg-neutral py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-8">Your Cart</h1>
          
          {items.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                  <div className="p-6 border-b">
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-semibold">
                        Items ({items.reduce((count, item) => count + item.quantity, 0)})
                      </h2>
                      <Button
                        variant="ghost"
                        className="text-gray-500 hover:text-destructive"
                        onClick={clearCart}
                      >
                        Clear Cart
                      </Button>
                    </div>
                  </div>
                  
                  {/* Cart Items List */}
                  <ul>
                    {items.map((item) => (
                      <li key={item.product.id} className="p-6 border-b">
                        <div className="flex flex-col sm:flex-row gap-4">
                          {/* Product Image */}
                          <div className="w-24 h-24 rounded overflow-hidden flex-shrink-0">
                            <img
                              src={item.product.imageUrl}
                              alt={item.product.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          
                          {/* Product Info */}
                          <div className="flex-grow">
                            <div className="flex flex-col sm:flex-row justify-between sm:items-center">
                              <div>
                                <h3 className="font-medium">
                                  <Link to={`/product/${item.product.id}`} className="hover:text-primary">
                                    {item.product.name}
                                  </Link>
                                </h3>
                                <p className="text-sm text-gray-500 capitalize">
                                  Category: {item.product.category}
                                </p>
                              </div>
                              <p className="font-semibold mt-2 sm:mt-0">
                                {formatPrice(item.product.price)}
                              </p>
                            </div>
                            
                            <div className="mt-4 flex items-center justify-between">
                              {/* Quantity Controls */}
                              <div className="flex items-center">
                                <button
                                  onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                                  className="p-2 border rounded-l-md hover:bg-gray-100"
                                  aria-label="Decrease quantity"
                                >
                                  <Minus size={16} />
                                </button>
                                <span className="px-4 py-1 border-t border-b">
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                                  className="p-2 border rounded-r-md hover:bg-gray-100"
                                  aria-label="Increase quantity"
                                >
                                  <Plus size={16} />
                                </button>
                              </div>
                              
                              {/* Remove Button */}
                              <button
                                onClick={() => removeItem(item.product.id)}
                                className="text-gray-500 hover:text-destructive flex items-center"
                                aria-label="Remove item"
                              >
                                <Trash2 size={16} className="mr-1" /> Remove
                              </button>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              
              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal</span>
                      <span>{formatPrice(total)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Shipping</span>
                      <span>Calculated at checkout</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tax</span>
                      <span>Calculated at checkout</span>
                    </div>
                    <div className="border-t pt-3 mt-3 flex justify-between font-semibold">
                      <span>Estimated Total</span>
                      <span>{formatPrice(total)}</span>
                    </div>
                  </div>
                  
                  <Button className="w-full flex items-center justify-center" asChild>
                    <Link to="/checkout">
                      Proceed to Checkout <ArrowRight size={16} className="ml-2" />
                    </Link>
                  </Button>
                  
                  <div className="mt-6 text-center text-sm text-gray-500">
                    <p>Need help? <Link to="/contact" className="text-primary hover:underline">Contact us</Link></p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white p-8 rounded-lg shadow-sm text-center">
              <div className="max-w-md mx-auto">
                <h2 className="text-xl font-medium mb-4">Your cart is empty</h2>
                <p className="text-gray-600 mb-6">
                  Looks like you haven't added any products to your cart yet.
                </p>
                <Button asChild>
                  <Link to="/products">Browse Products</Link>
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default CartPage;
