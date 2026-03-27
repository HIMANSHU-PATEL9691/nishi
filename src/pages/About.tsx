import { Award, HeartHandshake, ShieldCheck, Sparkles } from "lucide-react";
import InfoPageLayout from "@/components/InfoPageLayout";

const highlights = [
  {
    title: "Curated fashion marketplace",
    text: "NISHI brings together occasionwear, essentials, accessories and family fashion in one browsing experience designed to feel modern and easy to shop.",
    icon: Sparkles,
  },
  {
    title: "Customer-first shopping",
    text: "We focus on clear product information, reliable pricing display, easy checkout flow and better order visibility for every shopper.",
    icon: HeartHandshake,
  },
  {
    title: "Admin-managed quality",
    text: "Products, customers and order workflows are actively organized through the admin panel so the storefront stays structured and informative.",
    icon: ShieldCheck,
  },
  {
    title: "Growing with confidence",
    text: "Our goal is to build a marketplace experience that looks premium, feels trustworthy and helps customers discover styles faster.",
    icon: Award,
  },
];

const About = () => (
  <InfoPageLayout
    eyebrow="About Nishi"
    title="A fashion marketplace built to feel attractive, informative and easy to trust."
    description="NISHI is designed as a modern clothing eCommerce experience inspired by large marketplaces while keeping the catalog focused, stylish and easier to browse."
    sidebarTitle="What we focus on"
    sidebarText="Every part of the store is shaped around stronger product visibility, cleaner layouts and more confidence while shopping."
    sidebarItems={[
      "Curated product discovery",
      "Visual-first shopping experience",
      "Transparent pricing and offers",
      "Order history and admin management",
    ]}
  >
    <div className="grid gap-8">
      <div>
        <h2 className="text-3xl font-bold text-slate-950">Who We Are</h2>
        <p className="mt-4 text-sm leading-8 text-slate-600 md:text-base">
          NISHI is a digital fashion marketplace created to offer a richer online shopping journey for men, women and kids. The platform combines lifestyle presentation with practical eCommerce features such as category-based browsing, order tracking, cart management, checkout flow and a central admin panel for store operations.
        </p>
        <p className="mt-4 text-sm leading-8 text-slate-600 md:text-base">
          We want the website to feel more than just a product list. It should guide customers with helpful information, stronger visual hierarchy, attractive offers and a cleaner way to compare products.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        {highlights.map((item) => (
          <div key={item.title} className="rounded-[28px] border border-slate-200 bg-slate-50 p-6">
            <div className="inline-flex rounded-2xl bg-primary/10 p-3 text-primary">
              <item.icon size={20} />
            </div>
            <h3 className="mt-4 text-xl font-semibold text-slate-950">{item.title}</h3>
            <p className="mt-3 text-sm leading-7 text-slate-600">{item.text}</p>
          </div>
        ))}
      </div>

      <div className="rounded-[28px] bg-[#262626] p-8 text-white">
        <h3 className="text-2xl font-semibold">Our Vision</h3>
        <p className="mt-4 text-sm leading-7 text-white/75 md:text-base">
          We aim to keep improving the platform into a more professional and user-friendly fashion destination, where attractive design meets well-organized content, reliable shopping flow and better business management tools.
        </p>
      </div>
    </div>
  </InfoPageLayout>
);

export default About;
