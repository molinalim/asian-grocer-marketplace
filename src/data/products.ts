import { Product } from '../components/ProductCard';

export const products: Product[] = [
  {
    id: "1",
    name: "Premium Jasmine Rice",
    price: 14.99,
    imageUrl: "https://images.unsplash.com/photo-1586201375800-0605a5c4d40b?q=80&w=1470&auto=format&fit=crop",
    category: "pantry",
    description: "High-quality jasmine rice imported directly from Thailand. Perfect for all your Asian dishes with its fragrant aroma and sticky texture when cooked.",
    barcode: "8901234567890"
  },
  {
    id: "2",
    name: "Instant Ramen Variety Pack",
    price: 12.99,
    imageUrl: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?q=80&w=1480&auto=format&fit=crop",
    category: "pantry",
    description: "A variety pack of authentic Asian instant ramen. Includes popular flavors like tonkotsu, shoyu, miso, and spicy."
  },
  {
    id: "3",
    name: "Premium Soy Sauce",
    price: 6.99,
    imageUrl: "https://images.unsplash.com/photo-1608287976767-d1a0689e346a?q=80&w=1355&auto=format&fit=crop",
    category: "pantry",
    description: "Traditionally brewed soy sauce using time-honored methods. A staple in Asian cooking, perfect for marinades, stir-fries, and dipping."
  },
  {
    id: "4",
    name: "Green Tea",
    price: 8.99,
    imageUrl: "https://images.unsplash.com/photo-1582560474992-385ebb9b29a4?q=80&w=1470&auto=format&fit=crop",
    category: "beverages",
    description: "Premium Japanese green tea leaves. Rich in antioxidants with a delicate flavor and soothing aroma."
  },
  {
    id: "5",
    name: "Korean Kimchi",
    price: 9.99,
    imageUrl: "https://images.unsplash.com/photo-1583224293561-6a8889101d54?q=80&w=1471&auto=format&fit=crop",
    category: "fresh-produce",
    description: "Traditional fermented Korean side dish made with napa cabbage, radish, and a variety of seasonings. Spicy, tangy, and probiotic-rich."
  },
  {
    id: "6",
    name: "Frozen Dumplings",
    price: 15.99,
    imageUrl: "https://images.unsplash.com/photo-1563245372-f21724e3856d?q=80&w=1374&auto=format&fit=crop",
    category: "frozen",
    description: "Assorted pork and vegetable dumplings, ready to steam or pan-fry. Perfect for quick meals and appetizers."
  },
  {
    id: "7",
    name: "Sriracha Hot Sauce",
    price: 4.99,
    imageUrl: "https://images.unsplash.com/photo-1594945209171-0dcbcaabdbe5?q=80&w=1470&auto=format&fit=crop",
    category: "pantry",
    description: "The iconic Thai hot sauce made from sun-ripened chilis. Adds the perfect kick to any dish."
  },
  {
    id: "8",
    name: "Miso Paste",
    price: 7.99,
    imageUrl: "https://images.unsplash.com/photo-1589187161566-d9740c1a2c7e?q=80&w=1496&auto=format&fit=crop",
    category: "pantry",
    description: "Traditional Japanese fermented soybean paste. Essential for miso soup, marinades, and dressings."
  },
  {
    id: "9",
    name: "Pocky Chocolate Sticks",
    price: 3.49,
    imageUrl: "https://images.unsplash.com/photo-1627308594171-ebd99b8a5dce?q=80&w=1335&auto=format&fit=crop",
    category: "snacks",
    description: "Popular Japanese biscuit sticks dipped in chocolate. A fun and tasty snack for all ages."
  },
  {
    id: "10",
    name: "Coconut Milk",
    price: 2.99,
    imageUrl: "https://images.unsplash.com/photo-1612776569409-5aae4c801342?q=80&w=1025&auto=format&fit=crop",
    category: "pantry",
    description: "Rich and creamy coconut milk. Perfect for curries, soups, desserts, and beverages."
  },
  {
    id: "11",
    name: "Bok Choy",
    price: 2.49,
    imageUrl: "https://images.unsplash.com/photo-1595856619767-a891d21d3f97?q=80&w=1528&auto=format&fit=crop",
    category: "fresh-produce",
    description: "Fresh Chinese cabbage with crisp stalks and tender leaves. Great for stir-fries, soups, and side dishes."
  },
  {
    id: "12",
    name: "Bubble Tea Kit",
    price: 18.99,
    imageUrl: "https://images.unsplash.com/photo-1558857563-b371033873b8?q=80&w=1374&auto=format&fit=crop",
    category: "beverages",
    description: "Complete kit to make bubble tea at home. Includes tea, tapioca pearls, and flavored syrups."
  }
];

export const categories = [
  { id: "pantry", name: "Pantry" },
  { id: "beverages", name: "Beverages" },
  { id: "fresh-produce", name: "Fresh Produce" },
  { id: "frozen", name: "Frozen" },
  { id: "snacks", name: "Snacks" }
];
