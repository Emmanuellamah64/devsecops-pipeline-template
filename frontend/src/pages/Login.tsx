import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Shield, User, Lock, AlertCircle, ArrowRight } from "lucide-react";
import client from "../api/client";

export const Login: React.FC = () => {
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await client.post("/auth/login", { username, password });
      localStorage.setItem("access_token", response.data.access_token);
      navigate("/");
    } catch {
      setError("Invalid credentials. Try admin / securepassword");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-blue-950 flex items-center justify-center p-4">
      {/* Grid background pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative w-full max-w-sm">
        {/* Logo area */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl shadow-2xl shadow-blue-600/40 mb-4">
            <Shield size={30} className="text-white" />
          </div>
          <h1 className="text-white text-2xl font-bold tracking-tight">DevSecOps</h1>
          <p className="text-slate-400 text-sm mt-1">Security Pipeline Dashboard</p>
        </div>

        {/* Card */}
        <div className="bg-white/[0.07] backdrop-blur-xl border border-white/[0.12] rounded-2xl p-8 shadow-2xl">
          <h2 className="text-white text-lg font-semibold mb-1">Welcome back</h2>
          <p className="text-slate-400 text-sm mb-6">Sign in to your security dashboard</p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-2 tracking-wide">
                USERNAME
              </label>
              <div className="relative">
                <User size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-white/[0.08] border border-white/[0.15] rounded-xl text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  placeholder="Enter username"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-2 tracking-wide">
                PASSWORD
              </label>
              <div className="relative">
                <Lock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-white/[0.08] border border-white/[0.15] rounded-xl text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  placeholder="Enter password"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2.5 bg-red-500/10 border border-red-500/20 rounded-xl px-3.5 py-3">
                <AlertCircle size={14} className="text-red-400 flex-shrink-0" />
                <p className="text-xs text-red-300">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-600/25 mt-2"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign in
                  <ArrowRight size={14} />
                </>
              )}
            </button>
          </form>
        </div>

        <div className="text-center mt-6 space-y-1">
          <p className="text-slate-500 text-xs">
            Secured with JWT · TLS encrypted
          </p>
          <p className="text-slate-600 text-xs">
            DevSecOps Pipeline Template · v1.0.0
          </p>
        </div>
      </div>
    </div>
  );
};
