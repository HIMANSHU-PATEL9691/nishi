import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { useAppData } from "@/contexts/AppDataContext";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { formatCurrency } from "@/lib/format";

const Checkout = () => {
  const { items, totalPrice, clearCart } = useCart();
  const { currentUser, createOrder } = useAppData();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    pincode: "",
  });

  useEffect(() => {
    if (!currentUser) return;
    setForm((prev) => ({
      ...prev,
      name: currentUser.name,
      email: currentUser.email,
    }));
  }, [currentUser]);

  if (items.length === 0) {
    return (
      <div className="nishi-page">
        <div className="container mx-auto px-4 py-20 text-center">
          <div className="mx-auto max-w-xl rounded-[34px] border border-[#ddd7ca] bg-white px-6 py-16 shadow-sm">
            <p className="text-lg text-slate-600">Your cart is empty</p>
            <Button asChild variant="outline" className="mt-4 rounded-full">
              <Link to="/products">Continue Shopping</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="nishi-page">
        <div className="container mx-auto px-4 py-20 text-center">
          <div className="mx-auto max-w-xl rounded-[34px] border border-[#ddd7ca] bg-white px-6 py-16 shadow-sm">
            <h1 className="text-3xl font-semibold text-slate-950">Sign in before checkout</h1>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              Orders are linked to customer accounts so they can be tracked and managed properly.
            </p>
            <Button asChild className="mt-6 rounded-full bg-[#262626] px-6 hover:bg-black">
              <Link to="/login">Go to Login</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const updateField = (field: string, value: string) => setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await createOrder({
        userId: currentUser.id,
        customerName: form.name,
        customerEmail: form.email,
        phone: form.phone,
        address: form.address,
        city: form.city,
        pincode: form.pincode,
        items: items.map((item) => ({
          productId: item.product.id,
          productName: item.product.name,
          unitPrice: item.product.price,
          quantity: item.quantity,
          selectedSize: item.selectedSize,
          image: item.product.images[0],
        })),
        totalAmount: totalPrice,
      });

      toast.success("Order placed successfully. Razorpay demo payment marked as paid.");
      clearCart();
      navigate("/orders");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to place order.");
    }
  };

  return (
    <div className="nishi-page">
      <div className="container mx-auto max-w-6xl px-4 py-8">
        <div className="mb-8">
          <p className="nishi-section-kicker">Checkout</p>
          <h1 className="mt-2 text-3xl font-semibold text-slate-950 md:text-4xl">Complete your order</h1>
        </div>

        <form onSubmit={handleSubmit} className="grid gap-8 md:grid-cols-[1.1fr_0.9fr]">
          <div className="nishi-panel p-6 md:p-8">
            <h2 className="text-xl font-semibold text-slate-950">Shipping Details</h2>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {[
                { key: "name", label: "Full Name", type: "text" },
                { key: "email", label: "Email", type: "email" },
                { key: "phone", label: "Phone Number", type: "tel" },
                { key: "city", label: "City", type: "text" },
              ].map((field) => (
                <div key={field.key}>
                  <label className="mb-2 block text-sm font-medium text-slate-700">{field.label}</label>
                  <input
                    type={field.type}
                    required
                    value={form[field.key as keyof typeof form]}
                    onChange={(e) => updateField(field.key, e.target.value)}
                    className="nishi-input"
                  />
                </div>
              ))}
              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium text-slate-700">Address</label>
                <input
                  type="text"
                  required
                  value={form.address}
                  onChange={(e) => updateField("address", e.target.value)}
                  className="nishi-input"
                />
              </div>
              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium text-slate-700">PIN Code</label>
                <input
                  type="text"
                  required
                  value={form.pincode}
                  onChange={(e) => updateField("pincode", e.target.value)}
                  className="nishi-input"
                />
              </div>
            </div>
          </div>

          <div className="nishi-panel h-fit p-6">
            <h2 className="text-xl font-semibold text-slate-950">Order Summary</h2>
            <div className="mt-5 space-y-4">
              {items.map((item) => (
                <div key={`${item.product.id}-${item.selectedSize}`} className="flex items-center justify-between gap-4 text-sm">
                  <div className="min-w-0">
                    <p className="truncate font-medium text-slate-900">{item.product.name}</p>
                    <p className="text-slate-500">
                      {item.selectedSize} x {item.quantity}
                    </p>
                  </div>
                  <span className="font-medium text-slate-900">{formatCurrency(item.product.price * item.quantity)}</span>
                </div>
              ))}
            </div>
            <div className="mt-5 flex justify-between border-t border-[#e5dece] pt-4 text-base font-semibold text-slate-950">
              <span>Total</span>
              <span>{formatCurrency(totalPrice)}</span>
            </div>
            <Button type="submit" className="mt-6 w-full rounded-full bg-[#262626] py-6 text-base hover:bg-black">
              Place Order - {formatCurrency(totalPrice)}
            </Button>
            <p className="mt-3 text-center text-xs leading-6 text-slate-500">
              Razorpay is represented here as a demo payment flow and the order is stored for admin management.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Checkout;
