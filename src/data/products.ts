import { ensureProductGallery } from "@/lib/product-gallery";

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  category: "men" | "women" | "kids";
  sizes: string[];
  stock: number;
  description: string;
  images: string[];
  brand: string;
  featured?: boolean;
  createdAt?: string;
}

export const products: Product[] = [
  {
    id: "1",
    name: "Classic Navy Blazer",
    price: 4999,
    originalPrice: 7999,
    category: "men",
    sizes: ["S", "M", "L", "XL"],
    stock: 15,
    description: "A timeless navy blazer crafted from premium wool blend fabric. Perfect for formal occasions and business meetings.",
    images: ["https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=800&fit=crop"],
    brand: "Nishi Originals",
    featured: true,
  },
  {
    id: "2",
    name: "Floral Summer Dress",
    price: 2499,
    originalPrice: 3999,
    category: "women",
    sizes: ["XS", "S", "M", "L"],
    stock: 22,
    description: "Light and breezy floral dress perfect for summer outings. Made from breathable cotton fabric.",
    images: ["https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=600&h=800&fit=crop"],
    brand: "Nishi Originals",
    featured: true,
  },
  {
    id: "3",
    name: "Slim Fit Chinos",
    price: 1999,
    originalPrice: 2999,
    category: "men",
    sizes: ["28", "30", "32", "34", "36"],
    stock: 30,
    description: "Comfortable slim-fit chinos in a versatile khaki shade. Stretchable fabric for all-day comfort.",
    images: ["https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=600&h=800&fit=crop"],
    brand: "Nishi Basics",
  },
  {
    id: "4",
    name: "Kids Denim Jacket",
    price: 1499,
    originalPrice: 2499,
    category: "kids",
    sizes: ["2-3Y", "4-5Y", "6-7Y", "8-9Y"],
    stock: 18,
    description: "Trendy denim jacket for kids with soft inner lining. Durable and stylish for everyday wear.",
    images: ["https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=600&h=800&fit=crop"],
    brand: "Nishi Kids",
    featured: true,
  },
  {
    id: "5",
    name: "Silk Saree - Royal Blue",
    price: 8999,
    originalPrice: 12999,
    category: "women",
    sizes: ["Free Size"],
    stock: 8,
    description: "Elegant silk saree in royal blue with intricate gold border work. Perfect for festive occasions.",
    images: ["https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&h=800&fit=crop"],
    brand: "Nishi Heritage",
    featured: true,
  },
  {
    id: "6",
    name: "Cotton Polo T-Shirt",
    price: 899,
    originalPrice: 1499,
    category: "men",
    sizes: ["S", "M", "L", "XL", "XXL"],
    stock: 50,
    description: "Classic cotton polo in multiple colors. Breathable fabric perfect for casual outings.",
    images: ["https://images.unsplash.com/photo-1625910513413-5fc5e02f87e1?w=600&h=800&fit=crop"],
    brand: "Nishi Basics",
  },
  {
    id: "7",
    name: "Embroidered Kurti Set",
    price: 1799,
    originalPrice: 2999,
    category: "women",
    sizes: ["S", "M", "L", "XL"],
    stock: 25,
    description: "Beautiful embroidered kurti with palazzo pants. Comfortable and elegant ethnic wear.",
    images: ["https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=600&h=800&fit=crop"],
    brand: "Nishi Ethnic",
  },
  {
    id: "8",
    name: "Kids Party Frock",
    price: 1299,
    category: "kids",
    sizes: ["2-3Y", "4-5Y", "6-7Y"],
    stock: 12,
    description: "Sparkling party frock with tulle layers. Perfect for birthdays and celebrations.",
    images: ["https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=600&h=800&fit=crop"],
    brand: "Nishi Kids",
  },
  {
    id: "9",
    name: "Formal White Shirt",
    price: 1299,
    originalPrice: 1999,
    category: "men",
    sizes: ["S", "M", "L", "XL"],
    stock: 40,
    description: "Crisp white formal shirt in premium cotton. Wrinkle-resistant and comfortable.",
    images: ["https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&h=800&fit=crop"],
    brand: "Nishi Formals",
    featured: true,
  },
  {
    id: "10",
    name: "Leather Crossbody Bag",
    price: 2999,
    originalPrice: 4999,
    category: "women",
    sizes: ["One Size"],
    stock: 15,
    description: "Genuine leather crossbody bag with adjustable strap. Multiple compartments for organized storage.",
    images: ["https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&h=800&fit=crop"],
    brand: "Nishi Accessories",
    featured: true,
  },
  {
    id: "11",
    name: "Kids Tracksuit Set",
    price: 999,
    originalPrice: 1799,
    category: "kids",
    sizes: ["3-4Y", "5-6Y", "7-8Y", "9-10Y"],
    stock: 20,
    description: "Comfortable cotton tracksuit set with hoodie. Perfect for sports and casual wear.",
    images: ["https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?w=600&h=800&fit=crop"],
    brand: "Nishi Kids",
  },
  {
    id: "12",
    name: "Designer Kurta - Festive",
    price: 3499,
    originalPrice: 5499,
    category: "men",
    sizes: ["S", "M", "L", "XL"],
    stock: 10,
    description: "Premium designer kurta with subtle embroidery. Perfect for weddings and festivals.",
    images: ["https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&h=800&fit=crop"],
    brand: "Nishi Heritage",
  },
];

export const initialProducts: Product[] = products.map((product) => ({
  ...product,
  images: ensureProductGallery(product.images),
  createdAt: product.createdAt ?? "2026-03-01T10:00:00.000Z",
}));
