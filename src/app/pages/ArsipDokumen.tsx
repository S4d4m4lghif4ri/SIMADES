import { useState } from "react";
import { dokumen as initialDokumen } from "../data/mockData";
import { useAuth } from "../context/AuthContext";
import { Plus, Search, Filter, Archive, Download, Eye, X, FileText, FolderOpen } from "lucide-react";

type Dokumen = typeof initialDokumen[0];

const kategoriOptions = ["Perencanaan", "Keuangan", "Peraturan", "Umum", "Kependudukan", "Pertanahan", "Sosial"];

const kategoriColor: Record<string, string> = {
  Perencanaan: "bg-blue-100 text-blue-700",
  Keuangan: "bg-emerald-100 text-emerald-700",
  Peraturan: "bg-purple-100 text-purple-700",
  Umum: "bg-gray-100 text-gray-600",
  Kependudukan: "bg-amber-100 text-amber-700",
  Pertanahan: "bg-orange-100 text-orange-700",
  Sosial: "bg-rose-100 text-rose-700",
};

const getFileIcon = (file: string) => {
  if (file.endsWith(".pdf")) return "PDF";
  if (file.endsWith(".xlsx") || file.endsWith(".xls")) return "XLS";
  if (file.endsWith(".docx") || file.endsWith(".doc")) return "DOC";
  return "FILE";
};

const fileIconColor: Record<string, string> = {
  PDF: "bg-red-50 text-red-600",
  XLS: "bg-emerald-50 text-emerald-700",
  DOC: "bg-blue-50 text-blue-600",
  FILE: "bg-gray-50 text-gray-600",
};

export default function ArsipDokumen() {
  const { user } = useAuth();
  const [data, setData] = useState(initialDokumen);
  const [search, setSearch] = useState("");
  const [filterKategori, setFilterKategori] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [showDetail, setShowDetail] = useState<Dokumen | null>(null);
  const [form, setForm] = useState({
    nama_dokumen: "",
    kategori: "",
    tanggal: new Date().toISOString().split("T")[0],
  });

  const filtered = data.filter(d => {
    const matchSearch =
      d.nama_dokumen.toLowerCase().includes(search.toLowerCase()) ||
      d.uploader.toLowerCase().includes(search.toLowerCase());
    const matchKategori = filterKategori === "all" || d.kategori === filterKategori;
    return matchSearch && matchKategori;
  });

  const handleCreate = () => {
    if (!form.nama_dokumen || !form.kategori) return;
    const newId = `DOK${String(data.length + 1).padStart(3, "0")}`;
    const ext = "pdf";
    const newDoc: Dokumen = {
      dokumen_id: newId,
      nama_dokumen: form.nama_dokumen,
      kategori: form.kategori,
      file: `${form.nama_dokumen.toLowerCase().replace(/\s/g, "_")}.${ext}`,
      tanggal: form.tanggal,
      uploader: user?.nama || "Admin",
    };
    setData(prev => [newDoc, ...prev]);
    setShowModal(false);
    setForm({ nama_dokumen: "", kategori: "", tanggal: new Date().toISOString().split("T")[0] });
  };

  const kategoriCounts = kategoriOptions.reduce((acc, k) => {
    acc[k] = data.filter(d => d.kategori === k).length;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="p-4 lg:p-6 space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-gray-900">Arsip Dokumen</h1>
          <p className="text-gray-500 text-sm mt-0.5">Penyimpanan dan manajemen dokumen desa</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl transition-all shadow-sm text-sm"
        >
          <Plus className="w-4 h-4" />
          Upload Dokumen
        </button>
      </div>

      {/* Category Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4 sm:col-span-2 lg:col-span-1">
          <div className="text-2xl text-indigo-700">{data.length}</div>
          <div className="text-xs text-gray-500 mt-0.5">Total Dokumen</div>
        </div>
        {Object.entries(kategoriCounts).slice(0, 3).map(([k, v]) => (
          <div key={k} className="bg-white border border-gray-200 rounded-xl p-4">
            <div className="text-2xl text-gray-700">{v}</div>
            <div className="text-xs text-gray-500 mt-0.5">{k}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Cari dokumen..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <select
            value={filterKategori}
            onChange={e => setFilterKategori(e.target.value)}
            className="pl-9 pr-8 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white appearance-none"
          >
            <option value="all">Semua Kategori</option>
            {kategoriOptions.map(k => <option key={k} value={k}>{k}</option>)}
          </select>
        </div>
      </div>

      {/* Folder View */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex items-center gap-2">
          <FolderOpen className="w-5 h-5 text-indigo-500" />
          <span className="text-sm text-gray-700">Menampilkan {filtered.length} dokumen</span>
        </div>
        <div className="divide-y divide-gray-50">
          {filtered.map(doc => {
            const fileType = getFileIcon(doc.file);
            return (
              <div
                key={doc.dokumen_id}
                className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                onClick={() => setShowDetail(doc)}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${fileIconColor[fileType]}`}>
                  <span className="text-xs">{fileType}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-800 truncate">{doc.nama_dokumen}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{doc.tanggal} · {doc.uploader}</p>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 hidden sm:inline-flex ${kategoriColor[doc.kategori] || "bg-gray-100 text-gray-600"}`}>
                  {doc.kategori}
                </span>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={e => { e.stopPropagation(); setShowDetail(doc); }}
                    className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={e => e.stopPropagation()}
                    className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
          {filtered.length === 0 && (
            <div className="text-center py-16 text-gray-400">
              <Archive className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="text-sm">Tidak ada dokumen ditemukan</p>
            </div>
          )}
        </div>
      </div>

      {/* Upload Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-gray-900">Upload Dokumen</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-700 mb-1.5">Nama Dokumen</label>
                <input type="text" placeholder="Nama dokumen" value={form.nama_dokumen}
                  onChange={e => setForm(f => ({ ...f, nama_dokumen: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1.5">Kategori</label>
                <select value={form.kategori} onChange={e => setForm(f => ({ ...f, kategori: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                  <option value="">Pilih kategori...</option>
                  {kategoriOptions.map(k => <option key={k} value={k}>{k}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1.5">Tanggal</label>
                <input type="date" value={form.tanggal} onChange={e => setForm(f => ({ ...f, tanggal: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1.5">File Dokumen</label>
                <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center text-gray-400 hover:border-indigo-300 transition-colors cursor-pointer">
                  <FileText className="w-10 h-10 mx-auto mb-3 opacity-40" />
                  <p className="text-sm">Klik untuk upload atau drag & drop</p>
                  <p className="text-xs mt-1">PDF, DOC, XLS (Max 20MB)</p>
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowModal(false)} className="flex-1 border border-gray-200 text-gray-600 rounded-xl py-2.5 text-sm hover:bg-gray-50">
                Batal
              </button>
              <button onClick={handleCreate} className="flex-1 bg-indigo-600 text-white rounded-xl py-2.5 text-sm hover:bg-indigo-700">
                Upload
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
              <h3 className="text-gray-900">Detail Dokumen</h3>
              <button onClick={() => setShowDetail(null)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="bg-indigo-50 rounded-xl p-4 mb-4 flex items-center gap-3">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${fileIconColor[getFileIcon(showDetail.file)]}`}>
                <span className="text-sm">{getFileIcon(showDetail.file)}</span>
              </div>
              <div>
                <p className="text-sm text-gray-800">{showDetail.nama_dokumen}</p>
                <p className="text-xs text-gray-500 mt-0.5">{showDetail.file}</p>
              </div>
            </div>
            <div className="space-y-3">
              {[
                { label: "ID", value: showDetail.dokumen_id },
                { label: "Kategori", value: showDetail.kategori },
                { label: "Tanggal Upload", value: showDetail.tanggal },
                { label: "Diupload Oleh", value: showDetail.uploader },
              ].map(item => (
                <div key={item.label} className="flex gap-3">
                  <span className="text-xs text-gray-400 w-28 flex-shrink-0 pt-0.5">{item.label}</span>
                  <span className="text-sm text-gray-800">{item.value}</span>
                </div>
              ))}
            </div>
            <div className="flex gap-3 mt-6">
              <button className="flex-1 bg-indigo-600 text-white rounded-xl py-2.5 text-sm hover:bg-indigo-700 flex items-center justify-center gap-2">
                <Download className="w-4 h-4" />
                Unduh
              </button>
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
