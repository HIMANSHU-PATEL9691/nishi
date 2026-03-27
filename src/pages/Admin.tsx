import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  BarChart3,
  Boxes,
  IndianRupee,
  LayoutDashboard,
  LogOut,
  Package,
  ShoppingCart,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppData, type OrderRecord } from "@/contexts/AppDataContext";
import { formatCurrency, formatDate } from "@/lib/format";
import type { Product } from "@/data/products";

const emptyProductForm = {
  name: "",
  price: "",
  originalPrice: "",
  category: "men" as Product["category"],
  sizes: "S, M, L",
  stock: "",
  description: "",
  images: "",
  brand: "",
  featured: false,
};

const emptyCustomerForm = {
  name: "",
  email: "",
  password: "",
  role: "customer" as const,
};

const navItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "products", label: "Products", icon: Boxes },
  { id: "orders", label: "Orders", icon: ShoppingCart },
  { id: "users", label: "Users", icon: Users },
  { id: "reports", label: "Reports", icon: BarChart3 },
];

const panelClass = "rounded-[18px] border border-[#e4e9f3] bg-white p-6 shadow-[0_6px_22px_rgba(15,23,42,0.05)]";

const Admin = () => {
  const {
    currentUser,
    products,
    users,
    orders,
    addProduct,
    updateProduct,
    deleteProduct,
    addCustomer,
    toggleCustomerBlock,
    updateOrderStatus,
    logout,
  } = useAppData();

  const [activeSection, setActiveSection] = useState("dashboard");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [productForm, setProductForm] = useState(emptyProductForm);
  const [customerForm, setCustomerForm] = useState(emptyCustomerForm);
  const [message, setMessage] = useState("");

  const metrics = useMemo(() => {
    const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
    const totalOrders = orders.length;
    const totalProducts = products.length;
    const totalUsers = users.filter((user) => user.role === "customer").length;
    const delivered = orders.filter((order) => order.orderStatus === "Delivered").length;
    const pending = orders.filter((order) => order.orderStatus === "Pending" || order.orderStatus === "Paid").length;
    const cancelled = orders.filter((order) => order.orderStatus === "Cancelled").length;

    return {
      totalRevenue,
      totalOrders,
      totalProducts,
      totalUsers,
      delivered,
      pending,
      cancelled,
    };
  }, [orders, products, users]);

  if (!currentUser || currentUser.role !== "admin") {
    return (
      <div className="nishi-page">
        <div className="container mx-auto px-4 py-20 text-center">
          <div className="mx-auto max-w-xl rounded-[20px] border border-[#e4e9f3] bg-white px-6 py-16 shadow-sm">
            <h1 className="text-3xl font-semibold text-slate-950">Admin access only</h1>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              Sign in with the admin account to manage products, customers and orders.
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <Button asChild className="rounded-md bg-[#2874f0] hover:bg-[#1f66da]">
                <Link to="/admin-login">Go to Admin Login</Link>
              </Button>
              <Button asChild variant="outline" className="rounded-md border-[#dce3f0]">
                <Link to="/">Back to Store</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const customerUsers = users.filter((user) => user.role === "customer");
  const orderStatusOptions: OrderRecord["orderStatus"][] = ["Pending", "Paid", "Shipped", "Delivered", "Cancelled"];

  const startEdit = (product: Product) => {
    setEditingId(product.id);
    setActiveSection("products");
    setProductForm({
      name: product.name,
      price: String(product.price),
      originalPrice: product.originalPrice ? String(product.originalPrice) : "",
      category: product.category,
      sizes: product.sizes.join(", "),
      stock: String(product.stock),
      description: product.description,
      images: product.images.join(", "),
      brand: product.brand,
      featured: Boolean(product.featured),
    });
  };

  const resetProductForm = () => {
    setEditingId(null);
    setProductForm(emptyProductForm);
  };

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      name: productForm.name.trim(),
      price: Number(productForm.price),
      originalPrice: productForm.originalPrice ? Number(productForm.originalPrice) : undefined,
      category: productForm.category,
      sizes: productForm.sizes.split(",").map((value) => value.trim()).filter(Boolean),
      stock: Number(productForm.stock),
      description: productForm.description.trim(),
      images: productForm.images.split(",").map((value) => value.trim()).filter(Boolean),
      brand: productForm.brand.trim(),
      featured: productForm.featured,
    };

    try {
      if (editingId) {
        await updateProduct(editingId, payload);
        setMessage("Product updated successfully.");
      } else {
        await addProduct(payload);
        setMessage("Product added successfully.");
      }

      resetProductForm();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to save product.");
    }
  };

  const handleCustomerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await addCustomer({
      name: customerForm.name,
      email: customerForm.email,
      password: customerForm.password,
      role: customerForm.role,
    });
    setMessage(result.message);
    if (result.ok) {
      setCustomerForm(emptyCustomerForm);
    }
  };

  const renderDashboard = () => (
    <div className="space-y-6">
      <div>
        <p className="nishi-section-kicker">Admin Dashboard</p>
        <h1 className="mt-2 text-4xl font-semibold text-slate-950">Store overview</h1>
      </div>

      <div className="grid gap-4 xl:grid-cols-4 md:grid-cols-2">
        {[
          { label: "Total Revenue", value: formatCurrency(metrics.totalRevenue), icon: IndianRupee, color: "bg-emerald-50 text-emerald-600" },
          { label: "Total Orders", value: String(metrics.totalOrders), icon: ShoppingCart, color: "bg-blue-50 text-blue-600" },
          { label: "Products", value: String(metrics.totalProducts), icon: Package, color: "bg-violet-50 text-violet-600" },
          { label: "Users", value: String(metrics.totalUsers), icon: Users, color: "bg-amber-50 text-amber-600" },
        ].map((card) => (
          <div key={card.label} className={panelClass}>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">{card.label}</p>
                <p className="mt-3 text-4xl font-semibold text-slate-950">{card.value}</p>
              </div>
              <div className={`rounded-xl p-3 ${card.color}`}>
                <card.icon className="h-5 w-5" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.9fr_0.9fr]">
        <div className={panelClass}>
          <h2 className="text-lg font-semibold text-slate-950">Recent Orders</h2>
          <div className="mt-5 space-y-3">
            {orders.slice(0, 5).map((order) => (
              <div key={order.id} className="flex items-start justify-between rounded-xl bg-[#f8fbff] p-4">
                <div>
                  <p className="font-medium text-slate-900">{order.customerName}</p>
                  <p className="text-sm text-slate-500">{formatDate(order.createdAt)}</p>
                </div>
                <span className="font-semibold text-slate-950">{formatCurrency(order.totalAmount)}</span>
              </div>
            ))}
            {orders.length === 0 && <div className="rounded-xl border border-dashed border-[#dce3f0] p-8 text-center text-slate-400">No orders yet</div>}
          </div>
        </div>

        <div className={panelClass}>
          <h2 className="text-lg font-semibold text-slate-950">Order Status</h2>
          <div className="mt-5 space-y-3">
            {[
              { label: "Pending", value: metrics.pending, color: "bg-amber-400" },
              { label: "Delivered", value: metrics.delivered, color: "bg-emerald-500" },
              { label: "Cancelled", value: metrics.cancelled, color: "bg-rose-500" },
            ].map((item) => (
              <div key={item.label} className="rounded-xl bg-[#f8fbff] p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className={`h-3 w-3 rounded-full ${item.color}`} />
                    <span className="font-medium text-slate-700">{item.label}</span>
                  </div>
                  <span className="text-xl font-semibold text-slate-950">{item.value}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderProducts = () => (
    <div className="space-y-6">
      <div>
        <p className="nishi-section-kicker">Catalog Control</p>
        <h1 className="mt-2 text-4xl font-semibold text-slate-950">Products</h1>
      </div>

      <div className={`${panelClass} space-y-5`}>
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-slate-950">{editingId ? "Edit Product" : "Add Product"}</h2>
            <p className="mt-1 text-sm text-slate-500">Manage product details with a cleaner admin workflow.</p>
          </div>
          {editingId && (
            <Button variant="outline" className="rounded-md border-[#dce3f0]" onClick={resetProductForm}>
              Cancel Edit
            </Button>
          )}
        </div>

        <form onSubmit={handleProductSubmit} className="grid gap-4 md:grid-cols-2">
          <input required value={productForm.name} onChange={(e) => setProductForm((prev) => ({ ...prev, name: e.target.value }))} placeholder="Product name" className="nishi-input" />
          <input required value={productForm.brand} onChange={(e) => setProductForm((prev) => ({ ...prev, brand: e.target.value }))} placeholder="Brand" className="nishi-input" />
          <input required type="number" min="0" value={productForm.price} onChange={(e) => setProductForm((prev) => ({ ...prev, price: e.target.value }))} placeholder="Price" className="nishi-input" />
          <input type="number" min="0" value={productForm.originalPrice} onChange={(e) => setProductForm((prev) => ({ ...prev, originalPrice: e.target.value }))} placeholder="Original price" className="nishi-input" />
          <select value={productForm.category} onChange={(e) => setProductForm((prev) => ({ ...prev, category: e.target.value as Product["category"] }))} className="nishi-input">
            <option value="men">Men</option>
            <option value="women">Women</option>
            <option value="kids">Kids</option>
          </select>
          <input required type="number" min="0" value={productForm.stock} onChange={(e) => setProductForm((prev) => ({ ...prev, stock: e.target.value }))} placeholder="Stock" className="nishi-input" />
          <input required value={productForm.sizes} onChange={(e) => setProductForm((prev) => ({ ...prev, sizes: e.target.value }))} placeholder="Sizes, comma separated" className="nishi-input md:col-span-2" />
          <input required value={productForm.images} onChange={(e) => setProductForm((prev) => ({ ...prev, images: e.target.value }))} placeholder="Image URLs, comma separated" className="nishi-input md:col-span-2" />
          <textarea required value={productForm.description} onChange={(e) => setProductForm((prev) => ({ ...prev, description: e.target.value }))} placeholder="Description" className="nishi-textarea min-h-28 md:col-span-2" />
          <label className="flex items-center gap-3 rounded-xl border border-[#e4e9f3] bg-[#f8fbff] px-4 py-3 text-sm text-slate-700 md:col-span-2">
            <input type="checkbox" checked={productForm.featured} onChange={(e) => setProductForm((prev) => ({ ...prev, featured: e.target.checked }))} />
            Show this product in featured section
          </label>
          <div className="md:col-span-2">
            <Button type="submit" className="rounded-md bg-[#2874f0] hover:bg-[#1f66da]">{editingId ? "Update Product" : "Add Product"}</Button>
          </div>
        </form>
      </div>

      <div className={panelClass}>
        <h2 className="text-xl font-semibold text-slate-950">All Products</h2>
        <div className="mt-5 overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-[#e4e9f3] text-slate-500">
              <tr>
                <th className="pb-3 pr-4">Product</th>
                <th className="pb-3 pr-4">Category</th>
                <th className="pb-3 pr-4">Price</th>
                <th className="pb-3 pr-4">Stock</th>
                <th className="pb-3 pr-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-b border-[#f1f4f8]">
                  <td className="py-4 pr-4">
                    <div className="flex items-center gap-3">
                      <img src={product.images[0]} alt={product.name} className="h-14 w-12 rounded-lg object-cover" />
                      <div>
                        <p className="font-medium text-slate-900">{product.name}</p>
                        <p className="text-xs text-slate-500">{product.brand}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 pr-4 capitalize text-slate-600">{product.category}</td>
                  <td className="py-4 pr-4 text-slate-900">{formatCurrency(product.price)}</td>
                  <td className="py-4 pr-4 text-slate-900">{product.stock}</td>
                  <td className="py-4 pr-4">
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="rounded-md border-[#dce3f0]" onClick={() => startEdit(product)}>Edit</Button>
                      <Button variant="outline" size="sm" className="rounded-md border-[#dce3f0]" onClick={() => void deleteProduct(product.id)}>Delete</Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderOrders = () => (
    <div className="space-y-6">
      <div>
        <p className="nishi-section-kicker">Order Control</p>
        <h1 className="mt-2 text-4xl font-semibold text-slate-950">Orders</h1>
      </div>
      <div className={panelClass}>
        <h2 className="text-xl font-semibold text-slate-950">Order Management</h2>
        <div className="mt-5 space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="rounded-xl border border-[#e4e9f3] bg-[#f8fbff] p-4">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <p className="font-semibold text-slate-900">{order.customerName}</p>
                  <p className="text-sm text-slate-500">{order.customerEmail}</p>
                  <p className="mt-1 text-xs text-slate-500">
                    {formatDate(order.createdAt)} · {formatCurrency(order.totalAmount)}
                  </p>
                  <div className="mt-3 space-y-1 text-sm text-slate-600">
                    {order.items.map((item) => (
                      <p key={`${order.id}-${item.productId}-${item.selectedSize}`}>
                        {item.productName} · {item.selectedSize} · Qty {item.quantity}
                      </p>
                    ))}
                  </div>
                </div>
                <select value={order.orderStatus} onChange={(e) => void updateOrderStatus(order.id, e.target.value as OrderRecord["orderStatus"])} className="nishi-input max-w-[220px]">
                  {orderStatusOptions.map((status) => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderUsers = () => (
    <div className="space-y-6">
      <div>
        <p className="nishi-section-kicker">Customer Control</p>
        <h1 className="mt-2 text-4xl font-semibold text-slate-950">Users</h1>
      </div>

      <div className={`${panelClass} space-y-5`}>
        <div>
          <h2 className="text-xl font-semibold text-slate-950">Add Customer</h2>
          <p className="mt-1 text-sm text-slate-500">Create customer accounts directly from the admin panel.</p>
        </div>

        <form onSubmit={handleCustomerSubmit} className="grid gap-4 md:grid-cols-3">
          <input required value={customerForm.name} onChange={(e) => setCustomerForm((prev) => ({ ...prev, name: e.target.value }))} placeholder="Customer name" className="nishi-input" />
          <input required type="email" value={customerForm.email} onChange={(e) => setCustomerForm((prev) => ({ ...prev, email: e.target.value }))} placeholder="Customer email" className="nishi-input" />
          <input required type="password" value={customerForm.password} onChange={(e) => setCustomerForm((prev) => ({ ...prev, password: e.target.value }))} placeholder="Temporary password" className="nishi-input" />
          <div className="md:col-span-3">
            <Button type="submit" className="rounded-md bg-[#2874f0] hover:bg-[#1f66da]">Add Customer</Button>
          </div>
        </form>
      </div>

      <div className={panelClass}>
        <h2 className="text-xl font-semibold text-slate-950">All Users</h2>
        <div className="mt-5 space-y-3">
          {customerUsers.map((user) => (
            <div key={user.id} className="flex flex-col gap-3 rounded-xl border border-[#e4e9f3] bg-[#f8fbff] p-4 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-medium text-slate-900">{user.name}</p>
                  {user.isBlocked && <span className="rounded-full bg-rose-50 px-2 py-1 text-xs font-semibold text-rose-600">Blocked</span>}
                </div>
                <p className="text-sm text-slate-500">{user.email}</p>
                <p className="text-xs text-slate-500">Joined {formatDate(user.createdAt)}</p>
              </div>
              <Button variant="outline" size="sm" className="rounded-md border-[#dce3f0]" onClick={() => void toggleCustomerBlock(user.id)}>
                {user.isBlocked ? "Unblock" : "Block"}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderReports = () => (
    <div className="space-y-6">
      <div>
        <p className="nishi-section-kicker">Reports</p>
        <h1 className="mt-2 text-4xl font-semibold text-slate-950">Performance summary</h1>
      </div>
      <div className="grid gap-5 xl:grid-cols-3">
        <div className={panelClass}>
          <h2 className="text-xl font-semibold text-slate-950">Sales Report</h2>
          <p className="mt-3 text-3xl font-semibold text-slate-950">{formatCurrency(metrics.totalRevenue)}</p>
          <p className="mt-1 text-sm text-slate-500">Total revenue generated so far.</p>
        </div>
        <div className={panelClass}>
          <h2 className="text-xl font-semibold text-slate-950">Order Report</h2>
          <p className="mt-3 text-3xl font-semibold text-slate-950">{metrics.totalOrders}</p>
          <p className="mt-1 text-sm text-slate-500">Total orders placed by customers.</p>
        </div>
        <div className={panelClass}>
          <h2 className="text-xl font-semibold text-slate-950">User Report</h2>
          <p className="mt-3 text-3xl font-semibold text-slate-950">{metrics.totalUsers}</p>
          <p className="mt-1 text-sm text-slate-500">Registered customer accounts.</p>
        </div>
      </div>
    </div>
  );

  const renderActiveSection = () => {
    if (activeSection === "products") return renderProducts();
    if (activeSection === "orders") return renderOrders();
    if (activeSection === "users") return renderUsers();
    if (activeSection === "reports") return renderReports();
    return renderDashboard();
  };

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#f4f7fc_0%,#ffffff_45%,#f7faff_100%)]">
      <div className="flex min-h-screen">
        <aside className="hidden w-[250px] shrink-0 flex-col justify-between bg-[#172337] text-white lg:flex">
          <div className="p-5">
            <div className="flex items-center gap-3 rounded-xl px-3 py-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/12 text-lg font-semibold">N</div>
              <div>
                <p className="text-2xl font-semibold tracking-wide">NISHI</p>
                <p className="text-sm text-white/68">Admin Dashboard</p>
              </div>
            </div>

            <nav className="mt-6 space-y-2">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium transition ${
                    activeSection === item.id ? "bg-[#2874f0] text-white" : "text-white/72 hover:bg-white/8 hover:text-white"
                  }`}
                >
                  <item.icon size={18} />
                  {item.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="border-t border-white/10 p-5">
            <div className="space-y-2">
              <Button asChild variant="ghost" className="w-full justify-start text-white hover:bg-white/10 hover:text-white">
                <Link to="/">Back to Store</Link>
              </Button>
              <Button variant="ghost" className="w-full justify-start text-white hover:bg-white/10 hover:text-white" onClick={logout}>
                <LogOut size={16} />
                Logout
              </Button>
            </div>
          </div>
        </aside>

        <main className="flex-1 p-4 md:p-6 lg:p-7">
          {message && (
            <div className="mb-5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
              {message}
            </div>
          )}
          {renderActiveSection()}
        </main>
      </div>
    </div>
  );
};

export default Admin;
