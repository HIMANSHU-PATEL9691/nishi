import type { ReactNode } from "react";

interface InfoPageLayoutProps {
  eyebrow: string;
  title: string;
  description: string;
  sidebarTitle: string;
  sidebarText: string;
  sidebarItems: string[];
  children: ReactNode;
}

const InfoPageLayout = ({
  eyebrow,
  title,
  description,
  sidebarTitle,
  sidebarText,
  sidebarItems,
  children,
}: InfoPageLayoutProps) => {
  return (
    <div className="nishi-page">
      <section className="border-b border-[#ddd7ca]/80">
        <div className="container mx-auto grid gap-6 px-4 py-10 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="nishi-dark-panel p-8 md:p-10">
            <p className="nishi-section-kicker text-white/68">{eyebrow}</p>
            <h1 className="mt-4 text-4xl font-semibold leading-tight md:text-5xl">{title}</h1>
            <p className="mt-5 max-w-2xl text-sm leading-7 text-white/78 md:text-base">{description}</p>
          </div>

          <div className="nishi-panel p-8">
            <h2 className="text-2xl font-semibold text-slate-950">{sidebarTitle}</h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">{sidebarText}</p>
            <div className="mt-6 grid gap-3">
              {sidebarItems.map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-[#e6dfd2] bg-[linear-gradient(180deg,#fff8f1_0%,#ffffff_100%)] px-4 py-3 text-sm font-medium text-slate-700"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-10">
        <div className="nishi-panel p-6 md:p-10">{children}</div>
      </div>
    </div>
  );
};

export default InfoPageLayout;
