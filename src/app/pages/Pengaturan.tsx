import { useState } from "react";
import { users as initialUsers, ROLES } from "../data/mockData";
import { useAuth } from "../context/AuthContext";
import {
  Settings, Users, Plus, Edit2, Trash2, X, Lock, Building2,
  CheckCircle, AlertCircle, Eye, EyeOff, Shield, Bell, Database
} from "lucide-react";

type User = typeof initialUsers[0];

type Tab = "users" | "desa" | "security" | "notifikasi" | "system";

const tabs: { id: Tab; label: string; icon: any }[] = [
  { id: "users", label: "Pengguna", icon: Users },
  { id: "desa", label: "Profil Desa", icon: Building2 },
  { id: "security", label: "Keamanan", icon: Shield },
  { id: "notifikasi", label: "Notifikasi", icon: Bell },
  { id: "system", label: "Sistem", icon: Database },
];

const roleColor: Record<string, string> = {
  KEPALA_DESA: "bg-purple-100 text-purple-700",
  SEKDES: "bg-blue-100 text-blue-700",
  KAUR: "bg-green-100 text-green-700",
  KASI: "bg-yellow-100 text-yellow-700",
  BENDAHARA: "bg-orange-100 text-orange-700",
  ADMIN: "bg-red-100 text-red-700",
};

export default function Pengaturan() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>("users");
  const [users, setUsers] = useState(initialUsers);
  const [showAddUser, setShowAddUser] = useState(false);
  const [showEditUser, setShowEditUser] = useState<User | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    nama: "",
    jabatan: "",
    role: "KAUR",
    email: "",
    password: "",
    status: "aktif",
  });

  const [desaInfo, setDesaInfo] = useState({
    nama_desa: "Desa Cibiru Hilir",
    kecamatan: "Cileunyi",
    kabupaten: "Bandung",
    provinsi: "Jawa Barat",
    kode_pos: "40625",
    telepon: "(022) 7800-1234",
    email: "desacibiruhilir@mail.com",
    website: "desacibiruhilir.desa.id",
  });

  const canManageUsers = user?.role === "ADMIN" || user?.role === "KEPALA_DESA";

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleAddUser = () => {
    if (!form.nama || !form.email) return;
    const newId = `U${String(users.length + 1).padStart(3, "0")}`;
    const newUser: User = {
      user_id: newId,
      nama: form.nama,
      jabatan: form.jabatan,
      role: form.role,
      email: form.email,
      password: form.password || "password123",
      status: form.status as "aktif" | "nonaktif",
    };
    setUsers(prev => [...prev, newUser]);
    setShowAddUser(false);
    setForm({ nama: "", jabatan: "", role: "KAUR", email: "", password: "", status: "aktif" });
  };

  const handleDeleteUser = (id: string) => {
    if (id === user?.user_id) return;
    setUsers(prev => prev.filter(u => u.user_id !== id));
  };

  const handleToggleStatus = (id: string) => {
    setUsers(prev => prev.map(u =>
      u.user_id === id
        ? { ...u, status: u.status === "aktif" ? "nonaktif" : "aktif" }
        : u
    ));
  };

  const renderContent = () => {
    switch (activeTab) {
      case "users":
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-800">Manajemen Pengguna</p>
                <p className="text-xs text-gray-500 mt-0.5">{users.length} pengguna terdaftar</p>
              </div>
              {canManageUsers && (
                <button
                  onClick={() => setShowAddUser(true)}
                  className="flex items-center gap-2 bg-emerald-600 text-white px-3 py-2 rounded-xl text-sm hover:bg-emerald-700 transition-all"
                >
                  <Plus className="w-4 h-4" />
                  Tambah
                </button>
              )}
            </div>
            <div className="space-y-2">
              {users.map(u => (
                <div key={u.user_id} className="flex items-center gap-3 p-3 rounded-xl border border-gray-200 hover:bg-gray-50 transition-all">
                  <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-emerald-700 text-sm">{u.nama.charAt(0)}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm text-gray-800">{u.nama}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${roleColor[u.role]}`}>
                        {ROLES[u.role as keyof typeof ROLES]}
                      </span>
                      <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                        u.status === "aktif" ? "bg-emerald-50 text-emerald-600" : "bg-gray-100 text-gray-500"
                      }`}>
                        {u.status}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 truncate">{u.email} · {u.jabatan}</p>
                  </div>
                  {canManageUsers && u.user_id !== user?.user_id && (
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <button
                        onClick={() => handleToggleStatus(u.user_id)}
                        className="p-1.5 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all"
                        title="Toggle Status"
                      >
                        {u.status === "aktif" ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => handleDeleteUser(u.user_id)}
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                        title="Hapus"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        );

      case "desa":
        return (
          <div className="space-y-4">
            <p className="text-sm text-gray-500">Informasi dan profil desa</p>
            <div className="grid sm:grid-cols-2 gap-4">
              {Object.entries(desaInfo).map(([key, val]) => {
                const labels: Record<string, string> = {
                  nama_desa: "Nama Desa",
                  kecamatan: "Kecamatan",
                  kabupaten: "Kabupaten/Kota",
                  provinsi: "Provinsi",
                  kode_pos: "Kode Pos",
                  telepon: "Telepon",
                  email: "Email",
                  website: "Website",
                };
                return (
                  <div key={key}>
                    <label className="block text-sm text-gray-700 mb-1.5">{labels[key]}</label>
                    <input
                      type="text"
                      value={val}
                      onChange={e => setDesaInfo(d => ({ ...d, [key]: e.target.value }))}
                      className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                );
              })}
            </div>
            <button onClick={handleSave} className="bg-emerald-600 text-white px-6 py-2.5 rounded-xl text-sm hover:bg-emerald-700 transition-all">
              Simpan Perubahan
            </button>
          </div>
        );

      case "security":
        return (
          <div className="space-y-5">
            <p className="text-sm text-gray-500">Pengaturan keamanan akun</p>
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-amber-800">Pastikan menggunakan password yang kuat dan tidak membagikannya kepada pihak lain.</p>
            </div>
            <div className="space-y-4 max-w-md">
              <div>
                <label className="block text-sm text-gray-700 mb-1.5">Password Lama</label>
                <div className="relative">
                  <input type="password" placeholder="Masukkan password lama"
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1.5">Password Baru</label>
                <div className="relative">
                  <input type={showPassword ? "text" : "password"} placeholder="Masukkan password baru"
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 pr-10" />
                  <button onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1.5">Konfirmasi Password Baru</label>
                <input type="password" placeholder="Ulangi password baru"
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
              </div>
              <button onClick={handleSave} className="flex items-center gap-2 bg-emerald-600 text-white px-6 py-2.5 rounded-xl text-sm hover:bg-emerald-700 transition-all">
                <Lock className="w-4 h-4" />
                Ganti Password
              </button>
            </div>
          </div>
        );

      case "notifikasi":
        return (
          <div className="space-y-4">
            <p className="text-sm text-gray-500">Konfigurasi notifikasi sistem</p>
            <div className="space-y-3">
              {[
                { label: "Surat masuk baru", desc: "Notifikasi ketika ada surat masuk", key: "surat_masuk" },
                { label: "Surat perlu persetujuan", desc: "Notifikasi surat menunggu TTD Kepala Desa", key: "surat_approve" },
                { label: "Tugas baru diterima", desc: "Notifikasi ketika mendapat tugas baru", key: "tugas_baru" },
                { label: "Deadline tugas mendekat", desc: "Reminder 3 hari sebelum deadline", key: "deadline" },
                { label: "Disposisi baru", desc: "Notifikasi ketika mendapat instruksi disposisi", key: "disposisi" },
                { label: "Laporan keuangan", desc: "Ringkasan keuangan bulanan", key: "keuangan" },
              ].map((item, i) => (
                <div key={item.key} className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl">
                  <div>
                    <p className="text-sm text-gray-800">{item.label}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{item.desc}</p>
                  </div>
                  <button
                    onClick={handleSave}
                    className={`relative w-11 h-6 rounded-full transition-all ${i % 2 === 0 ? "bg-emerald-500" : "bg-gray-300"}`}
                  >
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${i % 2 === 0 ? "left-6" : "left-1"}`}></div>
                  </button>
                </div>
              ))}
            </div>
          </div>
        );

      case "system":
        return (
          <div className="space-y-4">
            <p className="text-sm text-gray-500">Informasi sistem dan manajemen data</p>
            <div className="grid sm:grid-cols-2 gap-3">
              {[
                { label: "Versi Aplikasi", value: "SIMADES v1.0.0" },
                { label: "Database", value: "Google Sheets (Mock)" },
                { label: "File Storage", value: "Google Drive (Mock)" },
                { label: "Total Pengguna", value: `${initialUsers.length} pengguna aktif` },
                { label: "Total Record", value: "87 data tersimpan" },
                { label: "Last Backup", value: "12 Mar 2026 · 23:00" },
              ].map(item => (
                <div key={item.label} className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                  <p className="text-xs text-gray-400">{item.label}</p>
                  <p className="text-sm text-gray-800 mt-1">{item.value}</p>
                </div>
              ))}
            </div>
            <div className="flex gap-3 flex-wrap">
              <button onClick={handleSave} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl text-sm hover:bg-blue-700 transition-all">
                <Database className="w-4 h-4" />
                Backup Data
              </button>
              <button className="flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-xl text-sm hover:bg-gray-200 transition-all">
                Bersihkan Cache
              </button>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="p-4 lg:p-6 space-y-5">
      {/* Header */}
      <div>
        <h1 className="text-gray-900">Pengaturan</h1>
        <p className="text-gray-500 text-sm mt-0.5">Konfigurasi sistem dan manajemen pengguna</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-5">
        {/* Sidebar Tabs */}
        <div className="lg:w-56 flex-shrink-0">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-2 space-y-1 lg:sticky lg:top-4">
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all text-left ${
                    activeTab === tab.id
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${activeTab === tab.id ? "text-emerald-600" : "text-gray-400"}`} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            {renderContent()}
          </div>
        </div>
      </div>

      {/* Save Success Toast */}
      {saved && (
        <div className="fixed bottom-6 right-6 bg-emerald-600 text-white rounded-xl px-4 py-3 text-sm shadow-xl flex items-center gap-2 z-50">
          <CheckCircle className="w-4 h-4" />
          Perubahan berhasil disimpan
        </div>
      )}

      {/* Add User Modal */}
      {showAddUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-gray-900">Tambah Pengguna</h3>
              <button onClick={() => setShowAddUser(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              {[
                { label: "Nama Lengkap", key: "nama", type: "text", placeholder: "Nama pengguna" },
                { label: "Jabatan", key: "jabatan", type: "text", placeholder: "Jabatan resmi" },
                { label: "Email", key: "email", type: "email", placeholder: "email@desa.id" },
                { label: "Password", key: "password", type: "password", placeholder: "Password awal" },
              ].map(field => (
                <div key={field.key}>
                  <label className="block text-sm text-gray-700 mb-1.5">{field.label}</label>
                  <input
                    type={field.type}
                    placeholder={field.placeholder}
                    value={(form as any)[field.key]}
                    onChange={e => setForm(f => ({ ...f, [field.key]: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              ))}
              <div>
                <label className="block text-sm text-gray-700 mb-1.5">Role</label>
                <select value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500">
                  {Object.entries(ROLES).map(([key, val]) => (
                    <option key={key} value={key}>{val}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowAddUser(false)} className="flex-1 border border-gray-200 text-gray-600 rounded-xl py-2.5 text-sm hover:bg-gray-50">
                Batal
              </button>
              <button onClick={handleAddUser} className="flex-1 bg-emerald-600 text-white rounded-xl py-2.5 text-sm hover:bg-emerald-700">
                Tambah
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
