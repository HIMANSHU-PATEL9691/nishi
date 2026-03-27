import { Link } from "react-router-dom";
import { CreditCard, Headphones, ShieldCheck, Truck } from "lucide-react";

const Footer = () => (
  <footer className="mt-16 bg-[#172337] text-white">
    <div className="border-b border-white/10">
      <div className="container mx-auto grid gap-4 px-4 py-10 md:grid-cols-2 xl:grid-cols-4">
        {[
          {
            title: "Wide product range",
            text: "Browse fashion across categories with stronger structure and cleaner discovery.",
            icon: Truck,
          },
          {
            title: "Secure shopping",
            text: "Professional purchase flow with safer checkout and clearer order visibility.",
            icon: ShieldCheck,
          },
          {
            title: "Easy payments",
            text: "A smoother order summary and checkout journey built for trust and conversion.",
            icon: CreditCard,
          },
          {
            title: "Customer support",
            text: "Help for account, orders, products and delivery questions whenever needed.",
            icon: Headphones,
          },
        ].map((item) => (
          <div key={item.title} className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <div className="inline-flex rounded-xl bg-white/10 p-3 text-white">
              <item.icon size={18} />
            </div>
            <h3 className="mt-4 text-lg font-semibold">{item.title}</h3>
            <p className="mt-2 text-sm leading-6 text-white/68">{item.text}</p>
          </div>
        ))}
      </div>
    </div>

    <div className="container mx-auto px-4 py-12">
      <div className="grid gap-10 md:grid-cols-4">
        <div>
          <h3 className="text-2xl font-semibold tracking-[0.14em]">NISHI</h3>
          <p className="mt-3 max-w-sm text-sm leading-7 text-white/70">
            A cleaner professional marketplace experience inspired by modern large-format eCommerce design.
          </p>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-[0.22em] text-white/72">Shop</h4>
          <ul className="mt-4 space-y-3 text-sm text-white/68">
            <li><Link to="/products?category=men" className="transition hover:text-white">Men</Link></li>
            <li><Link to="/products?category=women" className="transition hover:text-white">Women</Link></li>
            <li><Link to="/products?category=kids" className="transition hover:text-white">Kids</Link></li>
            <li><Link to="/products" className="transition hover:text-white">All Products</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-[0.22em] text-white/72">Support</h4>
          <ul className="mt-4 space-y-3 text-sm text-white/68">
            <li><Link to="/contact" className="transition hover:text-white">Contact Us</Link></li>
            <li><Link to="/orders" className="transition hover:text-white">My Orders</Link></li>
            <li><Link to="/privacy-policy" className="transition hover:text-white">Privacy Policy</Link></li>
            <li><Link to="/terms" className="transition hover:text-white">Terms & Conditions</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-[0.22em] text-white/72">Business</h4>
          <ul className="mt-4 space-y-3 text-sm text-white/68">
            <li><Link to="/about" className="transition hover:text-white">About Nishi</Link></li>
            <li><Link to="/login" className="transition hover:text-white">Customer Login</Link></li>
            <li><Link to="/admin" className="transition hover:text-white">Admin Panel</Link></li>
            <li><Link to="/products" className="transition hover:text-white">Catalog</Link></li>
          </ul>
        </div>
      </div>

      <div className="mt-10 flex flex-col gap-3 border-t border-white/10 pt-6 text-sm text-white/45 md:flex-row md:items-center md:justify-between">
        <p>© 2026 Nishi Fashion Marketplace. All rights reserved.</p>
        <p>Built with a professional marketplace layout and retail-first experience.</p>
      </div>
    </div>
  </footer>
);

export default Footer;
