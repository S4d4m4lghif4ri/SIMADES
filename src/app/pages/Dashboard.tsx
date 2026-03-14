import { useAuth } from "../context/AuthContext";
import { suratKeluar, suratMasuk, tugas, kegiatan, keuangan, monthlyLetterStats, taskCompletionStats, financialStats } from "../data/mockData";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, AreaChart, Area, ResponsiveContainer } from "recharts";
import { Mail, MailOpen, CheckCircle, Clock, Wallet, Calendar, TrendingUp, TrendingDown, AlertCircle } from "lucide-react";

const formatRupiah = (v: number) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", notation: "compact", maximumFractionDigits: 1 }).format(v);

export default function Dashboard() {
  const { user } = useAuth();

  const pendingSurat = suratKeluar.filter(s => s.status === "pending").length;
  const approvedSurat = suratKeluar.filter(s => s.status === "approved").length;
  const activeTasks = tugas.filter(t => t.status === "proses").length;
  const todayActivities = kegiatan.filter(k => k.tanggal === "2026-03-13").length;
  const totalMasuk = keuangan.filter(k => k.jenis === "masuk").reduce((a, b) => a + b.jumlah, 0);
  const totalKeluar = keuangan.filter(k => k.jenis === "keluar").reduce((a, b) => a + b.jumlah, 0);
  const saldo = totalMasuk - totalKeluar;

  const recentSurat = suratMasuk.slice(0, 4);
  const recentTasks = tugas.slice(0, 4);

  const statsCards = [
    { label: "Surat Pending", value: pendingSurat, icon: Clock, color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-100", trend: "+2 minggu ini" },
    { label: "Surat Disetujui", value: approvedSurat, icon: CheckCircle, color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-100", trend: "+5 bulan ini" },
    { label: "Tugas Aktif", value: activeTasks, icon: AlertCircle, color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-100", trend: "dari " + tugas.length + " total" },
    { label: "Kegiatan Hari Ini", value: todayActivities, icon: Calendar, color: "text-purple-600", bg: "bg-purple-50", border: "border-purple-100", trend: "Jadwal hari ini" },
  ];

  const statusColor: Record<string, string> = {
    pending: "bg-amber-100 text-amber-700",
    approved: "bg-emerald-100 text-emerald-700",
    rejected: "bg-red-100 text-red-700",
    baru: "bg-blue-100 text-blue-700",
    diproses: "bg-amber-100 text-amber-700",
    selesai: "bg-emerald-100 text-emerald-700",
    proses: "bg-blue-100 text-blue-700",
    belum_mulai: "bg-gray-100 text-gray-600",
  };

  const statusLabel: Record<string, string> = {
    pending: "Pending",
    approved: "Disetujui",
    rejected: "Ditolak",
    baru: "Baru",
    diproses: "Diproses",
    selesai: "Selesai",
    proses: "Proses",
    belum_mulai: "Belum Mulai",
  };

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h1 className="text-gray-900">Selamat Datang, {user?.nama?.split(" ")[0]}!</h1>
          <p className="text-gray-500 text-sm mt-0.5">Sabtu, 14 Maret 2026 • Desa Cibiru Hilir</p>
        </div>
        <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-2">
          <Wallet className="w-4 h-4 text-emerald-600" />
          <div>
            <p className="text-xs text-emerald-600">Saldo Kas Desa</p>
            <p className="text-emerald-700 text-sm">{formatRupiah(saldo)}</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statsCards.map((card) => (
          <div key={card.label} className={`bg-white rounded-xl border ${card.border} p-4 shadow-sm`}>
            <div className="flex items-start justify-between mb-3">
              <div className={`w-10 h-10 ${card.bg} rounded-lg flex items-center justify-center`}>
                <card.icon className={`w-5 h-5 ${card.color}`} />
              </div>
            </div>
            <div className="text-2xl text-gray-900 mb-0.5">{card.value}</div>
            <div className="text-sm text-gray-500">{card.label}</div>
            <div className="text-xs text-gray-400 mt-1">{card.trend}</div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-3 gap-4">
        {/* Letter Statistics */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-800">Statistik Surat</h3>
            <span className="text-xs text-gray-400">6 Bulan Terakhir</span>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={monthlyLetterStats} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid key="db-bar-grid" strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis key="db-bar-xaxis" dataKey="bulan" tick={{ fontSize: 12 }} />
              <YAxis key="db-bar-yaxis" tick={{ fontSize: 12 }} />
              <Tooltip key="db-bar-tooltip" />
              <Legend key="db-bar-legend" wrapperStyle={{ fontSize: "12px" }} />
              <Bar key="db-bar-keluar" dataKey="keluar" name="Surat Keluar" fill="#10b981" radius={[4, 4, 0, 0]} />
              <Bar key="db-bar-masuk" dataKey="masuk" name="Surat Masuk" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Task Completion */}
        <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-800">Status Tugas</h3>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie
                key="db-pie"
                data={taskCompletionStats}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={4}
                dataKey="value"
              >
                {taskCompletionStats.map((entry) => (
                  <Cell key={`db-cell-${entry.name}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip key="db-pie-tooltip" />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-2">
            {taskCompletionStats.map(item => (
              <div key={item.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                  <span className="text-gray-600">{item.name}</span>
                </div>
                <span className="text-gray-800">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Financial Chart */}
      <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
          <h3 className="text-gray-800">Keuangan Desa 2026</h3>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-emerald-500" />
              <span className="text-gray-600">Pemasukan: <span className="text-emerald-600">{formatRupiah(totalMasuk)}</span></span>
            </div>
            <div className="flex items-center gap-1.5">
              <TrendingDown className="w-4 h-4 text-red-500" />
              <span className="text-gray-600">Pengeluaran: <span className="text-red-600">{formatRupiah(totalKeluar)}</span></span>
            </div>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={financialStats} margin={{ top: 0, right: 0, left: 10, bottom: 0 }}>
            <defs>
              <linearGradient id="db-masukGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="db-keluarGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid key="db-area-grid" strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis key="db-area-xaxis" dataKey="bulan" tick={{ fontSize: 12 }} />
            <YAxis key="db-area-yaxis" tick={{ fontSize: 11 }} tickFormatter={v => v > 0 ? formatRupiah(v) : "0"} width={70} />
            <Tooltip key="db-area-tooltip" formatter={(v: number) => formatRupiah(v)} />
            <Legend key="db-area-legend" wrapperStyle={{ fontSize: "12px" }} />
            <Area key="db-area-masuk" type="monotone" dataKey="masuk" name="Pemasukan" stroke="#10b981" fill="url(#db-masukGrad)" strokeWidth={2} />
            <Area key="db-area-keluar" type="monotone" dataKey="keluar" name="Pengeluaran" stroke="#ef4444" fill="url(#db-keluarGrad)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Recent Data */}
      <div className="grid lg:grid-cols-2 gap-4">
        {/* Recent Surat Masuk */}
        <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-800">Surat Masuk Terbaru</h3>
            <MailOpen className="w-4 h-4 text-gray-400" />
          </div>
          <div className="space-y-3">
            {recentSurat.map(surat => (
              <div key={surat.surat_masuk_id} className="flex items-start gap-3 pb-3 border-b border-gray-50 last:border-0 last:pb-0">
                <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                  <MailOpen className="w-4 h-4 text-blue-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-gray-800 text-sm truncate">{surat.perihal}</p>
                  <p className="text-gray-400 text-xs">{surat.asal_surat} • {surat.tanggal_surat}</p>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 ${statusColor[surat.status]}`}>
                  {statusLabel[surat.status]}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Tasks */}
        <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-800">Tugas Terkini</h3>
            <Mail className="w-4 h-4 text-gray-400" />
          </div>
          <div className="space-y-3">
            {recentTasks.map(task => (
              <div key={task.tugas_id} className="flex items-start gap-3 pb-3 border-b border-gray-50 last:border-0 last:pb-0">
                <div className="w-8 h-8 bg-purple-50 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                  <CheckCircle className="w-4 h-4 text-purple-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-gray-800 text-sm truncate">{task.nama_tugas}</p>
                  <p className="text-gray-400 text-xs">{task.penerima_tugas} • Deadline: {task.deadline}</p>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 ${statusColor[task.status]}`}>
                  {statusLabel[task.status]}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
