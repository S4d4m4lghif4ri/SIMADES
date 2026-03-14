import { useState } from "react";
import { tugas as initialTugas } from "../data/mockData";
import { useAuth } from "../context/AuthContext";
import { Plus, Search, Eye, ClipboardList, X, CheckCircle, Clock, Circle, Calendar, User, AlertTriangle } from "lucide-react";

type Tugas = typeof initialTugas[0];

const statusConfig: Record<string, { label: string; color: string; icon: any }> = {
  belum_mulai: { label: "Belum Mulai", color: "bg-gray-100 text-gray-600 border-gray-200", icon: Circle },
  proses: { label: "Sedang Proses", color: "bg-blue-100 text-blue-700 border-blue-200", icon: Clock },
  selesai: { label: "Selesai", color: "bg-emerald-100 text-emerald-700 border-emerald-200", icon: CheckCircle },
};

const staffOptions = [
  "Ahmad Fauzi",
  "Dewi Lestari",
  "Rini Wulandari",
  "Hendra Wijaya",
  "Siti Rahayu",
];

export default function ManajemenTugas() {
  const { user } = useAuth();
  const [data, setData] = useState(initialTugas);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [showDetail, setShowDetail] = useState<Tugas | null>(null);
  const [form, setForm] = useState({
    nama_tugas: "",
    deskripsi: "",
    penerima_tugas: "",
    tanggal_mulai: new Date().toISOString().split("T")[0],
    deadline: "",
  });

  const canCreate = user?.role === "KEPALA_DESA" || user?.role === "SEKDES";

  const filtered = data.filter(t => {
    const matchSearch =
      t.nama_tugas.toLowerCase().includes(search.toLowerCase()) ||
      t.penerima_tugas.toLowerCase().includes(search.toLowerCase()) ||
      t.pemberi_tugas.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "all" || t.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const handleCreate = () => {
    if (!form.nama_tugas || !form.penerima_tugas || !form.deadline) return;
    const newId = `T${String(data.length + 1).padStart(3, "0")}`;
    const newTugas: Tugas = {
      tugas_id: newId,
      nama_tugas: form.nama_tugas,
      deskripsi: form.deskripsi,
      pemberi_tugas: user?.nama || "Kepala Desa",
      penerima_tugas: form.penerima_tugas,
      tanggal_mulai: form.tanggal_mulai,
      deadline: form.deadline,
      file_referensi: null,
      status: "belum_mulai",
    };
    setData(prev => [newTugas, ...prev]);
    setShowModal(false);
    setForm({ nama_tugas: "", deskripsi: "", penerima_tugas: "", tanggal_mulai: new Date().toISOString().split("T")[0], deadline: "" });
  };

  const handleUpdateStatus = (id: string, status: string) => {
    setData(prev => prev.map(t => t.tugas_id === id ? { ...t, status } : t));
    if (showDetail?.tugas_id === id) {
      setShowDetail(prev => prev ? { ...prev, status } : null);
    }
  };

  const isOverdue = (deadline: string) => new Date(deadline) < new Date(new Date().toDateString());

  const counts = {
    all: data.length,
    belum_mulai: data.filter(t => t.status === "belum_mulai").length,
    proses: data.filter(t => t.status === "proses").length,
    selesai: data.filter(t => t.status === "selesai").length,
  };

  return (
    <div className="p-4 lg:p-6 space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-gray-900">Manajemen Tugas</h1>
          <p className="text-gray-500 text-sm mt-0.5">Kelola dan pantau penyelesaian tugas perangkat desa</p>
        </div>
        {canCreate && (
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl transition-all shadow-sm text-sm"
          >
            <Plus className="w-4 h-4" />
            Beri Tugas
          </button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Total Tugas", value: counts.all, color: "text-gray-700", bg: "bg-gray-50", border: "border-gray-200" },
          { label: "Belum Mulai", value: counts.belum_mulai, color: "text-gray-600", bg: "bg-gray-50", border: "border-gray-200" },
          { label: "Sedang Proses", value: counts.proses, color: "text-blue-700", bg: "bg-blue-50", border: "border-blue-200" },
          { label: "Selesai", value: counts.selesai, color: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-200" },
        ].map(s => (
          <div key={s.label} className={`${s.bg} border ${s.border} rounded-xl p-4`}>
            <div className={`text-2xl ${s.color}`}>{s.value}</div>
            <div className="text-xs text-gray-500 mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Cari tugas..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {["all", "belum_mulai", "proses", "selesai"].map(s => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`px-3 py-2 rounded-xl text-xs transition-all ${
                filterStatus === s
                  ? "bg-blue-600 text-white"
                  : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}
            >
              {s === "all" ? "Semua" : statusConfig[s]?.label}
            </button>
          ))}
        </div>
      </div>

      {/* Task Cards */}
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {filtered.map(task => {
          const statusInfo = statusConfig[task.status];
          const StatusIcon = statusInfo.icon;
          const overdue = task.status !== "selesai" && isOverdue(task.deadline);
          return (
            <div
              key={task.tugas_id}
              className={`bg-white rounded-xl border shadow-sm p-4 hover:shadow-md transition-all cursor-pointer ${
                overdue ? "border-red-200" : "border-gray-200"
              }`}
              onClick={() => setShowDetail(task)}
            >
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400 font-mono">{task.tugas_id}</span>
                  {overdue && <AlertTriangle className="w-3.5 h-3.5 text-red-500" />}
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full border flex items-center gap-1 ${statusInfo.color}`}>
                  <StatusIcon className="w-3 h-3" />
                  {statusInfo.label}
                </span>
              </div>
              <h4 className="text-sm text-gray-900 mb-1 line-clamp-2">{task.nama_tugas}</h4>
              <p className="text-xs text-gray-400 line-clamp-2 mb-3">{task.deskripsi}</p>
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <User className="w-3.5 h-3.5 text-gray-400" />
                  <span className="text-xs text-gray-600">{task.penerima_tugas}</span>
                </div>
                <div className={`flex items-center gap-2 ${overdue ? "text-red-500" : ""}`}>
                  <Calendar className="w-3.5 h-3.5 text-gray-400" />
                  <span className="text-xs text-gray-600">Deadline: {task.deadline}</span>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-gray-50 flex items-center justify-between">
                <span className="text-xs text-gray-400">Dari: {task.pemberi_tugas}</span>
              </div>
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div className="sm:col-span-2 xl:col-span-3 text-center py-16 text-gray-400">
            <ClipboardList className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>Tidak ada tugas ditemukan</p>
          </div>
        )}
      </div>

      {/* Create Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-gray-900">Beri Tugas Baru</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-700 mb-1.5">Nama Tugas</label>
                <input
                  type="text"
                  placeholder="Judul tugas"
                  value={form.nama_tugas}
                  onChange={e => setForm(f => ({ ...f, nama_tugas: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1.5">Deskripsi</label>
                <textarea
                  placeholder="Deskripsi tugas..."
                  value={form.deskripsi}
                  onChange={e => setForm(f => ({ ...f, deskripsi: e.target.value }))}
                  rows={3}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1.5">Penerima Tugas</label>
                <select
                  value={form.penerima_tugas}
                  onChange={e => setForm(f => ({ ...f, penerima_tugas: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Pilih penerima...</option>
                  {staffOptions.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm text-gray-700 mb-1.5">Tanggal Mulai</label>
                  <input
                    type="date"
                    value={form.tanggal_mulai}
                    onChange={e => setForm(f => ({ ...f, tanggal_mulai: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1.5">Deadline</label>
                  <input
                    type="date"
                    value={form.deadline}
                    onChange={e => setForm(f => ({ ...f, deadline: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowModal(false)} className="flex-1 border border-gray-200 text-gray-600 rounded-xl py-2.5 text-sm hover:bg-gray-50">
                Batal
              </button>
              <button onClick={handleCreate} className="flex-1 bg-blue-600 text-white rounded-xl py-2.5 text-sm hover:bg-blue-700">
                Beri Tugas
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {showDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-gray-900">Detail Tugas</h3>
              <button onClick={() => setShowDetail(null)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="bg-blue-50 rounded-xl p-4 mb-4">
              <div className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border mb-2 ${statusConfig[showDetail.status].color}`}>
                {statusConfig[showDetail.status].label}
              </div>
              <h4 className="text-gray-900 mb-1">{showDetail.nama_tugas}</h4>
              <p className="text-xs text-gray-500">{showDetail.deskripsi}</p>
            </div>
            <div className="space-y-3">
              {[
                { label: "ID Tugas", value: showDetail.tugas_id },
                { label: "Pemberi Tugas", value: showDetail.pemberi_tugas },
                { label: "Penerima Tugas", value: showDetail.penerima_tugas },
                { label: "Tanggal Mulai", value: showDetail.tanggal_mulai },
                { label: "Deadline", value: showDetail.deadline },
                { label: "File Referensi", value: showDetail.file_referensi || "—" },
              ].map(item => (
                <div key={item.label} className="flex gap-3">
                  <span className="text-xs text-gray-400 w-32 flex-shrink-0 pt-0.5">{item.label}</span>
                  <span className="text-sm text-gray-800">{item.value}</span>
                </div>
              ))}
            </div>

            {/* Status Update */}
            <div className="mt-4 pt-4 border-t border-gray-100">
              <p className="text-xs text-gray-400 mb-2">Update Status</p>
              <div className="flex gap-2">
                {["belum_mulai", "proses", "selesai"].map(s => (
                  <button
                    key={s}
                    onClick={() => handleUpdateStatus(showDetail.tugas_id, s)}
                    className={`flex-1 text-xs py-2 rounded-lg transition-all ${
                      showDetail.status === s
                        ? "bg-blue-600 text-white"
                        : "bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200"
                    }`}
                  >
                    {statusConfig[s].label}
                  </button>
                ))}
              </div>
            </div>
            <button onClick={() => setShowDetail(null)} className="w-full mt-4 border border-gray-200 text-gray-600 rounded-xl py-2.5 text-sm hover:bg-gray-50">
              Tutup
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
