import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import {
  LayoutDashboard, Mail, MailOpen, GitBranch, ClipboardList,
  Calendar, Wallet, Archive, BarChart3, Settings, LogOut,
  Menu, X, Building2, Bell, ChevronDown, User, Shield
} from "lucide-react";

const navItems = [
  { to: "/app/dashboard", icon: LayoutDashboard, label: "Dashboard", module: "dashboard" },
  { to: "/app/surat-keluar", icon: Mail, label: "Surat Keluar", module: "surat-keluar" },
  { to: "/app/surat-masuk", icon: MailOpen, label: "Surat Masuk", module: "surat-masuk" },
  { to: "/app/disposisi", icon: GitBranch, label: "Disposisi", module: "disposisi" },
  { to: "/app/tugas", icon: ClipboardList, label: "Manajemen Tugas", module: "tugas" },
  { to: "/app/kegiatan", icon: Calendar, label: "Kegiatan Desa", module: "kegiatan" },
  { to: "/app/keuangan", icon: Wallet, label: "Keuangan Desa", module: "keuangan" },
  { to: "/app/arsip", icon: Archive, label: "Arsip Dokumen", module: "arsip" },
  { to: "/app/laporan", icon: BarChart3, label: "Laporan", module: "laporan" },
  { to: "/app/pengaturan", icon: Settings, label: "Pengaturan", module: "pengaturan" },
];

const roleColors: Record<string, string> = {
  KEPALA_DESA: "bg-purple-100 text-purple-700",
  SEKDES: "bg-blue-100 text-blue-700",
  KAUR: "bg-green-100 text-green-700",
  KASI: "bg-yellow-100 text-yellow-700",
  BENDAHARA: "bg-orange-100 text-orange-700",
  ADMIN: "bg-red-100 text-red-700",
};

export default function Layout() {
  const { user, logout, hasPermission } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-6 border-b border-emerald-700/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center flex-shrink-0">
            <Building2 className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="text-white text-sm leading-tight">SIMADES</div>
            <div className="text-emerald-300 text-xs">Desa Cibiru Hilir</div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 overflow-y-auto space-y-1">
        {navItems.map(item => {
          if (!hasPermission(item.module)) return null;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm ${
                  isActive
                    ? "bg-white/15 text-white shadow-sm"
                    : "text-emerald-200 hover:bg-white/10 hover:text-white"
                }`
              }
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* User Info at bottom */}
      <div className="p-4 border-t border-emerald-700/50">
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="w-9 h-9 bg-emerald-400/20 rounded-full flex items-center justify-center flex-shrink-0">
            <User className="w-5 h-5 text-emerald-200" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-xs truncate">{user?.nama}</p>
            <p className="text-emerald-300 text-xs truncate">{user?.jabatan}</p>
          </div>
          <button
            onClick={handleLogout}
            className="text-emerald-300 hover:text-red-300 transition-colors"
            title="Keluar"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 flex-shrink-0 bg-gradient-to-b from-emerald-900 to-emerald-800 flex-col shadow-2xl">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-72 bg-gradient-to-b from-emerald-900 to-emerald-800 shadow-2xl flex flex-col">
            <button
              onClick={() => setSidebarOpen(false)}
              className="absolute right-4 top-4 text-white/70 hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navbar */}
        <header className="bg-white border-b border-gray-200 px-4 lg:px-6 py-3 flex items-center justify-between flex-shrink-0 shadow-sm">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-gray-500 hover:text-gray-700 transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="hidden sm:flex items-center gap-2">
              <Shield className="w-5 h-5 text-emerald-600" />
              <span className="text-gray-700 text-sm">Pemerintahan Desa Cibiru Hilir</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Notification */}
            <button className="relative text-gray-500 hover:text-gray-700 transition-colors p-1.5 hover:bg-gray-100 rounded-lg">
              <Bell className="w-5 h-5" />
              <span className="absolute top-0.5 right-0.5 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {/* Profile */}
            <div className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 hover:bg-gray-100 rounded-lg px-2 py-1.5 transition-colors"
              >
                <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-emerald-700" />
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-gray-800 text-xs leading-tight">{user?.nama}</p>
                  <span className={`text-xs px-1.5 py-0.5 rounded-full ${roleColors[user?.role || ""] || "bg-gray-100 text-gray-600"}`}>
                    {user?.jabatan}
                  </span>
                </div>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </button>

              {profileOpen && (
                <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-gray-800 text-sm">{user?.nama}</p>
                    <p className="text-gray-500 text-xs">{user?.email}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors mt-1"
                  >
                    <LogOut className="w-4 h-4" />
                    Keluar
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto bg-gray-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
