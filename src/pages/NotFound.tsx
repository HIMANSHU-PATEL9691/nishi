import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="nishi-page">
      <div className="container mx-auto flex min-h-[70vh] items-center justify-center px-4 py-16">
        <div className="nishi-panel max-w-xl px-8 py-14 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#2874f0]">404 Error</p>
          <h1 className="mt-4 text-5xl font-semibold text-slate-950">Page not found</h1>
          <p className="mt-4 text-sm leading-7 text-slate-600">
            The page you are looking for may have moved, been removed, or does not exist in this marketplace.
          </p>
          <a
            href="/"
            className="mt-6 inline-flex rounded-md bg-[#2874f0] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#1f66da]"
          >
            Return to Home
          </a>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
