
import React from 'react';
import { Heart, ShoppingCart } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export interface Product {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  category: string;
  description: string;
}

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onAddToWishlist: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  onAddToWishlist,
}) => {
  const { toast } = useToast();

  const handleAddToCart = () => {
    onAddToCart(product);
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  const handleAddToWishlist = () => {
    onAddToWishlist(product);
    toast({
      title: "Added to wishlist",
      description: `${product.name} has been added to your wishlist.`,
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  return (
    <div className="bg-white bg-opacity-80 backdrop-blur-sm rounded-lg shadow-md p-4 transition-all duration-300 hover:scale-105 hover:shadow-lg">
      <div className="relative mb-4 overflow-hidden rounded-md">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <button
          onClick={handleAddToWishlist}
          className="absolute top-2 right-2 p-1.5 bg-white bg-opacity-80 rounded-full hover:bg-opacity-100 transition-colors"
          aria-label="Add to wishlist"
        >
          <Heart size={18} className="text-primary" />
        </button>
      </div>
      <div>
        <h3 className="font-medium text-lg mb-1">{product.name}</h3>
        <p className="text-lg font-bold text-primary mb-3">
          {formatPrice(product.price)}
        </p>
        <Button
          onClick={handleAddToCart}
          className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover rounded-full"
        >
          <ShoppingCart size={18} /> Add to Cart
        </Button>
      </div>
    </div>
  );
};

export default ProductCard;
