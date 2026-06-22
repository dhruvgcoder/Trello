import { useState } from "react";
import { api } from "../api";
import Btn from "./ui/Btn";
import Input from "./ui/Input";

export default function AuthScreen({ onAuth }) {
  const [mode, setMode] = useState("signin");
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit() {
    setError("");
    setLoading(true);
    const path = mode === "signin" ? "/users/signin" : "/users/signup";
    try {
      const res = await api(path, { method: "POST", body: JSON.stringify(form) });
      if (res.token) {
        onAuth(res.token, form.username);
      } else {
        setError(res.msg || res.message || "Something went wrong");
      }
    } catch (err) {
      setError(err.message || "Could not reach server");
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 font-sans">
      <div className="w-full max-w-sm bg-white p-8 rounded-lg shadow-sm border border-gray-200">
        <h1 className="text-2xl font-semibold text-gray-900 mb-6 text-center">Task Board</h1>

        <div className="flex gap-2 mb-6">
          {["signin", "signup"].map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`flex-1 py-2 text-sm font-medium rounded-md ${
                mode === m ? "bg-gray-100 text-gray-900" : "text-gray-500 hover:bg-gray-50"
              }`}
            >
              {m === "signin" ? "Sign In" : "Sign Up"}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          <Input
            label="Username"
            value={form.username}
            onChange={(e) => setForm((f) => ({ ...f, username: e.target.value }))}
            placeholder="Username"
          />
          <Input
            type="password"
            label="Password"
            value={form.password}
            onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
            placeholder="Password"
          />

          {error && <div className="text-red-500 text-sm">{error}</div>}

          <Btn fullWidth onClick={submit} disabled={loading || !form.username || !form.password}>
            {loading ? "Loading..." : mode === "signin" ? "Sign In" : "Create Account"}
          </Btn>
        </div>
      </div>
    </div>
  );
}
