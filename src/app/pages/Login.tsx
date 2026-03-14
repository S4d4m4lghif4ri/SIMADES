import { useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import { Building2, Eye, EyeOff, LogIn, AlertCircle } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    await new Promise(r => setTimeout(r, 600));
    const ok = login(email, password);
    setLoading(false);
    if (ok) {
      navigate("/app/dashboard");
    } else {
      setError("Email atau password salah. Silakan coba lagi.");
    }
  };

  const quickLogin = (e: string, p: string) => {
    setEmail(e);
    setPassword(p);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-900 flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-teal-400/10 rounded-full blur-3xl"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo & Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 mb-4 shadow-2xl">
            <Building2 className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl text-white mb-1">SIMADES</h1>
          <p className="text-emerald-200 text-sm">Sistem Manajemen Administrasi Desa</p>
          <p className="text-emerald-300/70 text-xs mt-1">Desa Cibiru Hilir - Kabupaten Bandung</p>
        </div>

        {/* Card */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-8 shadow-2xl">
          <h2 className="text-white text-center mb-6">Masuk ke Sistem</h2>

          {error && (
            <div className="flex items-center gap-2 bg-red-500/20 border border-red-400/30 rounded-lg p-3 mb-4">
              <AlertCircle className="w-4 h-4 text-red-300 flex-shrink-0" />
              <p className="text-red-200 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-emerald-200 text-sm mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Masukkan email Anda"
                required
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label className="block text-emerald-200 text-sm mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Masukkan password"
                  required
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-500 hover:bg-emerald-400 text-white rounded-lg px-4 py-3 flex items-center justify-center gap-2 transition-all font-medium mt-2 disabled:opacity-60 shadow-lg shadow-emerald-500/30"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <LogIn className="w-5 h-5" />
              )}
              {loading ? "Memproses..." : "Masuk"}
            </button>
          </form>

          {/* Quick Login Demo */}
          <div className="mt-6 pt-6 border-t border-white/10">
            <p className="text-emerald-300/70 text-xs text-center mb-3">Login Cepat (Demo)</p>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: "Kepala Desa", email: "kades@desa.id", pass: "kades123" },
                { label: "Sekretaris", email: "sekdes@desa.id", pass: "sekdes123" },
                { label: "Kaur", email: "kaur@desa.id", pass: "kaur123" },
                { label: "Bendahara", email: "bendahara@desa.id", pass: "bendahara123" },
              ].map(item => (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => quickLogin(item.email, item.pass)}
                  className="text-xs bg-white/5 hover:bg-white/10 text-emerald-200 rounded-lg px-2 py-2 border border-white/10 transition-all text-center"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <p className="text-center text-emerald-400/50 text-xs mt-6">
          © 2026 SIMADES — Sistem Manajemen Administrasi Desa
        </p>
      </div>
    </div>
  );
}
