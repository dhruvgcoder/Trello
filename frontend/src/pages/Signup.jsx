import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../api";
import { useAuth } from "../context/AuthContext";
import { LayoutDashboard, Check, X } from "lucide-react";
import toast from "react-hot-toast";

const requirements = [
  { label: "At least 8 characters", test: (pw) => pw.length >= 8 },
  { label: "At least 2 characters for username", test: (un) => un.length >= 2 },
];

function PasswordStrength({ password }) {
  const score = Math.min(password.length / 2, 5);
  const bars = Math.floor(score);
  const colors = ["bg-red-500/80", "bg-orange-500/80", "bg-yellow-500/80", "bg-lime-500/80", "bg-green-500/80"];
  const label = ["Weak", "Fair", "Good", "Strong", "Very Strong"][Math.min(bars, 4)];

  return (
    <div className="space-y-1.5">
      <div className="flex gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className={`h-1.5 flex-1 rounded-full ${i < bars ? colors[i] : "bg-zinc-800"}`}
          />
        ))}
      </div>
      {password.length > 0 && (
        <p className="text-xs text-zinc-500">{label}</p>
      )}
    </div>
  );
}

export default function Signup() {
  const { handleAuth } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  function validate() {
    const errs = {};
    if (form.username.length < 2) errs.username = "Username must be at least 2 characters";
    if (form.password.length < 8) errs.password = "Password must be at least 8 characters";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function submit(e) {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const res = await api("/users/signup", {
        method: "POST",
        body: JSON.stringify(form),
      });
      if (res.token) {
        handleAuth(res.token, res.username || form.username);
        toast.success("Account created successfully!");
        navigate("/dashboard", { replace: true });
      } else {
        toast.error(res.msg || "Something went wrong");
      }
    } catch (err) {
      toast.error(err.message || "Could not reach server");
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-[#09090b] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background glow decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />
      
      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2.5">
            <div className="bg-indigo-600 text-white p-1.5 rounded-xl shadow-md">
              <LayoutDashboard className="w-5 h-5" />
            </div>
            <span className="text-2xl font-bold text-zinc-100 tracking-tight">TaskBoard</span>
          </Link>
        </div>

        <div className="bg-[#161619] rounded-2xl shadow-2xl border border-zinc-800/80 p-8">
          <h1 className="text-2xl font-bold text-zinc-100 mb-2">Create your account</h1>
          <p className="text-zinc-400 text-sm mb-8">Start organizing your work today</p>

          <form onSubmit={submit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-zinc-300 mb-1.5">Username</label>
              <input
                type="text"
                value={form.username}
                onChange={(e) => {
                  setForm((f) => ({ ...f, username: e.target.value }));
                  if (errors.username) setErrors((p) => ({ ...p, username: "" }));
                }}
                placeholder="Choose a username"
                className={`w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all bg-[#09090b] text-zinc-100 shadow-inner ${
                  errors.username ? "border-red-500/50" : "border-zinc-800"
                }`}
              />
              {errors.username && <p className="text-red-400 text-xs mt-1">{errors.username}</p>}
              <div className="mt-2.5 flex items-center gap-1.5 text-xs">
                {requirements[1].test(form.username) ? (
                  <Check className="w-3.5 h-3.5 text-green-500" />
                ) : (
                  <X className="w-3.5 h-3.5 text-zinc-600" />
                )}
                <span className={requirements[1].test(form.username) ? "text-green-400 font-medium" : "text-zinc-500"}>
                  {requirements[1].label}
                </span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-zinc-300 mb-1.5">Password</label>
              <input
                type="password"
                value={form.password}
                onChange={(e) => {
                  setForm((f) => ({ ...f, password: e.target.value }));
                  if (errors.password) setErrors((p) => ({ ...p, password: "" }));
                }}
                placeholder="Create a strong password"
                className={`w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all bg-[#09090b] text-zinc-100 shadow-inner ${
                  errors.password ? "border-red-500/50" : "border-zinc-800"
                }`}
              />
              {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password}</p>}
              <div className="mt-2">
                <PasswordStrength password={form.password} />
              </div>
              <div className="mt-2.5 flex items-center gap-1.5 text-xs">
                {requirements[0].test(form.password) ? (
                  <Check className="w-3.5 h-3.5 text-green-500" />
                ) : (
                  <X className="w-3.5 h-3.5 text-zinc-600" />
                )}
                <span className={requirements[0].test(form.password) ? "text-green-400 font-medium" : "text-zinc-500"}>
                  {requirements[0].label}
                </span>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !form.username || !form.password}
              className="w-full py-2.5 mt-2 bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-violet-500 hover:to-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md shadow-indigo-500/10 active:scale-98"
            >
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </form>

          <p className="text-center text-sm text-zinc-400 mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-indigo-400 font-semibold hover:text-indigo-300">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
