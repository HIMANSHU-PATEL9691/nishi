import React, { createContext, useContext, useEffect, useState } from "react";
import type { Product } from "@/data/products";
import { ensureProductGallery } from "@/lib/product-gallery";
import { apiRequest, getStoredSession, setStoredSession, type AuthSession } from "@/lib/api";

export interface AppUser {
  id: string;
  name: string;
  email: string;
  role: "customer" | "admin";
  isBlocked: boolean;
  createdAt: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  unitPrice: number;
  quantity: number;
  selectedSize: string;
  image: string;
}

export interface OrderRecord {
  id: string;
  userId: string;
  customerName: string;
  customerEmail: string;
  items: OrderItem[];
  totalAmount: number;
  paymentMethod: "Razorpay";
  paymentStatus: "Pending" | "Paid" | "Failed";
  orderStatus: "Pending" | "Paid" | "Shipped" | "Delivered" | "Cancelled";
  shippingAddress: {
    phone: string;
    address: string;
    city: string;
    pincode: string;
  };
  createdAt: string;
}

interface CreateOrderInput {
  userId: string;
  customerName: string;
  customerEmail: string;
  phone: string;
  address: string;
  city: string;
  pincode: string;
  items: OrderItem[];
  totalAmount: number;
}

interface ProductInput {
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
}

interface CustomerInput {
  name: string;
  email: string;
  password: string;
  role?: AppUser["role"];
}

interface AppDataContextType {
  products: Product[];
  users: AppUser[];
  orders: OrderRecord[];
  currentUser: AppUser | null;
  authToken: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ ok: boolean; message: string }>;
  adminLogin: (email: string, password: string) => Promise<{ ok: boolean; message: string }>;
  register: (input: CustomerInput) => Promise<{ ok: boolean; message: string }>;
  logout: () => void;
  addProduct: (input: ProductInput) => Promise<void>;
  updateProduct: (id: string, input: ProductInput) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  addCustomer: (input: CustomerInput) => Promise<{ ok: boolean; message: string }>;
  toggleCustomerBlock: (id: string) => Promise<void>;
  createOrder: (input: CreateOrderInput) => Promise<OrderRecord>;
  updateOrderStatus: (id: string, status: OrderRecord["orderStatus"]) => Promise<void>;
}

type ApiProduct = Omit<Product, "id"> & { _id?: string; id?: string };
type ApiUser = {
  _id?: string;
  id?: string;
  name: string;
  email: string;
  role: AppUser["role"];
  isBlocked?: boolean;
  createdAt?: string;
};
type ApiOrder = {
  _id?: string;
  id?: string;
  user?: string | { _id?: string; id?: string; name?: string; email?: string };
  items: Array<{
    product?: string | { _id?: string; id?: string };
    name: string;
    image: string;
    selectedSize: string;
    quantity: number;
    price: number;
  }>;
  totalAmount: number;
  paymentMethod: "Razorpay";
  paymentStatus: OrderRecord["paymentStatus"];
  orderStatus: OrderRecord["orderStatus"];
  shippingAddress: {
    fullName?: string;
    email?: string;
    phone: string;
    address: string;
    city: string;
    pincode: string;
  };
  createdAt: string;
};

const AppDataContext = createContext<AppDataContextType | undefined>(undefined);

const normalizeProduct = (product: ApiProduct): Product => ({
  id: String(product.id || product._id || ""),
  name: product.name,
  price: Number(product.price),
  originalPrice: product.originalPrice ? Number(product.originalPrice) : undefined,
  category: product.category,
  sizes: Array.isArray(product.sizes) ? product.sizes : [],
  stock: Number(product.stock),
  description: product.description,
  images: ensureProductGallery(product.images || []),
  brand: product.brand,
  featured: Boolean(product.featured),
  createdAt: product.createdAt,
});

const normalizeUser = (user: ApiUser): AppUser => ({
  id: String(user.id || user._id || ""),
  name: user.name,
  email: user.email,
  role: user.role,
  isBlocked: Boolean(user.isBlocked),
  createdAt: user.createdAt || new Date().toISOString(),
});

const normalizeOrder = (order: ApiOrder): OrderRecord => {
  const orderUser =
    typeof order.user === "string"
      ? { id: order.user }
      : {
          id: String(order.user?.id || order.user?._id || ""),
          name: order.user?.name,
          email: order.user?.email,
        };

  return {
    id: String(order.id || order._id || ""),
    userId: orderUser.id,
    customerName: order.shippingAddress.fullName || orderUser.name || "Customer",
    customerEmail: order.shippingAddress.email || orderUser.email || "",
    items: order.items.map((item) => ({
      productId:
        typeof item.product === "string"
          ? item.product
          : String(item.product?.id || item.product?._id || ""),
      productName: item.name,
      unitPrice: Number(item.price),
      quantity: Number(item.quantity),
      selectedSize: item.selectedSize,
      image: item.image,
    })),
    totalAmount: Number(order.totalAmount),
    paymentMethod: order.paymentMethod,
    paymentStatus: order.paymentStatus,
    orderStatus: order.orderStatus,
    shippingAddress: {
      phone: order.shippingAddress.phone,
      address: order.shippingAddress.address,
      city: order.shippingAddress.city,
      pincode: order.shippingAddress.pincode,
    },
    createdAt: order.createdAt,
  };
};

const buildSession = (token: string, user: AppUser): AuthSession => ({
  token,
  user: {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    isBlocked: user.isBlocked,
    createdAt: user.createdAt,
  },
});

export const AppDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [users, setUsers] = useState<AppUser[]>([]);
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [currentUser, setCurrentUser] = useState<AppUser | null>(null);
  const [authToken, setAuthToken] = useState<string | null>(() => getStoredSession()?.token || null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshProducts = async () => {
    const response = await apiRequest<{ products: ApiProduct[] }>("/products");
    setProducts(response.products.map(normalizeProduct));
  };

  const refreshPrivateData = async (session: AuthSession | null) => {
    if (!session?.token) {
      setUsers([]);
      setOrders([]);
      return;
    }

    if (session.user.role === "admin") {
      const [usersResponse, ordersResponse] = await Promise.all([
        apiRequest<{ users: ApiUser[] }>("/admin/users", { token: session.token }),
        apiRequest<{ orders: ApiOrder[] }>("/orders/admin", { token: session.token }),
      ]);

      setUsers(usersResponse.users.map(normalizeUser));
      setOrders(ordersResponse.orders.map(normalizeOrder));
      return;
    }

    const ordersResponse = await apiRequest<{ orders: ApiOrder[] }>("/orders/my-orders", {
      token: session.token,
    });

    setUsers([]);
    setOrders(ordersResponse.orders.map(normalizeOrder));
  };

  useEffect(() => {
    let isActive = true;

    const bootstrap = async () => {
      try {
        await refreshProducts();

        const stored = getStoredSession();
        if (!stored?.token) {
          return;
        }

        const meResponse = await apiRequest<{ user: ApiUser }>("/auth/me", {
          token: stored.token,
        });

        if (!isActive) {
          return;
        }

        const user = normalizeUser(meResponse.user);
        const session = buildSession(stored.token, user);
        setStoredSession(session);
        setAuthToken(session.token);
        setCurrentUser(user);
        await refreshPrivateData(session);
      } catch {
        if (!isActive) {
          return;
        }

        setStoredSession(null);
        setAuthToken(null);
        setCurrentUser(null);
        setUsers([]);
        setOrders([]);
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    };

    void bootstrap();

    return () => {
      isActive = false;
    };
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await apiRequest<{
        message: string;
        token: string;
        user: ApiUser;
      }>("/auth/login", {
        method: "POST",
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          password,
        }),
      });

      const user = normalizeUser(response.user);

      if (user.role !== "customer") {
        return { ok: false, message: "This login is only for customers. Admin must use the admin login page." };
      }

      const session = buildSession(response.token, user);

      setStoredSession(session);
      setAuthToken(session.token);
      setCurrentUser(user);
      await refreshPrivateData(session);

      return { ok: true, message: response.message || `Welcome back, ${user.name}.` };
    } catch (error) {
      return { ok: false, message: error instanceof Error ? error.message : "Login failed." };
    }
  };

  const adminLogin = async (email: string, password: string) => {
    try {
      const response = await apiRequest<{
        message: string;
        token: string;
        user: ApiUser;
      }>("/auth/login", {
        method: "POST",
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          password,
        }),
      });

      const user = normalizeUser(response.user);

      if (user.role !== "admin") {
        return { ok: false, message: "This login is only for admin access." };
      }

      const session = buildSession(response.token, user);

      setStoredSession(session);
      setAuthToken(session.token);
      setCurrentUser(user);
      await refreshPrivateData(session);

      return { ok: true, message: response.message || `Welcome back, ${user.name}.` };
    } catch (error) {
      return { ok: false, message: error instanceof Error ? error.message : "Admin login failed." };
    }
  };

  const register = async (input: CustomerInput) => {
    try {
      const response = await apiRequest<{
        message: string;
        token: string;
        user: ApiUser;
      }>("/auth/register", {
        method: "POST",
        body: JSON.stringify({
          name: input.name.trim(),
          email: input.email.trim().toLowerCase(),
          password: input.password,
        }),
      });

      const user = normalizeUser(response.user);

      setStoredSession(null);
      setAuthToken(null);
      setCurrentUser(null);
      setUsers([]);
      setOrders([]);

      return {
        ok: true,
        message: response.message || `${user.name} has been created successfully. Please log in to continue.`,
      };
    } catch (error) {
      return { ok: false, message: error instanceof Error ? error.message : "Registration failed." };
    }
  };

  const logout = () => {
    setStoredSession(null);
    setAuthToken(null);
    setCurrentUser(null);
    setUsers([]);
    setOrders([]);
  };

  const addProduct = async (input: ProductInput) => {
    if (!authToken) {
      throw new Error("Please log in again.");
    }

    const response = await apiRequest<{ product: ApiProduct }>("/products", {
      method: "POST",
      token: authToken,
      body: JSON.stringify({
        ...input,
        images: ensureProductGallery(input.images),
      }),
    });

    setProducts((prev) => [normalizeProduct(response.product), ...prev]);
  };

  const updateProduct = async (id: string, input: ProductInput) => {
    if (!authToken) {
      throw new Error("Please log in again.");
    }

    const response = await apiRequest<{ product: ApiProduct }>(`/products/${id}`, {
      method: "PUT",
      token: authToken,
      body: JSON.stringify({
        ...input,
        images: ensureProductGallery(input.images),
      }),
    });

    const nextProduct = normalizeProduct(response.product);
    setProducts((prev) => prev.map((product) => (product.id === id ? nextProduct : product)));
  };

  const deleteProduct = async (id: string) => {
    if (!authToken) {
      throw new Error("Please log in again.");
    }

    await apiRequest(`/products/${id}`, {
      method: "DELETE",
      token: authToken,
    });

    setProducts((prev) => prev.filter((product) => product.id !== id));
  };

  const addCustomer = async (input: CustomerInput) => {
    if (!authToken) {
      return { ok: false, message: "Please log in again." };
    }

    try {
      const response = await apiRequest<{ message: string; user: ApiUser }>("/admin/users", {
        method: "POST",
        token: authToken,
        body: JSON.stringify({
          name: input.name.trim(),
          email: input.email.trim().toLowerCase(),
          password: input.password,
          role: input.role ?? "customer",
        }),
      });

      setUsers((prev) => [normalizeUser(response.user), ...prev]);
      return { ok: true, message: response.message || "Customer created successfully." };
    } catch (error) {
      return {
        ok: false,
        message: error instanceof Error ? error.message : "Customer creation failed.",
      };
    }
  };

  const toggleCustomerBlock = async (id: string) => {
    if (!authToken) {
      throw new Error("Please log in again.");
    }

    const response = await apiRequest<{ user: ApiUser }>(`/admin/users/${id}/block`, {
      method: "PUT",
      token: authToken,
    });

    const nextUser = normalizeUser(response.user);
    setUsers((prev) => prev.map((user) => (user.id === id ? nextUser : user)));
  };

  const createOrder = async (input: CreateOrderInput) => {
    if (!authToken) {
      throw new Error("Please log in again.");
    }

    const response = await apiRequest<{ order: ApiOrder }>("/orders", {
      method: "POST",
      token: authToken,
      body: JSON.stringify({
        shippingAddress: {
          fullName: input.customerName,
          email: input.customerEmail,
          phone: input.phone,
          address: input.address,
          city: input.city,
          pincode: input.pincode,
        },
        paymentMethod: "Razorpay",
        paymentStatus: "Paid",
      }),
    });

    const nextOrder = normalizeOrder(response.order);
    setOrders((prev) => [nextOrder, ...prev]);
    await refreshProducts();
    return nextOrder;
  };

  const updateOrderStatus = async (id: string, status: OrderRecord["orderStatus"]) => {
    if (!authToken) {
      throw new Error("Please log in again.");
    }

    const response = await apiRequest<{ order: ApiOrder }>(`/orders/${id}/status`, {
      method: "PUT",
      token: authToken,
      body: JSON.stringify({
        orderStatus: status,
        paymentStatus: status === "Cancelled" ? "Failed" : undefined,
      }),
    });

    const nextOrder = normalizeOrder(response.order);
    setOrders((prev) => prev.map((order) => (order.id === id ? nextOrder : order)));
  };

  const value = {
    products,
    users,
    orders,
    currentUser,
    authToken,
    isLoading,
    login,
    adminLogin,
    register,
    logout,
    addProduct,
    updateProduct,
    deleteProduct,
    addCustomer,
    toggleCustomerBlock,
    createOrder,
    updateOrderStatus,
  };

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>;
};

export const useAppData = () => {
  const context = useContext(AppDataContext);
  if (!context) {
    throw new Error("useAppData must be used within AppDataProvider");
  }
  return context;
};
