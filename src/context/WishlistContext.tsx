
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product } from '../components/ProductCard';
import { useToast } from "@/hooks/use-toast";

interface WishlistContextType {
  items: Product[];
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  toggleItem: (product: Product) => void;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<Product[]>([]);
  const { toast } = useToast();

  // Load wishlist from localStorage on initial render
  useEffect(() => {
    try {
      const savedWishlist = localStorage.getItem('wishlist');
      if (savedWishlist) {
        setItems(JSON.parse(savedWishlist));
      }
    } catch (error) {
      console.error('Failed to load wishlist from localStorage:', error);
    }
  }, []);

  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('wishlist', JSON.stringify(items));
    } catch (error) {
      console.error('Failed to save wishlist to localStorage:', error);
    }
  }, [items]);

  // Add item to wishlist
  const addItem = (product: Product) => {
    setItems((prevItems) => {
      if (prevItems.some((item) => item.id === product.id)) {
        return prevItems;
      }
      
      toast({
        title: "Added to wishlist",
        description: `${product.name} has been added to your wishlist.`,
      });
      
      return [...prevItems, product];
    });
  };

  // Remove item from wishlist
  const removeItem = (productId: string) => {
    setItems((prevItems) => {
      const itemToRemove = prevItems.find((item) => item.id === productId);
      
      if (itemToRemove) {
        toast({
          title: "Removed from wishlist",
          description: `${itemToRemove.name} has been removed from your wishlist.`,
        });
      }
      
      return prevItems.filter((item) => item.id !== productId);
    });
  };

  // Toggle item in wishlist (add if not present, remove if present)
  const toggleItem = (product: Product) => {
    if (isInWishlist(product.id)) {
      removeItem(product.id);
    } else {
      addItem(product);
    }
  };

  // Check if item is in wishlist
  const isInWishlist = (productId: string) => {
    return items.some((item) => item.id === productId);
  };

  // Clear wishlist
  const clearWishlist = () => {
    setItems([]);
    toast({
      title: "Wishlist cleared",
      description: "All items have been removed from your wishlist.",
    });
  };

  return (
    <WishlistContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        toggleItem,
        isInWishlist,
        clearWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
