import { useState } from "react";
import { suratKeluar as initialData } from "../data/mockData";
import { useAuth } from "../context/AuthContext";
import {
  Plus, Search, Filter, Eye, CheckCircle, XCircle, Clock,
  FileText, Download, Stamp, ChevronDown, X
} from "lucide-react";

type Surat = typeof initialData[0];

const statusColor: Record<string, string> = {
  pending: "bg-amber-100 text-amber-700 border-amber-200",
  approved: "bg-emerald-100 text-emerald-700 border-emerald-200",
  rejected: "bg-red-100 text-red-700 border-red-200",
};
const statusLabel: Record<string, string> = {
  pending: "Pending",
  approved: "Disetujui",
  rejected: "Ditolak",
};

const jenisSuratOptions = [
  "Surat Keterangan Domisili",
  "Surat Pengantar SKCK",
  "Surat Keterangan Tidak Mampu",
  "Surat Keterangan Usaha",
  "Surat Rekomendasi",
  "Surat Pernyataan",
  "Surat Keterangan Pindah",
];

export default function SuratKeluar() {
  const { user } = useAuth();
  const [data, setData] = useState(initialData);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [showDetail, setShowDetail] = useState<Surat | null>(null);
  const [form, setForm] = useState({
    jenis_surat: "",
    tanggal: new Date().toISOString().split("T")[0],
  });

  const filtered = data.filter(s => {
    const matchSearch =
      s.nomor_surat.toLowerCase().includes(search.toLowerCase()) ||
      s.jenis_surat.toLowerCase().includes(search.toLowerCase()) ||
      s.pembuat.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "all" || s.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const handleApprove = (id: string) => {
    setData(prev =>
      prev.map(s =>
        s.surat_id === id
          ? { ...s, status: "approved", ttd_kades: true, tanggal_approve: new Date().toISOString().split("T")[0] }
          : s
      )
    );
    setShowDetail(null);
  };

  const handleReject = (id: string) => {
    setData(prev =>
      prev.map(s => s.surat_id === id ? { ...s, status: "rejected" } : s)
    );
    setShowDetail(null);
  };

  const handleCreate = () => {
    if (!form.jenis_surat) return;
    const newId = `SK${String(data.length + 1).padStart(3, "0")}`;
    const month = new Date().toLocaleString("id-ID", { month: "long", year: "numeric" });
    const newSurat: Surat = {
      surat_id: newId,
      nomor_surat: `${String(data.length + 1).padStart(3, "0")}/SK/2026/${new Date().getMonth() + 1}`,
      jenis_surat: form.jenis_surat,
      tanggal: form.tanggal,
      pembuat: user?.nama || "Admin",
      file_draft: `draft_${newId.toLowerCase()}.pdf`,
      status: "pending",
      ttd_kades: false,
      tanggal_approve: null,
    };
    setData(prev => [newSurat, ...prev]);
    setShowModal(false);
    setForm({ jenis_surat: "", tanggal: new Date().toISOString().split("T")[0] });
  };

  const canApprove = user?.role === "KEPALA_DESA";

  const counts = {
    all: data.length,
    pending: data.filter(s => s.status === "pending").length,
    approved: data.filter(s => s.status === "approved").length,
    rejected: data.filter(s => s.status === "rejected").length,
  };

  return (
    <div className="p-4 lg:p-6 space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-gray-900">Surat Keluar</h1>
          <p className="text-gray-500 text-sm mt-0.5">Kelola surat keluar desa dan proses persetujuan</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-xl transition-all shadow-sm text-sm"
        >
          <Plus className="w-4 h-4" />
          Buat Surat Baru
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Total", value: counts.all, color: "text-gray-700", bg: "bg-gray-50", border: "border-gray-200" },
          { label: "Pending", value: counts.pending, color: "text-amber-700", bg: "bg-amber-50", border: "border-amber-200" },
          { label: "Disetujui", value: counts.approved, color: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-200" },
          { label: "Ditolak", value: counts.rejected, color: "text-red-700", bg: "bg-red-50", border: "border-red-200" },
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
            placeholder="Cari surat..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            className="pl-9 pr-8 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white appearance-none"
          >
            <option value="all">Semua Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Disetujui</option>
            <option value="rejected">Ditolak</option>
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
                <th className="text-left px-4 py-3 text-xs text-gray-500 uppercase tracking-wide">Jenis Surat</th>
                <th className="text-left px-4 py-3 text-xs text-gray-500 uppercase tracking-wide hidden md:table-cell">Tanggal</th>
                <th className="text-left px-4 py-3 text-xs text-gray-500 uppercase tracking-wide hidden md:table-cell">Pembuat</th>
                <th className="text-left px-4 py-3 text-xs text-gray-500 uppercase tracking-wide">Status</th>
                <th className="text-left px-4 py-3 text-xs text-gray-500 uppercase tracking-wide hidden sm:table-cell">TTD</th>
                <th className="text-right px-4 py-3 text-xs text-gray-500 uppercase tracking-wide">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(surat => (
                <tr key={surat.surat_id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center flex-shrink-0">
                        <FileText className="w-4 h-4 text-emerald-600" />
                      </div>
                      <span className="text-sm text-gray-800 font-mono">{surat.nomor_surat}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700 max-w-[200px] truncate">{surat.jenis_surat}</td>
                  <td className="px-4 py-3 text-sm text-gray-500 hidden md:table-cell">{surat.tanggal}</td>
                  <td className="px-4 py-3 text-sm text-gray-500 hidden md:table-cell">{surat.pembuat}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2.5 py-1 rounded-full border ${statusColor[surat.status]}`}>
                      {statusLabel[surat.status]}
                    </span>
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    {surat.ttd_kades ? (
                      <div className="flex items-center gap-1 text-emerald-600">
                        <Stamp className="w-4 h-4" />
                        <span className="text-xs">Ditandatangani</span>
                      </div>
                    ) : (
                      <span className="text-xs text-gray-400">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setShowDetail(surat)}
                        className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-all"
                        title="Detail"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      {canApprove && surat.status === "pending" && (
                        <>
                          <button
                            onClick={() => handleApprove(surat.surat_id)}
                            className="p-1.5 text-emerald-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-all"
                            title="Setujui"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleReject(surat.surat_id)}
                            className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                            title="Tolak"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        </>
                      )}
                      <button className="p-1.5 text-blue-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all" title="Unduh">
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-gray-400">
                    <FileText className="w-10 h-10 mx-auto mb-2 opacity-30" />
                    <p className="text-sm">Tidak ada data surat keluar</p>
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
              <h3 className="text-gray-900">Buat Surat Baru</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 transition-all">
                <X className="w-5 h-5" />
              </button>
            </div>
            {/* Scrollable Body */}
            <div className="overflow-y-auto flex-1 px-5 py-4 space-y-4">
              <div>
                <label className="block text-sm text-gray-700 mb-1.5">Jenis Surat</label>
                <select
                  value={form.jenis_surat}
                  onChange={e => setForm(f => ({ ...f, jenis_surat: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="">Pilih jenis surat...</option>
                  {jenisSuratOptions.map(j => <option key={j} value={j}>{j}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1.5">Tanggal</label>
                <input
                  type="date"
                  value={form.tanggal}
                  onChange={e => setForm(f => ({ ...f, tanggal: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1.5">Upload Draft</label>
                <div className="border-2 border-dashed border-gray-200 rounded-xl p-5 text-center text-gray-400 hover:border-emerald-300 transition-colors cursor-pointer">
                  <FileText className="w-7 h-7 mx-auto mb-1.5 opacity-50" />
                  <p className="text-xs">Klik untuk upload atau drag & drop</p>
                  <p className="text-xs mt-0.5 text-gray-300">PDF, DOC, DOCX (Max 10MB)</p>
                </div>
              </div>
            </div>
            {/* Footer - sticky */}
            <div className="flex gap-3 px-5 py-4 border-t border-gray-100 flex-shrink-0">
              <button onClick={() => setShowModal(false)} className="flex-1 border border-gray-200 text-gray-600 rounded-xl py-2.5 text-sm hover:bg-gray-50 transition-all">
                Batal
              </button>
              <button onClick={handleCreate} className="flex-1 bg-emerald-600 text-white rounded-xl py-2.5 text-sm hover:bg-emerald-700 transition-all">
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
              <h3 className="text-gray-900">Detail Surat Keluar</h3>
              <button onClick={() => setShowDetail(null)} className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 transition-all">
                <X className="w-5 h-5" />
              </button>
            </div>
            {/* Scrollable Body */}
            <div className="overflow-y-auto flex-1 px-5 py-4 space-y-3">
              {[
                { label: "ID Surat", value: showDetail.surat_id },
                { label: "Nomor Surat", value: showDetail.nomor_surat },
                { label: "Jenis Surat", value: showDetail.jenis_surat },
                { label: "Tanggal", value: showDetail.tanggal },
                { label: "Pembuat", value: showDetail.pembuat },
                { label: "File Draft", value: showDetail.file_draft },
                { label: "Status", value: statusLabel[showDetail.status] },
                { label: "TTD Kepala Desa", value: showDetail.ttd_kades ? "Sudah ditandatangani" : "Belum ditandatangani" },
                { label: "Tanggal Approve", value: showDetail.tanggal_approve || "—" },
              ].map(item => (
                <div key={item.label} className="flex gap-3">
                  <span className="text-xs text-gray-400 w-36 flex-shrink-0 pt-0.5">{item.label}</span>
                  <span className="text-sm text-gray-800">{item.value}</span>
                </div>
              ))}
            </div>
            {/* Footer - sticky */}
            <div className="flex gap-3 px-5 py-4 border-t border-gray-100 flex-shrink-0">
              {canApprove && showDetail.status === "pending" && (
                <>
                  <button
                    onClick={() => handleApprove(showDetail.surat_id)}
                    className="flex-1 bg-emerald-600 text-white rounded-xl py-2.5 text-sm hover:bg-emerald-700 transition-all flex items-center justify-center gap-2"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Setujui & TTD
                  </button>
                  <button
                    onClick={() => handleReject(showDetail.surat_id)}
                    className="flex-1 bg-red-50 text-red-600 border border-red-200 rounded-xl py-2.5 text-sm hover:bg-red-100 transition-all flex items-center justify-center gap-2"
                  >
                    <XCircle className="w-4 h-4" />
                    Tolak
                  </button>
                </>
              )}
              {showDetail.status !== "pending" && (
                <button onClick={() => setShowDetail(null)} className="w-full border border-gray-200 text-gray-600 rounded-xl py-2.5 text-sm hover:bg-gray-50 transition-all">
                  Tutup
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}