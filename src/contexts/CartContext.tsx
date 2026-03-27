import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import type { Product } from "@/data/products";
import { useAppData } from "@/contexts/AppDataContext";
import { apiRequest } from "@/lib/api";
import { ensureProductGallery } from "@/lib/product-gallery";

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize: string;
}

interface CartContextType {
  items: CartItem[];
  addItem: (product: Product, size: string, qty?: number) => Promise<void>;
  removeItem: (productId: string, size: string) => Promise<void>;
  updateQuantity: (productId: string, size: string, qty: number) => Promise<void>;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

type ApiCartItem = {
  product: {
    _id?: string;
    id?: string;
    name: string;
    price: number;
    originalPrice?: number;
    category: Product["category"];
    sizes: string[];
    stock: number;
    description: string;
    images: string[];
    brand: string;
    featured?: boolean;
    createdAt?: string;
  };
  quantity: number;
  selectedSize: string;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

const normalizeCartItem = (item: ApiCartItem): CartItem => ({
  product: {
    id: String(item.product.id || item.product._id || ""),
    name: item.product.name,
    price: Number(item.product.price),
    originalPrice: item.product.originalPrice ? Number(item.product.originalPrice) : undefined,
    category: item.product.category,
    sizes: item.product.sizes || [],
    stock: Number(item.product.stock),
    description: item.product.description,
    images: ensureProductGallery(item.product.images || []),
    brand: item.product.brand,
    featured: Boolean(item.product.featured),
    createdAt: item.product.createdAt,
  },
  quantity: Number(item.quantity),
  selectedSize: item.selectedSize,
});

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { authToken, currentUser } = useAppData();
  const [items, setItems] = useState<CartItem[]>([]);

  const refreshCart = useCallback(async () => {
    if (!authToken || !currentUser) {
      setItems([]);
      return;
    }

    const response = await apiRequest<{ cart: { items: ApiCartItem[] } }>("/cart", {
      token: authToken,
    });
    setItems(response.cart.items.map(normalizeCartItem));
  }, [authToken, currentUser]);

  useEffect(() => {
    void refreshCart();
  }, [refreshCart]);

  const addItem = useCallback(
    async (product: Product, size: string, qty = 1) => {
      if (!authToken || !currentUser) {
        throw new Error("Please sign in to add items to your cart.");
      }

      const response = await apiRequest<{ cart: { items: ApiCartItem[] } }>("/cart/add", {
        method: "POST",
        token: authToken,
        body: JSON.stringify({
          productId: product.id,
          quantity: qty,
          selectedSize: size,
        }),
      });

      setItems(response.cart.items.map(normalizeCartItem));
    },
    [authToken, currentUser],
  );

  const removeItem = useCallback(
    async (productId: string, size: string) => {
      if (!authToken || !currentUser) {
        setItems([]);
        return;
      }

      const response = await apiRequest<{ cart: { items: ApiCartItem[] } }>("/cart/remove", {
        method: "DELETE",
        token: authToken,
        body: JSON.stringify({
          productId,
          selectedSize: size,
        }),
      });

      setItems(response.cart.items.map(normalizeCartItem));
    },
    [authToken, currentUser],
  );

  const updateQuantity = useCallback(
    async (productId: string, size: string, qty: number) => {
      if (qty <= 0) {
        await removeItem(productId, size);
        return;
      }

      if (!authToken || !currentUser) {
        setItems([]);
        return;
      }

      const response = await apiRequest<{ cart: { items: ApiCartItem[] } }>(`/cart/item/${productId}`, {
        method: "PUT",
        token: authToken,
        body: JSON.stringify({
          selectedSize: size,
          quantity: qty,
        }),
      });

      setItems(response.cart.items.map(normalizeCartItem));
    },
    [authToken, currentUser, removeItem],
  );

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart, totalItems, totalPrice }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};
