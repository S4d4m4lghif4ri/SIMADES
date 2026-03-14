import { useState } from "react";
import { keuangan as initialKeuangan, financialStats } from "../data/mockData";
import { useAuth } from "../context/AuthContext";
import { Plus, Search, Filter, Eye, TrendingUp, TrendingDown, Wallet, X, Receipt, DollarSign } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

type Transaksi = typeof initialKeuangan[0];

const formatRupiah = (v: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(v);

const formatRupiahCompact = (v: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", notation: "compact", maximumFractionDigits: 1 }).format(v);

const sumberDanaOptions = ["Dana Desa", "ADD", "PADes", "BHP", "BHPD"];

export default function KeuanganDesa() {
  const { user } = useAuth();
  const [data, setData] = useState(initialKeuangan);
  const [search, setSearch] = useState("");
  const [filterJenis, setFilterJenis] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [showDetail, setShowDetail] = useState<Transaksi | null>(null);
  const [form, setForm] = useState({
    jenis: "masuk" as "masuk" | "keluar",
    tanggal: new Date().toISOString().split("T")[0],
    sumber_dana: "",
    jumlah: "",
    keterangan: "",
  });

  const canAccess = user?.role === "KEPALA_DESA" || user?.role === "BENDAHARA";

  if (!canAccess) {
    return (
      <div className="p-6 flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mb-4">
          <Wallet className="w-8 h-8 text-red-400" />
        </div>
        <h3 className="text-gray-800 mb-2">Akses Terbatas</h3>
        <p className="text-gray-500 text-sm max-w-xs">
          Modul Keuangan hanya dapat diakses oleh Kepala Desa dan Bendahara.
        </p>
      </div>
    );
  }

  const filtered = data.filter(t => {
    const matchSearch =
      t.keterangan.toLowerCase().includes(search.toLowerCase()) ||
      t.sumber_dana.toLowerCase().includes(search.toLowerCase());
    const matchJenis = filterJenis === "all" || t.jenis === filterJenis;
    return matchSearch && matchJenis;
  });

  const totalMasuk = data.filter(t => t.jenis === "masuk").reduce((a, b) => a + b.jumlah, 0);
  const totalKeluar = data.filter(t => t.jenis === "keluar").reduce((a, b) => a + b.jumlah, 0);
  const saldo = totalMasuk - totalKeluar;

  const handleCreate = () => {
    if (!form.sumber_dana || !form.jumlah || !form.keterangan) return;
    const newId = `KU${String(data.length + 1).padStart(3, "0")}`;
    const newTx: Transaksi = {
      transaksi_id: newId,
      tanggal: form.tanggal,
      jenis: form.jenis,
      sumber_dana: form.sumber_dana,
      jumlah: parseInt(form.jumlah),
      keterangan: form.keterangan,
      bukti: `bukti_${newId.toLowerCase()}.pdf`,
    };
    setData(prev => [newTx, ...prev]);
    setShowModal(false);
    setForm({ jenis: "masuk", tanggal: new Date().toISOString().split("T")[0], sumber_dana: "", jumlah: "", keterangan: "" });
  };

  return (
    <div className="p-4 lg:p-6 space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-gray-900">Keuangan Desa</h1>
          <p className="text-gray-500 text-sm mt-0.5">Pencatatan dan laporan keuangan desa</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-xl transition-all shadow-sm text-sm"
        >
          <Plus className="w-4 h-4" />
          Catat Transaksi
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-xl p-5 text-white shadow-lg shadow-emerald-200">
          <div className="flex items-center justify-between mb-3">
            <p className="text-emerald-100 text-sm">Saldo Kas Desa</p>
            <Wallet className="w-5 h-5 text-emerald-200" />
          </div>
          <p className="text-2xl">{formatRupiahCompact(saldo)}</p>
          <p className="text-emerald-200 text-xs mt-1">Per {new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}</p>
        </div>
        <div className="bg-white border border-emerald-100 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <p className="text-gray-500 text-sm">Total Pemasukan</p>
            <div className="w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
            </div>
          </div>
          <p className="text-xl text-emerald-700">{formatRupiahCompact(totalMasuk)}</p>
          <p className="text-gray-400 text-xs mt-1">{data.filter(t => t.jenis === "masuk").length} transaksi</p>
        </div>
        <div className="bg-white border border-red-100 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <p className="text-gray-500 text-sm">Total Pengeluaran</p>
            <div className="w-8 h-8 bg-red-50 rounded-lg flex items-center justify-center">
              <TrendingDown className="w-4 h-4 text-red-500" />
            </div>
          </div>
          <p className="text-xl text-red-600">{formatRupiahCompact(totalKeluar)}</p>
          <p className="text-gray-400 text-xs mt-1">{data.filter(t => t.jenis === "keluar").length} transaksi</p>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
        <h3 className="text-gray-800 mb-4">Grafik Keuangan 2026</h3>
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={financialStats} margin={{ top: 0, right: 0, left: 10, bottom: 0 }}>
            <defs>
              <linearGradient id="keu-masukGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="keu-keluarGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid key="keu-area-grid" strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis key="keu-area-xaxis" dataKey="bulan" tick={{ fontSize: 12 }} />
            <YAxis key="keu-area-yaxis" tick={{ fontSize: 11 }} tickFormatter={v => v > 0 ? formatRupiahCompact(v) : "0"} width={75} />
            <Tooltip key="keu-area-tooltip" formatter={(v: number) => formatRupiah(v)} />
            <Legend key="keu-area-legend" wrapperStyle={{ fontSize: "12px" }} />
            <Area key="keu-area-masuk" type="monotone" dataKey="masuk" name="Pemasukan" stroke="#10b981" fill="url(#keu-masukGrad)" strokeWidth={2} />
            <Area key="keu-area-keluar" type="monotone" dataKey="keluar" name="Pengeluaran" stroke="#ef4444" fill="url(#keu-keluarGrad)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Cari transaksi..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
          />
        </div>
        <div className="flex gap-2">
          {["all", "masuk", "keluar"].map(j => (
            <button
              key={j}
              onClick={() => setFilterJenis(j)}
              className={`px-4 py-2.5 rounded-xl text-sm transition-all ${
                filterJenis === j
                  ? j === "masuk" ? "bg-emerald-600 text-white" : j === "keluar" ? "bg-red-500 text-white" : "bg-gray-800 text-white"
                  : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}
            >
              {j === "all" ? "Semua" : j === "masuk" ? "Pemasukan" : "Pengeluaran"}
            </button>
          ))}
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-4 py-3 text-xs text-gray-500 uppercase tracking-wide">Transaksi</th>
                <th className="text-left px-4 py-3 text-xs text-gray-500 uppercase tracking-wide hidden md:table-cell">Sumber Dana</th>
                <th className="text-left px-4 py-3 text-xs text-gray-500 uppercase tracking-wide hidden sm:table-cell">Tanggal</th>
                <th className="text-right px-4 py-3 text-xs text-gray-500 uppercase tracking-wide">Jumlah</th>
                <th className="text-right px-4 py-3 text-xs text-gray-500 uppercase tracking-wide">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(tx => (
                <tr key={tx.transaksi_id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        tx.jenis === "masuk" ? "bg-emerald-50" : "bg-red-50"
                      }`}>
                        {tx.jenis === "masuk"
                          ? <TrendingUp className="w-4 h-4 text-emerald-600" />
                          : <TrendingDown className="w-4 h-4 text-red-500" />
                        }
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm text-gray-800 truncate max-w-[200px]">{tx.keterangan}</p>
                        <p className="text-xs text-gray-400">{tx.transaksi_id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-lg">{tx.sumber_dana}</span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500 hidden sm:table-cell">{tx.tanggal}</td>
                  <td className="px-4 py-3 text-right">
                    <span className={`text-sm ${tx.jenis === "masuk" ? "text-emerald-600" : "text-red-600"}`}>
                      {tx.jenis === "masuk" ? "+" : "-"}{formatRupiahCompact(tx.jumlah)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => setShowDetail(tx)}
                      className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-all"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-gray-400">
                    <DollarSign className="w-10 h-10 mx-auto mb-2 opacity-30" />
                    <p className="text-sm">Tidak ada transaksi</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-gray-900">Catat Transaksi</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-700 mb-1.5">Jenis Transaksi</label>
                <div className="grid grid-cols-2 gap-2">
                  {(["masuk", "keluar"] as const).map(j => (
                    <button
                      key={j}
                      onClick={() => setForm(f => ({ ...f, jenis: j }))}
                      className={`py-2.5 rounded-xl text-sm transition-all border ${
                        form.jenis === j
                          ? j === "masuk" ? "bg-emerald-600 text-white border-emerald-600" : "bg-red-500 text-white border-red-500"
                          : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                      }`}
                    >
                      {j === "masuk" ? "Pemasukan" : "Pengeluaran"}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1.5">Tanggal</label>
                <input type="date" value={form.tanggal} onChange={e => setForm(f => ({ ...f, tanggal: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1.5">Sumber Dana</label>
                <select value={form.sumber_dana} onChange={e => setForm(f => ({ ...f, sumber_dana: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500">
                  <option value="">Pilih sumber dana...</option>
                  {sumberDanaOptions.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1.5">Jumlah (Rp)</label>
                <input type="number" placeholder="0" value={form.jumlah}
                  onChange={e => setForm(f => ({ ...f, jumlah: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1.5">Keterangan</label>
                <textarea value={form.keterangan} onChange={e => setForm(f => ({ ...f, keterangan: e.target.value }))}
                  placeholder="Keterangan transaksi..." rows={2}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none" />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1.5">Upload Bukti</label>
                <div className="border-2 border-dashed border-gray-200 rounded-xl p-5 text-center text-gray-400 hover:border-emerald-300 transition-colors cursor-pointer">
                  <Receipt className="w-7 h-7 mx-auto mb-2 opacity-50" />
                  <p className="text-xs">Upload bukti pembayaran</p>
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowModal(false)} className="flex-1 border border-gray-200 text-gray-600 rounded-xl py-2.5 text-sm hover:bg-gray-50">
                Batal
              </button>
              <button onClick={handleCreate} className="flex-1 bg-emerald-600 text-white rounded-xl py-2.5 text-sm hover:bg-emerald-700">
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {showDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-gray-900">Detail Transaksi</h3>
              <button onClick={() => setShowDetail(null)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className={`rounded-xl p-4 mb-4 ${showDetail.jenis === "masuk" ? "bg-emerald-50" : "bg-red-50"}`}>
              <div className="flex items-center gap-2 mb-1">
                {showDetail.jenis === "masuk"
                  ? <TrendingUp className="w-5 h-5 text-emerald-600" />
                  : <TrendingDown className="w-5 h-5 text-red-500" />
                }
                <span className={`text-sm ${showDetail.jenis === "masuk" ? "text-emerald-700" : "text-red-600"}`}>
                  {showDetail.jenis === "masuk" ? "Pemasukan" : "Pengeluaran"}
                </span>
              </div>
              <p className={`text-2xl ${showDetail.jenis === "masuk" ? "text-emerald-800" : "text-red-700"}`}>
                {formatRupiah(showDetail.jumlah)}
              </p>
            </div>
            <div className="space-y-3">
              {[
                { label: "ID Transaksi", value: showDetail.transaksi_id },
                { label: "Tanggal", value: showDetail.tanggal },
                { label: "Sumber Dana", value: showDetail.sumber_dana },
                { label: "Keterangan", value: showDetail.keterangan },
                { label: "File Bukti", value: showDetail.bukti },
              ].map(item => (
                <div key={item.label} className="flex gap-3">
                  <span className="text-xs text-gray-400 w-28 flex-shrink-0 pt-0.5">{item.label}</span>
                  <span className="text-sm text-gray-800">{item.value}</span>
                </div>
              ))}
            </div>
            <button onClick={() => setShowDetail(null)} className="w-full mt-6 border border-gray-200 text-gray-600 rounded-xl py-2.5 text-sm hover:bg-gray-50">
              Tutup
            </button>
          </div>
        </div>
      )}
    </div>
  );
}