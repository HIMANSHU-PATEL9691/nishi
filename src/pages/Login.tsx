import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAppData } from "@/contexts/AppDataContext";
import { toast } from "sonner";

const Login = () => {
  const { login, register, currentUser } = useAppData();
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isLogin) {
      const result = await login(form.email, form.password);
      if (!result.ok) {
        toast.error(result.message);
        return;
      }
      toast.success(result.message);
      navigate("/orders");
      return;
    }

    const result = await register({
      name: form.name,
      email: form.email,
      password: form.password,
      role: "customer",
    });

    if (!result.ok) {
      toast.error(result.message);
      return;
    }

    toast.success(result.message);
    setIsLogin(true);
    setForm({ name: "", email: form.email, password: "" });
  };

  return (
    <div className="nishi-page">
      <div className="container mx-auto grid min-h-[78vh] items-center gap-8 px-4 py-10 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="nishi-dark-panel p-8 md:p-10">
          <p className="nishi-section-kicker text-white/68">Customer Access</p>
          <h1 className="mt-4 text-4xl font-semibold leading-tight md:text-5xl">
            Customer login for shopping, checkout and order tracking.
          </h1>
          <p className="mt-5 max-w-xl text-sm leading-7 text-white/78 md:text-base">
            Customers register first, then log in with their own account to buy products and track orders.
          </p>

          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {["Register account", "Login to buy", "Track your orders"].map((item) => (
              <div key={item} className="rounded-2xl border border-white/10 bg-white/8 px-4 py-4 text-sm font-medium text-white/88">
                {item}
              </div>
            ))}
          </div>
        </div>

        <div className="nishi-panel mx-auto w-full max-w-md p-8">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-semibold text-slate-950">{isLogin ? "Welcome Back" : "Create Account"}</h1>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              {isLogin ? "Customer login only." : "Create your customer account first, then log in to shop."}
            </p>
          </div>

          {currentUser && (
            <div className="mb-4 rounded-2xl border border-[#e1dacd] bg-[#f7f3ea] px-4 py-3 text-sm text-slate-700">
              Signed in as {currentUser.name}. Open the header to switch pages or log out.
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Full Name</label>
                <input
                  type="text"
                  required={!isLogin}
                  value={form.name}
                  onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                  className="nishi-input"
                />
              </div>
            )}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Email</label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
                className="nishi-input"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Password</label>
              <input
                type="password"
                required
                value={form.password}
                onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
                className="nishi-input"
              />
            </div>
            <Button type="submit" className="w-full rounded-full bg-[#262626] py-6 text-base hover:bg-black">
              {isLogin ? "Sign In" : "Create Account"}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
            <button onClick={() => setIsLogin(!isLogin)} className="font-medium text-[#ff7f11] hover:underline">
              {isLogin ? "Sign Up" : "Sign In"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
