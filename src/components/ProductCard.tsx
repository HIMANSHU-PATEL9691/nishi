import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ShieldCheck, Star, Truck } from "lucide-react";
import type { Product } from "@/data/products";
import { formatCurrency } from "@/lib/format";

const ProductCard = ({ product }: { product: Product }) => {
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <Link
        to={`/product/${product.id}`}
        className="group block overflow-hidden rounded-[16px] border border-[#e4e9f3] bg-white shadow-[0_6px_20px_rgba(15,23,42,0.05)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(15,23,42,0.08)]"
      >
        <div className="relative overflow-hidden bg-[#f8faff] p-4">
          <div className="absolute left-3 top-3 z-10 flex flex-wrap gap-2">
            {discount > 0 && (
              <span className="rounded-full bg-[#388e3c] px-2.5 py-1 text-[11px] font-semibold text-white">
                {discount}% off
              </span>
            )}
            {product.featured && (
              <span className="rounded-full bg-[#e8f0fe] px-2.5 py-1 text-[11px] font-semibold text-[#2874f0]">
                Assured Pick
              </span>
            )}
          </div>

          <div className="aspect-[4/4.2] overflow-hidden rounded-[12px] bg-white">
            <img
              src={product.images[0]}
              alt={product.name}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
          </div>
        </div>

        <div className="p-4">
          <h3 className="line-clamp-2 min-h-[48px] text-[15px] font-medium leading-6 text-slate-900">
            {product.name}
          </h3>
          <p className="mt-1 text-sm text-slate-500">{product.brand}</p>

          <div className="mt-2 flex items-center gap-2 text-xs text-slate-500">
            <div className="flex items-center gap-1 rounded bg-[#388e3c] px-2 py-0.5 font-semibold text-white">
              4.4 <Star size={11} className="fill-current" />
            </div>
            <span>Top rated</span>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className="text-[22px] font-semibold text-slate-950">{formatCurrency(product.price)}</span>
            {product.originalPrice && (
              <span className="text-sm text-slate-400 line-through">{formatCurrency(product.originalPrice)}</span>
            )}
          </div>

          <div className="mt-2 flex items-center gap-2 text-xs">
            <span className="font-medium text-[#388e3c]">Special price</span>
            <span className="text-slate-500">Limited-time offer</span>
          </div>

          <div className="mt-4 flex items-center justify-between gap-3 text-xs text-slate-500">
            <span className="rounded-full bg-[#f3f6fb] px-2.5 py-1 font-medium capitalize">{product.category}</span>
            <span className="flex items-center gap-1">
              <Truck size={12} />
              Fast delivery
            </span>
          </div>

          <div className="mt-4 flex items-center gap-2 rounded-xl bg-[#f8fbff] px-3 py-2 text-xs text-slate-600">
            <ShieldCheck size={13} className="text-[#2874f0]" />
            Verified shopping and order-ready details
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;
