import { Link } from "react-router-dom";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/format";

const Cart = () => {
  const { items, removeItem, updateQuantity, totalPrice, totalItems } = useCart();

  if (items.length === 0) {
    return (
      <div className="nishi-page">
        <div className="container mx-auto px-4 py-20 text-center">
          <div className="mx-auto max-w-xl rounded-[34px] border border-[#ddd7ca] bg-white/90 px-6 py-16 shadow-[0_18px_50px_rgba(48,42,35,0.08)]">
            <ShoppingBag size={60} className="mx-auto text-slate-300" />
            <h2 className="mt-5 text-3xl font-semibold text-slate-950">Your cart is empty</h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              Looks like you have not added anything yet. Start exploring the collection and build your order.
            </p>
            <Button asChild className="mt-6 rounded-full bg-[#262626] px-6 hover:bg-black">
              <Link to="/products">Continue Shopping</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="nishi-page">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="nishi-section-kicker">Shopping Cart</p>
            <h1 className="mt-2 text-3xl font-semibold text-slate-950 md:text-4xl">Review your selected items</h1>
          </div>
          <div className="rounded-full bg-white px-4 py-2 text-sm font-medium text-slate-600 shadow-sm">
            {totalItems} item{totalItems > 1 ? "s" : ""} in cart
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="space-y-4 lg:col-span-2">
            {items.map((item) => (
              <div
                key={`${item.product.id}-${item.selectedSize}`}
                className="nishi-panel flex gap-4 p-4 md:p-5"
              >
                <Link
                  to={`/product/${item.product.id}`}
                  className="h-36 w-24 shrink-0 overflow-hidden rounded-[20px] bg-[#f6efe3]"
                >
                  <img src={item.product.images[0]} alt={item.product.name} className="h-full w-full object-cover" />
                </Link>
                <div className="flex flex-1 flex-col justify-between">
                  <div>
                    <Link to={`/product/${item.product.id}`} className="text-lg font-semibold text-slate-950 hover:text-[#ff7f11]">
                      {item.product.name}
                    </Link>
                    <p className="mt-1 text-sm text-slate-500">Size: {item.selectedSize}</p>
                  </div>
                  <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => void updateQuantity(item.product.id, item.selectedSize, item.quantity - 1)}
                        className="flex h-9 w-9 items-center justify-center rounded-full border border-[#ddd7ca] bg-white hover:bg-[#faf7f1]"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-7 text-center text-sm font-semibold text-slate-900">{item.quantity}</span>
                      <button
                        onClick={() => void updateQuantity(item.product.id, item.selectedSize, item.quantity + 1)}
                        className="flex h-9 w-9 items-center justify-center rounded-full border border-[#ddd7ca] bg-white hover:bg-[#faf7f1]"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-lg font-bold text-slate-950">
                        {formatCurrency(item.product.price * item.quantity)}
                      </span>
                      <button
                        onClick={() => void removeItem(item.product.id, item.selectedSize)}
                        className="text-slate-400 transition-colors hover:text-rose-500"
                      >
                        <Trash2 size={17} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="nishi-panel sticky top-24 h-fit p-6">
            <h3 className="text-xl font-semibold text-slate-950">Order Summary</h3>
            <div className="mt-5 space-y-3 text-sm">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal</span>
                <span>{formatCurrency(totalPrice)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Shipping</span>
                <span className="font-medium text-emerald-700">Free</span>
              </div>
              <div className="flex justify-between border-t border-[#e5dece] pt-3 text-base font-semibold text-slate-950">
                <span>Total</span>
                <span>{formatCurrency(totalPrice)}</span>
              </div>
            </div>
            <Button asChild className="mt-6 w-full rounded-full bg-[#262626] py-6 text-base hover:bg-black">
              <Link to="/checkout">Proceed to Checkout</Link>
            </Button>
            <Button asChild variant="ghost" className="mt-2 w-full rounded-full text-slate-600">
              <Link to="/products">Continue Shopping</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
