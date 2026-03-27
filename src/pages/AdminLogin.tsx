import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAppData } from "@/contexts/AppDataContext";
import { toast } from "sonner";

const AdminLogin = () => {
  const { adminLogin, currentUser } = useAppData();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = await adminLogin(form.email, form.password);
    if (!result.ok) {
      toast.error(result.message);
      return;
    }

    toast.success(result.message);
    navigate("/admin");
  };

  return (
    <div className="nishi-page">
      <div className="container mx-auto grid min-h-[78vh] items-center gap-8 px-4 py-10 lg:grid-cols-[1fr_0.95fr]">
        <div className="nishi-dark-panel p-8 md:p-10">
          <p className="nishi-section-kicker text-white/68">Restricted Access</p>
          <h1 className="mt-4 text-4xl font-semibold leading-tight md:text-5xl">
            Admin login is separate from the customer shopping flow.
          </h1>
          <p className="mt-5 max-w-xl text-sm leading-7 text-white/78 md:text-base">
            Only admin accounts can enter the management dashboard for products, orders, users and reports.
          </p>
        </div>

        <div className="nishi-panel mx-auto w-full max-w-md p-8">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-semibold text-slate-950">Admin Login</h1>
            <p className="mt-2 text-sm leading-6 text-slate-600">Authorized admin access only.</p>
          </div>

          {currentUser?.role === "admin" && (
            <div className="mb-4 rounded-2xl border border-[#d9e6ff] bg-[#f5f9ff] px-4 py-3 text-sm text-slate-700">
              Signed in as admin {currentUser.name}.
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Admin Email</label>
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
            <Button type="submit" className="w-full rounded-full bg-[#2874f0] py-6 text-base hover:bg-[#1f66da]">
              Login to Admin Panel
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
