import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  ChevronDown,
  Headphones,
  Menu,
  Search,
  ShieldCheck,
  ShoppingBag,
  Store,
  Truck,
  X,
} from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useAppData } from "@/contexts/AppDataContext";
import nishiLogo from "@/assets/nishi-logo.jpeg";

const quickLinks = [
  { label: "Men", to: "/products?category=men" },
  { label: "Women", to: "/products?category=women" },
  { label: "Kids", to: "/products?category=kids" },
  { label: "Top Offers", to: "/products" },
  { label: "New Arrivals", to: "/products" },
];

const Header = () => {
  const { totalItems } = useCart();
  const { currentUser, logout } = useAppData();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    setMobileMenuOpen(false);
  };

  const accountTarget = currentUser?.role === "admin" ? "/admin" : currentUser ? "/orders" : "/login";

  return (
    <header className="sticky top-0 z-50 border-b border-[#dce3f0] bg-white shadow-[0_2px_14px_rgba(15,23,42,0.04)]">
      <div className="hidden bg-[#172337] text-white md:block">
        <div className="container mx-auto flex items-center justify-between px-4 py-2 text-xs">
          <div className="flex items-center gap-5 text-white/82">
            <span className="flex items-center gap-2">
              <Truck size={14} />
              Fast delivery on popular styles
            </span>
            <span className="flex items-center gap-2">
              <ShieldCheck size={14} />
              Secure checkout and trusted shopping
            </span>
          </div>
          <div className="flex items-center gap-5 text-white/72">
            <span className="flex items-center gap-2">
              <Headphones size={14} />
              Support for every order
            </span>
            <span>Professional marketplace experience</span>
          </div>
        </div>
      </div>

      <div className="bg-[#2874f0] text-white">
        <div className="container mx-auto px-4">
          <div className="flex min-h-[78px] items-center gap-3 py-3">
            <button
              className="rounded-xl border border-white/15 bg-white/10 p-2.5 text-white md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

            <Link to="/" className="flex min-w-fit items-center gap-3">
              <img src={nishiLogo} alt="Nishi" className="h-11 w-11 rounded-lg border border-white/20 object-cover" />
              <div className="hidden sm:block">
                <p className="text-xl font-semibold tracking-wide">NISHI</p>
                <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-[#ffe98a]">Marketplace</p>
              </div>
            </Link>

            <form onSubmit={handleSearch} className="hidden flex-1 md:block">
              <div className="relative">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search for products, brands and more"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-11 w-full rounded-md border-none bg-white pl-11 pr-32 text-sm text-slate-900 outline-none shadow-sm"
                />
                <button
                  type="submit"
                  className="absolute right-1.5 top-1.5 rounded-md bg-[#ffe500] px-5 py-2 text-sm font-semibold text-slate-900 transition hover:bg-[#ffd500]"
                >
                  Search
                </button>
              </div>
            </form>

            <div className="ml-auto flex items-center gap-2 md:gap-3">
              <Link
                to={accountTarget}
                className="hidden rounded-md bg-white px-4 py-2 text-sm font-semibold text-[#2874f0] transition hover:bg-[#f5f9ff] md:flex md:items-center md:gap-2"
              >
                <Store size={16} />
                <span>{currentUser ? currentUser.name.split(" ")[0] : "Account"}</span>
                <ChevronDown size={14} />
              </Link>

              {currentUser && (
                <button
                  onClick={logout}
                  className="hidden rounded-md border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/15 md:block"
                >
                  Logout
                </button>
              )}

              <Link
                to="/cart"
                className="relative flex items-center gap-2 rounded-md bg-white/12 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/18"
              >
                <ShoppingBag size={18} />
                <span className="hidden sm:inline">Cart</span>
                {totalItems > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#ffe500] text-[11px] font-bold text-slate-900">
                    {totalItems}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="hidden border-t border-[#dce3f0] bg-white md:block">
        <div className="container mx-auto flex items-center gap-6 overflow-x-auto px-4 py-3 text-sm font-medium text-slate-700">
          {quickLinks.map((link) => (
            <Link
              key={link.label}
              to={link.to}
              className={`whitespace-nowrap transition hover:text-[#2874f0] ${
                location.pathname === "/products" ? "text-slate-700" : ""
              }`}
            >
              {link.label}
            </Link>
          ))}
          {currentUser && (
            <Link to="/orders" className="whitespace-nowrap transition hover:text-[#2874f0]">
              My Orders
            </Link>
          )}
          {currentUser?.role === "admin" && (
            <Link to="/admin" className="whitespace-nowrap transition hover:text-[#2874f0]">
              Admin Panel
            </Link>
          )}
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="border-t border-[#dce3f0] bg-white md:hidden">
          <div className="container mx-auto px-4 py-4">
            <form onSubmit={handleSearch}>
              <div className="relative">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search products"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-11 w-full rounded-xl border border-[#dfe5f0] bg-white pl-11 pr-4 text-sm outline-none"
                />
              </div>
            </form>

            <nav className="mt-4 grid gap-2">
              {[
                ...quickLinks,
                ...(currentUser ? [{ label: "My Orders", to: "/orders" }] : []),
                ...(currentUser?.role === "admin" ? [{ label: "Admin Panel", to: "/admin" }] : []),
                { label: currentUser ? "My Account" : "Login", to: accountTarget },
              ].map((link) => (
                <Link
                  key={link.label}
                  to={link.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-xl border border-[#e4e9f3] bg-white px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-[#f8fbff]"
                >
                  {link.label}
                </Link>
              ))}
              {currentUser && (
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="rounded-xl border border-[#e4e9f3] bg-white px-4 py-3 text-left text-sm font-medium text-slate-700 transition hover:bg-[#f8fbff]"
                >
                  Logout
                </button>
              )}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
