import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Heart, Minus, Plus, ShieldCheck, ShoppingCart, Star, Truck } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useAppData } from "@/contexts/AppDataContext";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { formatCurrency } from "@/lib/format";
import { ensureProductGallery } from "@/lib/product-gallery";

const ProductDetail = () => {
  const { id } = useParams();
  const { products } = useAppData();
  const product = products.find((entry) => entry.id === id);
  const { addItem } = useCart();
  const [selectedSize, setSelectedSize] = useState("");
  const [qty, setQty] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    if (!product) return;
    setSelectedImage(0);
  }, [product]);

  if (!product) {
    return (
      <div className="nishi-page">
        <div className="container mx-auto px-4 py-20 text-center">
          <p className="text-lg text-muted-foreground">Product not found</p>
          <Button asChild variant="outline" className="mt-4 rounded-full">
            <Link to="/products">Back to Products</Link>
          </Button>
        </div>
      </div>
    );
  }

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;
  const gallery = ensureProductGallery(product.images);
  const related = products.filter((entry) => entry.category === product.category && entry.id !== product.id).slice(0, 4);

  const handleAddToCart = async () => {
    if (!selectedSize) {
      toast.error("Please select a size");
      return;
    }

    try {
      await addItem(product, selectedSize, qty);
      toast.success(`${product.name} added to cart`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to add item to cart.");
    }
  };

  return (
    <div className="nishi-page">
      <div className="container mx-auto px-4 py-8">
        <Link to="/products" className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900">
          <ArrowLeft size={16} />
          Back to Products
        </Link>

        <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
          <div className="nishi-panel p-5 md:p-6">
            <div className="grid gap-4 lg:grid-cols-[96px_1fr]">
              <div className="order-2 grid grid-cols-4 gap-3 lg:order-1 lg:grid-cols-1">
                {gallery.slice(0, 4).map((image, index) => (
                  <button
                    key={`${product.id}-gallery-${index}`}
                    onClick={() => setSelectedImage(index)}
                    className={`overflow-hidden rounded-[20px] border-2 bg-[#f7f3ea] transition ${
                      selectedImage === index ? "border-[#ff7f11] shadow-sm" : "border-transparent hover:border-[#cdd8ba]"
                    }`}
                  >
                    <img src={image} alt={`${product.name} view ${index + 1}`} className="h-24 w-full object-cover" />
                  </button>
                ))}
              </div>

              <div className="order-1 overflow-hidden rounded-[28px] bg-[linear-gradient(180deg,#f6efe3_0%,#ffffff_100%)] lg:order-2">
                <img src={gallery[selectedImage]} alt={product.name} className="h-full w-full object-cover" />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="nishi-panel p-6 md:p-8">
              <p className="nishi-section-kicker">{product.brand}</p>
              <h1 className="mt-3 text-3xl font-semibold leading-tight text-slate-950 md:text-4xl">{product.name}</h1>

              <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-slate-500">
                <div className="flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 font-semibold text-emerald-700">
                  <Star size={14} className="fill-current" />
                  4.4
                </div>
                <span>1,240+ ratings</span>
                <span>Trusted product details</span>
              </div>

              <div className="mt-6 flex flex-wrap items-end gap-3">
                <span className="text-4xl font-bold text-slate-950">{formatCurrency(product.price)}</span>
                {product.originalPrice && (
                  <span className="text-xl text-slate-400 line-through">{formatCurrency(product.originalPrice)}</span>
                )}
                {discount > 0 && (
                  <span className="rounded-full bg-[#fff1e2] px-3 py-1 text-sm font-semibold text-[#d16500]">
                    {discount}% OFF
                  </span>
                )}
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <div className="rounded-[24px] bg-[#f7f3ea] p-4">
                  <p className="flex items-center gap-2 font-medium text-slate-900">
                    <Truck size={16} className="text-[#ff7f11]" />
                    Fast delivery available
                  </p>
                  <p className="mt-1 text-sm leading-6 text-slate-600">Dispatch-ready styles for quicker checkout decisions.</p>
                </div>
                <div className="rounded-[24px] bg-[#f0f3e2] p-4">
                  <p className="flex items-center gap-2 font-medium text-slate-900">
                    <ShieldCheck size={16} className="text-[#6b815f]" />
                    Trusted product details
                  </p>
                  <p className="mt-1 text-sm leading-6 text-slate-600">Clear pricing, sizes and category information.</p>
                </div>
              </div>

              <p className="mt-6 text-sm leading-8 text-slate-600 md:text-base">{product.description}</p>

              <div className="mt-7">
                <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Select Size</p>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`rounded-2xl border px-4 py-2.5 text-sm font-medium transition ${
                        selectedSize === size
                          ? "border-[#ff7f11] bg-[#ff7f11] text-white"
                          : "border-[#ddd7ca] bg-white text-slate-700 hover:border-[#c9c3b7]"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-6">
                <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Quantity</p>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setQty(Math.max(1, qty - 1))}
                    className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[#ddd7ca] bg-white hover:bg-[#faf7f1]"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="w-8 text-center text-lg font-semibold text-slate-950">{qty}</span>
                  <button
                    onClick={() => setQty(qty + 1)}
                    className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[#ddd7ca] bg-white hover:bg-[#faf7f1]"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>

              <div className="mt-7 flex flex-wrap gap-3">
                <Button onClick={handleAddToCart} className="min-w-[220px] rounded-full bg-[#262626] py-6 text-base hover:bg-black">
                  <ShoppingCart size={18} className="mr-2" />
                  Add to Cart
                </Button>
                <Button variant="outline" className="rounded-full border-[#ddd7ca] px-5 py-6">
                  <Heart size={18} />
                </Button>
              </div>

              <div className="mt-5 flex flex-wrap items-center gap-3 text-sm text-slate-500">
                <span className="rounded-full bg-[#f4f0e7] px-3 py-1 capitalize">{product.category}</span>
                <span className="rounded-full bg-[#f4f0e7] px-3 py-1">Stock: {product.stock}</span>
                {product.stock < 10 && (
                  <span className="rounded-full bg-[#fff3d7] px-3 py-1 font-medium text-[#9a6b00]">Only a few left</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {related.length > 0 && (
          <section className="nishi-panel mt-10 p-6 md:p-8">
            <div className="mb-7">
              <p className="nishi-section-kicker">Recommended For You</p>
              <h2 className="mt-2 text-3xl font-semibold text-slate-950">You may also like</h2>
            </div>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {related.map((entry) => (
                <ProductCard key={entry.id} product={entry} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
