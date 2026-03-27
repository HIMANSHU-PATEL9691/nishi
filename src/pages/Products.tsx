import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { SlidersHorizontal, Sparkles, Tag, X } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { useAppData } from "@/contexts/AppDataContext";

const CATEGORIES = ["all", "men", "women", "kids"] as const;
const PRICE_RANGES = [
  { label: "All Prices", min: 0, max: Infinity },
  { label: "Under Rs. 1,000", min: 0, max: 1000 },
  { label: "Rs. 1,000 - Rs. 3,000", min: 1000, max: 3000 },
  { label: "Rs. 3,000 - Rs. 5,000", min: 3000, max: 5000 },
  { label: "Above Rs. 5,000", min: 5000, max: Infinity },
];

const Products = () => {
  const { products: allProducts } = useAppData();
  const [searchParams] = useSearchParams();
  const categoryParam = searchParams.get("category") || "all";
  const searchQuery = searchParams.get("search") || "";

  const [category, setCategory] = useState(categoryParam);
  const [priceRange, setPriceRange] = useState(0);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    setCategory(categoryParam);
  }, [categoryParam]);

  const filtered = useMemo(() => {
    let result = allProducts;
    if (category !== "all") result = result.filter((product) => product.category === category);
    const range = PRICE_RANGES[priceRange];
    result = result.filter((product) => product.price >= range.min && product.price <= range.max);
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (product) =>
          product.name.toLowerCase().includes(query) ||
          product.brand.toLowerCase().includes(query) ||
          product.category.includes(query),
      );
    }
    return result;
  }, [allProducts, category, priceRange, searchQuery]);

  const featuredCount = filtered.filter((product) => product.featured).length;

  return (
    <div className="nishi-page">
      <section className="border-b border-[#ddd7ca]/80">
        <div className="container mx-auto grid gap-6 px-4 py-10 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="nishi-dark-panel p-8 md:p-10">
            <p className="nishi-section-kicker text-white/68">Catalog Experience</p>
            <h1 className="mt-4 text-4xl font-semibold capitalize leading-tight text-white md:text-5xl">
              {category === "all" ? "All Products" : `${category}'s Collection`}
            </h1>
            <p className="mt-5 max-w-2xl text-sm leading-7 text-white/78 md:text-base">
              {searchQuery
                ? `Showing refined results for "${searchQuery}" with better visual grouping, cleaner filtering and stronger product presentation.`
                : "Browse a warmer, better-organized catalog with filters, offers and clearer product discovery."}
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-1">
            <div className="nishi-panel bg-[linear-gradient(135deg,#fffaf1_0%,#ffffff_100%)] p-6">
              <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
                <Sparkles size={16} />
                Featured Picks
              </div>
              <p className="mt-4 text-4xl font-semibold text-slate-950">{featuredCount}</p>
              <p className="mt-2 text-sm leading-6 text-slate-600">Highlighted styles in the current filtered view.</p>
            </div>
            <div className="nishi-panel bg-[linear-gradient(135deg,#f0f3e2_0%,#ffffff_100%)] p-6">
              <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
                <Tag size={16} />
                Results
              </div>
              <p className="mt-4 text-4xl font-semibold text-slate-950">{filtered.length}</p>
              <p className="mt-2 text-sm leading-6 text-slate-600">Products matched for your filters and search.</p>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-5 flex items-center justify-between rounded-[24px] border border-[#ddd7ca] bg-white px-5 py-4 shadow-sm md:hidden">
          <div>
            <p className="text-sm font-medium text-slate-900">Refine your results</p>
            <p className="text-xs text-slate-500">Category and price filters</p>
          </div>
          <Button variant="outline" onClick={() => setShowFilters(!showFilters)} className="rounded-full">
            <SlidersHorizontal size={16} className="mr-2" />
            Filters
          </Button>
        </div>

        <div className="flex gap-6">
          <aside
            className={`${showFilters ? "block" : "hidden"} w-full shrink-0 md:block md:w-[285px] ${
              showFilters ? "fixed inset-0 z-40 overflow-auto bg-[rgba(245,239,229,0.98)] p-4" : ""
            }`}
          >
            <div className="nishi-panel p-5">
              {showFilters && (
                <div className="mb-4 flex items-center justify-between md:hidden">
                  <h3 className="text-lg font-semibold text-slate-900">Filters</h3>
                  <button onClick={() => setShowFilters(false)}>
                    <X size={20} />
                  </button>
                </div>
              )}

              <div>
                <h4 className="nishi-section-kicker">Category</h4>
                <div className="mt-4 flex flex-col gap-2">
                  {CATEGORIES.map((option) => (
                    <button
                      key={option}
                      onClick={() => setCategory(option)}
                      className={`rounded-2xl px-4 py-3 text-left text-sm font-medium capitalize transition ${
                        category === option
                          ? "bg-[#262626] text-white"
                          : "border border-[#e7dfd1] bg-[#fbf8f2] text-slate-700 hover:bg-white"
                      }`}
                    >
                      {option === "all" ? "All products" : option}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-6">
                <h4 className="nishi-section-kicker">Price</h4>
                <div className="mt-4 flex flex-col gap-2">
                  {PRICE_RANGES.map((range, index) => (
                    <button
                      key={range.label}
                      onClick={() => setPriceRange(index)}
                      className={`rounded-2xl px-4 py-3 text-left text-sm font-medium transition ${
                        priceRange === index
                          ? "bg-[#ff7f11]/12 text-[#262626]"
                          : "border border-[#e7dfd1] bg-[#fbf8f2] text-slate-700 hover:bg-white"
                      }`}
                    >
                      {range.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-6 rounded-[24px] bg-[linear-gradient(180deg,#fff8f1_0%,#f7f8f1_100%)] p-4">
                <p className="text-sm font-semibold text-slate-900">Shopping feels cleaner</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Better product grouping, softer surfaces and easier visual scanning.
                </p>
              </div>

              {showFilters && (
                <Button className="mt-5 w-full rounded-full md:hidden" onClick={() => setShowFilters(false)}>
                  Apply Filters
                </Button>
              )}
            </div>
          </aside>

          <div className="flex-1">
            <div className="mb-5 flex flex-wrap items-center gap-3 rounded-[24px] border border-[#ddd7ca] bg-white px-5 py-4 shadow-sm">
              <span className="text-sm font-semibold text-slate-900">Popular tags:</span>
              {["Bestsellers", "Fast delivery", "Top offers", "Trending fashion"].map((tag) => (
                <span key={tag} className="rounded-full bg-[#f4f0e7] px-3 py-1 text-xs font-medium text-slate-600">
                  {tag}
                </span>
              ))}
            </div>

            {filtered.length === 0 ? (
              <div className="nishi-panel py-20 text-center">
                <p className="text-lg font-medium text-slate-900">No products found</p>
                <p className="mt-2 text-sm text-slate-500">Try changing your category or price filters.</p>
                <Button
                  variant="outline"
                  className="mt-4 rounded-full"
                  onClick={() => {
                    setCategory("all");
                    setPriceRange(0);
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
                {filtered.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;
