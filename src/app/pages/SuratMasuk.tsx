import { useState } from "react";
import { suratMasuk as initialData } from "../data/mockData";
import { useAuth } from "../context/AuthContext";
import { Plus, Search, Filter, Eye, MailOpen, FileText, X, Archive } from "lucide-react";

type Surat = typeof initialData[0];

const statusColor: Record<string, string> = {
  baru: "bg-blue-100 text-blue-700 border-blue-200",
  diproses: "bg-amber-100 text-amber-700 border-amber-200",
  selesai: "bg-emerald-100 text-emerald-700 border-emerald-200",
};
const statusLabel: Record<string, string> = {
  baru: "Baru",
  diproses: "Diproses",
  selesai: "Selesai",
};

export default function SuratMasuk() {
  const { user } = useAuth();
  const [data, setData] = useState(initialData);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [showDetail, setShowDetail] = useState<Surat | null>(null);
  const [form, setForm] = useState({
    nomor_surat: "",
    asal_surat: "",
    tanggal_surat: new Date().toISOString().split("T")[0],
    perihal: "",
  });

  const filtered = data.filter(s => {
    const matchSearch =
      s.nomor_surat.toLowerCase().includes(search.toLowerCase()) ||
      s.asal_surat.toLowerCase().includes(search.toLowerCase()) ||
      s.perihal.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "all" || s.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const handleCreate = () => {
    if (!form.nomor_surat || !form.asal_surat || !form.perihal) return;
    const newId = `SM${String(data.length + 1).padStart(3, "0")}`;
    const newSurat: Surat = {
      surat_masuk_id: newId,
      nomor_surat: form.nomor_surat,
      asal_surat: form.asal_surat,
      tanggal_surat: form.tanggal_surat,
      perihal: form.perihal,
      file_surat: `sm${newId.toLowerCase()}.pdf`,
      status: "baru",
    };
    setData(prev => [newSurat, ...prev]);
    setShowModal(false);
    setForm({ nomor_surat: "", asal_surat: "", tanggal_surat: new Date().toISOString().split("T")[0], perihal: "" });
  };

  const handleProcess = (id: string) => {
    setData(prev => prev.map(s => s.surat_masuk_id === id ? { ...s, status: "diproses" } : s));
    setShowDetail(null);
  };

  const handleComplete = (id: string) => {
    setData(prev => prev.map(s => s.surat_masuk_id === id ? { ...s, status: "selesai" } : s));
    setShowDetail(null);
  };

  const counts = {
    all: data.length,
    baru: data.filter(s => s.status === "baru").length,
    diproses: data.filter(s => s.status === "diproses").length,
    selesai: data.filter(s => s.status === "selesai").length,
  };

  return (
    <div className="p-4 lg:p-6 space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-gray-900">Surat Masuk</h1>
          <p className="text-gray-500 text-sm mt-0.5">Kelola surat masuk dari instansi luar</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl transition-all shadow-sm text-sm"
        >
          <Plus className="w-4 h-4" />
          Input Surat Masuk
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Total", value: counts.all, color: "text-gray-700", bg: "bg-gray-50", border: "border-gray-200" },
          { label: "Baru", value: counts.baru, color: "text-blue-700", bg: "bg-blue-50", border: "border-blue-200" },
          { label: "Diproses", value: counts.diproses, color: "text-amber-700", bg: "bg-amber-50", border: "border-amber-200" },
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
            placeholder="Cari surat masuk..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            className="pl-9 pr-8 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white appearance-none"
          >
            <option value="all">Semua Status</option>
            <option value="baru">Baru</option>
            <option value="diproses">Diproses</option>
            <option value="selesai">Selesai</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-4 py-3 text-xs text-gray-500 uppercase tracking-wide">Nomor Surat</th>
                <th className="text-left px-4 py-3 text-xs text-gray-500 uppercase tracking-wide">Perihal</th>
                <th className="text-left px-4 py-3 text-xs text-gray-500 uppercase tracking-wide hidden md:table-cell">Asal</th>
                <th className="text-left px-4 py-3 text-xs text-gray-500 uppercase tracking-wide hidden md:table-cell">Tanggal</th>
                <th className="text-left px-4 py-3 text-xs text-gray-500 uppercase tracking-wide">Status</th>
                <th className="text-right px-4 py-3 text-xs text-gray-500 uppercase tracking-wide">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(surat => (
                <tr key={surat.surat_masuk_id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                        <MailOpen className="w-4 h-4 text-blue-500" />
                      </div>
                      <span className="text-sm text-gray-700 font-mono">{surat.nomor_surat}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-800 max-w-[220px] truncate">{surat.perihal}</td>
                  <td className="px-4 py-3 text-sm text-gray-500 hidden md:table-cell">{surat.asal_surat}</td>
                  <td className="px-4 py-3 text-sm text-gray-500 hidden md:table-cell">{surat.tanggal_surat}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2.5 py-1 rounded-full border ${statusColor[surat.status]}`}>
                      {statusLabel[surat.status]}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => setShowDetail(surat)}
                      className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                      title="Detail"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-gray-400">
                    <MailOpen className="w-10 h-10 mx-auto mb-2 opacity-30" />
                    <p className="text-sm">Tidak ada data surat masuk</p>
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
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md flex flex-col max-h-[90vh]">
            {/* Header - sticky */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 flex-shrink-0">
              <h3 className="text-gray-900">Input Surat Masuk</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 transition-all">
                <X className="w-5 h-5" />
              </button>
            </div>
            {/* Scrollable Body */}
            <div className="overflow-y-auto flex-1 px-5 py-4 space-y-4">
              {[
                { label: "Nomor Surat", key: "nomor_surat", type: "text", placeholder: "Contoh: 001/KECAMATAN/2026" },
                { label: "Asal Surat", key: "asal_surat", type: "text", placeholder: "Instansi pengirim" },
                { label: "Tanggal Surat", key: "tanggal_surat", type: "date", placeholder: "" },
                { label: "Perihal", key: "perihal", type: "text", placeholder: "Perihal surat" },
              ].map(field => (
                <div key={field.key}>
                  <label className="block text-sm text-gray-700 mb-1.5">{field.label}</label>
                  <input
                    type={field.type}
                    placeholder={field.placeholder}
                    value={(form as any)[field.key]}
                    onChange={e => setForm(f => ({ ...f, [field.key]: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              ))}
              <div>
                <label className="block text-sm text-gray-700 mb-1.5">Upload File Surat</label>
                <div className="border-2 border-dashed border-gray-200 rounded-xl p-5 text-center text-gray-400 hover:border-blue-300 transition-colors cursor-pointer">
                  <FileText className="w-7 h-7 mx-auto mb-1.5 opacity-50" />
                  <p className="text-xs">Klik untuk upload PDF</p>
                </div>
              </div>
            </div>
            {/* Footer - sticky */}
            <div className="flex gap-3 px-5 py-4 border-t border-gray-100 flex-shrink-0">
              <button onClick={() => setShowModal(false)} className="flex-1 border border-gray-200 text-gray-600 rounded-xl py-2.5 text-sm hover:bg-gray-50">
                Batal
              </button>
              <button onClick={handleCreate} className="flex-1 bg-blue-600 text-white rounded-xl py-2.5 text-sm hover:bg-blue-700">
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {showDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg flex flex-col max-h-[90vh]">
            {/* Header - sticky */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 flex-shrink-0">
              <h3 className="text-gray-900">Detail Surat Masuk</h3>
              <button onClick={() => setShowDetail(null)} className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 transition-all">
                <X className="w-5 h-5" />
              </button>
            </div>
            {/* Scrollable Body */}
            <div className="overflow-y-auto flex-1 px-5 py-4 space-y-3">
              <div className="bg-blue-50 rounded-xl p-3 flex items-start gap-3">
                <MailOpen className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-blue-800">{showDetail.perihal}</p>
                  <p className="text-xs text-blue-600 mt-0.5">dari {showDetail.asal_surat}</p>
                </div>
              </div>
              {[
                { label: "ID", value: showDetail.surat_masuk_id },
                { label: "Nomor Surat", value: showDetail.nomor_surat },
                { label: "Asal Surat", value: showDetail.asal_surat },
                { label: "Tanggal Surat", value: showDetail.tanggal_surat },
                { label: "File", value: showDetail.file_surat },
                { label: "Status", value: statusLabel[showDetail.status] },
              ].map(item => (
                <div key={item.label} className="flex gap-3">
                  <span className="text-xs text-gray-400 w-28 flex-shrink-0 pt-0.5">{item.label}</span>
                  <span className="text-sm text-gray-800">{item.value}</span>
                </div>
              ))}
            </div>
            {/* Footer - sticky */}
            <div className="flex gap-3 px-5 py-4 border-t border-gray-100 flex-shrink-0">
              {showDetail.status === "baru" && (
                <button onClick={() => handleProcess(showDetail.surat_masuk_id)} className="flex-1 bg-amber-500 text-white rounded-xl py-2.5 text-sm hover:bg-amber-600 transition-all">
                  Tandai Diproses
                </button>
              )}
              {showDetail.status === "diproses" && (
                <button onClick={() => handleComplete(showDetail.surat_masuk_id)} className="flex-1 bg-emerald-600 text-white rounded-xl py-2.5 text-sm hover:bg-emerald-700 transition-all flex items-center justify-center gap-2">
                  <Archive className="w-4 h-4" />
                  Arsipkan
                </button>
              )}
              <button onClick={() => setShowDetail(null)} className="flex-1 border border-gray-200 text-gray-600 rounded-xl py-2.5 text-sm hover:bg-gray-50">
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}