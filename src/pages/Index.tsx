import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BadgePercent,
  CreditCard,
  ShieldCheck,
  Sparkles,
  Star,
  Store,
  Truck,
} from "lucide-react";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { useAppData } from "@/contexts/AppDataContext";
import { formatCurrency } from "@/lib/format";

const categories = [
  {
    label: "Men's Fashion",
    value: "men",
    subtitle: "Shirts, blazers, chinos and everyday essentials",
    image: "https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?w=900&h=900&fit=crop",
  },
  {
    label: "Women's Fashion",
    value: "women",
    subtitle: "Kurtis, dresses, handbags and festive wear",
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=900&h=900&fit=crop",
  },
  {
    label: "Kids Fashion",
    value: "kids",
    subtitle: "Comfortable clothing and playful party looks",
    image: "https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?w=900&h=900&fit=crop",
  },
];

const benefits = [
  { title: "Top offers", text: "Professional deal sections with stronger visibility.", icon: BadgePercent },
  { title: "Fast delivery", text: "Faster purchase decisions with shipping cues upfront.", icon: Truck },
  { title: "Secure shopping", text: "Cleaner trust signals across the storefront.", icon: ShieldCheck },
  { title: "Easy payments", text: "A simpler path from product to checkout.", icon: CreditCard },
];

const brandTiles = [
  "Nishi Originals",
  "Nishi Heritage",
  "Nishi Basics",
  "Nishi Ethnic",
  "Nishi Kids",
  "Nishi Accessories",
];

const Index = () => {
  const { products } = useAppData();
  const featured = products.filter((product) => product.featured).slice(0, 6);
  const deals = [...products]
    .filter((product) => product.originalPrice)
    .sort((a, b) => ((b.originalPrice ?? b.price) - b.price) - ((a.originalPrice ?? a.price) - a.price))
    .slice(0, 4);
  const newArrivals = [...products].slice(0, 5);
  const heroSpotlight = featured[0] ?? products[0];

  return (
    <div className="nishi-page">
      <section className="border-b border-[#dfe5f0] bg-[linear-gradient(180deg,#eaf2ff_0%,#ffffff_55%,#f6f9ff_100%)]">
        <div className="container mx-auto px-4 py-8">
          <div className="grid gap-5 lg:grid-cols-[1.25fr_0.75fr]">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="overflow-hidden rounded-[24px] bg-[linear-gradient(135deg,#0f4ecf_0%,#2874f0_55%,#4f97ff_100%)] px-6 py-8 text-white shadow-[0_18px_50px_rgba(37,99,235,0.22)] md:px-8"
            >
              <div className="grid gap-8 lg:grid-cols-[1fr_0.62fr] lg:items-center">
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-white/90">
                    <Store size={14} />
                    Professional Marketplace
                  </div>
                  <h1 className="mt-5 max-w-xl text-4xl font-semibold leading-tight md:text-5xl">
                    Discover fashion with a cleaner shopping layout and stronger product focus.
                  </h1>
                  <p className="mt-4 max-w-xl text-sm leading-7 text-white/82 md:text-base">
                    Inspired by modern marketplace UX: bright surfaces, strong offers, trust-first cues, and faster product discovery.
                  </p>
                  <div className="mt-7 flex flex-wrap gap-3">
                    <Button asChild className="rounded-md bg-[#ffe500] px-6 text-slate-900 hover:bg-[#ffd500]">
                      <Link to="/products">
                        Shop Now <ArrowRight size={16} className="ml-2" />
                      </Link>
                    </Button>
                    <Button asChild variant="outline" className="rounded-md border-white/20 bg-white/10 px-6 text-white hover:bg-white/15">
                      <Link to="/products?category=women">Explore Women's Wear</Link>
                    </Button>
                  </div>
                </div>

                {heroSpotlight && (
                  <Link to={`/product/${heroSpotlight.id}`} className="block">
                    <div className="rounded-[20px] bg-white p-4 text-slate-900 shadow-sm">
                      <img
                        src={heroSpotlight.images[0]}
                        alt={heroSpotlight.name}
                        className="h-[250px] w-full rounded-[14px] object-cover"
                      />
                      <p className="mt-4 text-xs font-semibold uppercase tracking-[0.2em] text-[#2874f0]">Spotlight</p>
                      <h2 className="mt-2 line-clamp-2 text-2xl font-semibold">{heroSpotlight.name}</h2>
                      <div className="mt-3 flex items-center gap-3">
                        <span className="text-2xl font-semibold">{formatCurrency(heroSpotlight.price)}</span>
                        {heroSpotlight.originalPrice && (
                          <span className="text-sm text-slate-400 line-through">{formatCurrency(heroSpotlight.originalPrice)}</span>
                        )}
                      </div>
                    </div>
                  </Link>
                )}
              </div>
            </motion.div>

            <div className="grid gap-4">
              <div className="nishi-panel p-5">
                <p className="nishi-section-kicker">Marketplace Stats</p>
                <div className="mt-4 grid grid-cols-3 gap-3">
                  {[
                    { label: "Products", value: products.length || 0 },
                    { label: "Featured", value: featured.length || 0 },
                    { label: "Deals", value: deals.length || 0 },
                  ].map((item) => (
                    <div key={item.label} className="rounded-xl bg-[#f5f9ff] px-4 py-4 text-center">
                      <p className="text-xs font-medium uppercase tracking-[0.16em] text-slate-500">{item.label}</p>
                      <p className="mt-2 text-2xl font-semibold text-slate-950">{item.value}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="nishi-panel p-5">
                <p className="nishi-section-kicker">Why Shoppers Stay</p>
                <div className="mt-4 space-y-3">
                  {["Professional product layout", "Clear offers and pricing", "Faster browsing experience"].map((item) => (
                    <div key={item} className="flex items-center gap-3 rounded-xl bg-[#f8fbff] px-4 py-3 text-sm font-medium text-slate-700">
                      <Sparkles size={15} className="text-[#2874f0]" />
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-8">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {benefits.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: index * 0.05 }}
              className="nishi-panel p-5"
            >
              <div className="inline-flex rounded-xl bg-[#e8f0fe] p-3 text-[#2874f0]">
                <item.icon size={18} />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-slate-950">{item.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{item.text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="container mx-auto px-4 py-6">
        <div className="nishi-panel p-6 md:p-8">
          <div className="mb-7 flex items-center justify-between gap-4">
            <div>
              <p className="nishi-section-kicker">Shop By Category</p>
              <h2 className="mt-2 text-3xl font-semibold text-slate-950">Popular collections across the marketplace</h2>
            </div>
            <Button asChild variant="outline" className="rounded-md border-[#dce3f0]">
              <Link to="/products">View All</Link>
            </Button>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {categories.map((category, index) => (
              <motion.div
                key={category.value}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: index * 0.06 }}
              >
                <Link
                  to={`/products?category=${category.value}`}
                  className="group block overflow-hidden rounded-[18px] border border-[#e4e9f3] bg-white shadow-sm"
                >
                  <div className="relative aspect-[4/3.7] overflow-hidden">
                    <img src={category.image} alt={category.label} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#172337]/80 via-[#172337]/20 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                      <h3 className="text-2xl font-semibold">{category.label}</h3>
                      <p className="mt-2 text-sm leading-6 text-white/80">{category.subtitle}</p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-8">
        <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <div className="nishi-panel p-6 md:p-8">
            <div className="mb-7 flex items-center justify-between gap-4">
              <div>
                <p className="nishi-section-kicker">Featured Products</p>
                <h2 className="mt-2 text-3xl font-semibold text-slate-950">Trending picks shoppers notice first</h2>
              </div>
              <Button asChild variant="ghost" className="text-[#2874f0] hover:text-[#1b5fd4]">
                <Link to="/products">
                  View All <ArrowRight size={16} className="ml-2" />
                </Link>
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
              {featured.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>

          <div className="space-y-5">
            <div className="nishi-panel p-6">
              <p className="nishi-section-kicker">Best Deals</p>
              <div className="mt-5 space-y-4">
                {deals.map((product) => (
                  <Link key={product.id} to={`/product/${product.id}`} className="flex items-center gap-4 rounded-xl bg-[#f8fbff] p-3 transition hover:bg-[#eef4ff]">
                    <img src={product.images[0]} alt={product.name} className="h-20 w-16 rounded-lg object-cover" />
                    <div className="min-w-0 flex-1">
                      <p className="line-clamp-2 font-medium text-slate-900">{product.name}</p>
                      <p className="mt-1 text-sm text-[#388e3c]">Special price</p>
                      <p className="mt-1 text-lg font-semibold text-slate-950">{formatCurrency(product.price)}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            <div className="rounded-[18px] bg-[linear-gradient(135deg,#2874f0_0%,#0f4ecf_100%)] p-6 text-white shadow-[0_16px_40px_rgba(37,99,235,0.2)]">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-white/80">Marketplace Focus</p>
              <h3 className="mt-3 text-2xl font-semibold">Professional layout, stronger offers, cleaner retail flow.</h3>
              <p className="mt-3 text-sm leading-7 text-white/82">
                The storefront now leans into a brighter marketplace pattern with more useful hierarchy and sharper product presentation.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-8">
        <div className="nishi-panel p-6 md:p-8">
          <div className="mb-7 flex items-center justify-between gap-4">
            <div>
              <p className="nishi-section-kicker">New Arrivals</p>
              <h2 className="mt-2 text-3xl font-semibold text-slate-950">Fresh products entering the catalog</h2>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full bg-[#fff7cc] px-4 py-2 text-sm font-medium text-slate-700">
              <Star size={14} className="text-[#f4b400]" />
              New styles added
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
            {newArrivals.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-8">
        <div className="rounded-[20px] bg-[#172337] px-6 py-10 text-white shadow-[0_16px_40px_rgba(15,23,42,0.18)] md:px-8">
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-white/72">Top Brands</p>
              <h2 className="mt-3 text-3xl font-semibold leading-tight md:text-4xl">
                Build trust with strong brands, consistent offers, and a familiar marketplace feel.
              </h2>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-white/74">
                These sections bring more polish to the store so the experience feels larger, more credible and easier to shop.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {brandTiles.map((brand) => (
                <div key={brand} className="rounded-xl border border-white/10 bg-white/6 px-4 py-4 text-sm font-medium text-white/90">
                  {brand}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
