import { Link } from "react-router-dom";
import { Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppData } from "@/contexts/AppDataContext";
import { formatCurrency, formatDate } from "@/lib/format";

const Orders = () => {
  const { currentUser, orders } = useAppData();

  if (!currentUser) {
    return (
      <div className="nishi-page">
        <div className="container mx-auto px-4 py-20 text-center">
          <div className="mx-auto max-w-xl rounded-[34px] border border-[#ddd7ca] bg-white px-6 py-16 shadow-sm">
            <h1 className="text-3xl font-semibold text-slate-950">Sign in to view your orders</h1>
            <p className="mt-3 text-sm leading-7 text-slate-600">Your order history and status updates will appear here.</p>
            <Button asChild className="mt-6 rounded-full bg-[#262626] px-6 hover:bg-black">
              <Link to="/login">Go to Login</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const userOrders = orders.filter((order) => order.userId === currentUser.id);

  return (
    <div className="nishi-page">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="nishi-section-kicker">My Orders</p>
            <h1 className="mt-2 text-3xl font-semibold text-slate-950 md:text-4xl">Track every purchase in one place</h1>
          </div>
          {currentUser.role === "admin" && (
            <Button asChild variant="outline" className="rounded-full border-[#ddd7ca]">
              <Link to="/admin">Open Admin Panel</Link>
            </Button>
          )}
        </div>

        {userOrders.length === 0 ? (
          <div className="nishi-panel px-6 py-16 text-center">
            <Package size={44} className="mx-auto text-slate-300" />
            <h2 className="mt-5 text-2xl font-semibold text-slate-950">No orders yet</h2>
            <p className="mt-2 text-sm leading-7 text-slate-600">Once you complete checkout, your order history will show here.</p>
            <Button asChild className="mt-6 rounded-full bg-[#262626] px-6 hover:bg-black">
              <Link to="/products">Start Shopping</Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {userOrders.map((order) => (
              <div key={order.id} className="nishi-panel p-6">
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div>
                    <p className="text-sm font-medium text-[#ff7f11]">Order #{order.id}</p>
                    <h2 className="mt-1 text-2xl font-semibold text-slate-950">{formatCurrency(order.totalAmount)}</h2>
                    <p className="mt-1 text-sm text-slate-500">Placed on {formatDate(order.createdAt)}</p>
                  </div>
                  <div className="grid gap-2 text-sm md:text-right">
                    <span className="rounded-full bg-[#f4f0e7] px-3 py-1 font-medium text-slate-700">
                      Order: {order.orderStatus}
                    </span>
                    <span className="rounded-full bg-[#eef2df] px-3 py-1 font-medium text-slate-700">
                      Payment: {order.paymentStatus}
                    </span>
                  </div>
                </div>

                <div className="mt-6 grid gap-4">
                  {order.items.map((item) => (
                    <div
                      key={`${order.id}-${item.productId}-${item.selectedSize}`}
                      className="flex items-center gap-4 rounded-[24px] bg-[linear-gradient(180deg,#fff8f1_0%,#ffffff_100%)] p-4"
                    >
                      <img src={item.image} alt={item.productName} className="h-20 w-16 rounded-xl object-cover" />
                      <div className="flex-1">
                        <p className="font-medium text-slate-950">{item.productName}</p>
                        <p className="mt-1 text-sm text-slate-500">
                          Size {item.selectedSize} · Qty {item.quantity}
                        </p>
                      </div>
                      <p className="font-semibold text-slate-950">{formatCurrency(item.unitPrice * item.quantity)}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-6 grid gap-3 rounded-[24px] border border-[#e4ddcf] p-4 text-sm text-slate-600 md:grid-cols-2">
                  <p>
                    Shipping: {order.shippingAddress.address}, {order.shippingAddress.city} - {order.shippingAddress.pincode}
                  </p>
                  <p>Contact: {order.shippingAddress.phone}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
