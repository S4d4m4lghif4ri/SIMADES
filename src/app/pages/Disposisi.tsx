import { useState } from "react";
import { disposisi as initialDisposisi, suratMasuk } from "../data/mockData";
import { useAuth } from "../context/AuthContext";
import { Plus, Eye, GitBranch, X, ArrowRight, CheckCircle, Clock } from "lucide-react";

type Disposisi = typeof initialDisposisi[0];

const statusColor: Record<string, string> = {
  diproses: "bg-amber-100 text-amber-700 border-amber-200",
  selesai: "bg-emerald-100 text-emerald-700 border-emerald-200",
};

const staffOptions = [
  "Siti Rahayu",
  "Ahmad Fauzi",
  "Dewi Lestari",
  "Rini Wulandari",
  "Hendra Wijaya",
];

export default function Disposisi() {
  const { user } = useAuth();
  const [data, setData] = useState(initialDisposisi);
  const [showModal, setShowModal] = useState(false);
  const [showDetail, setShowDetail] = useState<Disposisi | null>(null);
  const [form, setForm] = useState({
    surat_masuk_id: "",
    kepada: "",
    instruksi: "",
    tanggal: new Date().toISOString().split("T")[0],
  });

  const canCreate = user?.role === "KEPALA_DESA" || user?.role === "SEKDES";

  const getSuratInfo = (id: string) => suratMasuk.find(s => s.surat_masuk_id === id);

  const handleCreate = () => {
    if (!form.surat_masuk_id || !form.kepada || !form.instruksi) return;
    const newId = `D${String(data.length + 1).padStart(3, "0")}`;
    const newDisposisi: Disposisi = {
      disposisi_id: newId,
      surat_masuk_id: form.surat_masuk_id,
      dari: user?.nama || "Kepala Desa",
      kepada: form.kepada,
      instruksi: form.instruksi,
      tanggal: form.tanggal,
      status: "diproses",
    };
    setData(prev => [newDisposisi, ...prev]);
    setShowModal(false);
    setForm({ surat_masuk_id: "", kepada: "", instruksi: "", tanggal: new Date().toISOString().split("T")[0] });
  };

  const handleComplete = (id: string) => {
    setData(prev => prev.map(d => d.disposisi_id === id ? { ...d, status: "selesai" } : d));
    setShowDetail(null);
  };

  return (
    <div className="p-4 lg:p-6 space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-gray-900">Disposisi</h1>
          <p className="text-gray-500 text-sm mt-0.5">Penugasan dan instruksi surat masuk</p>
        </div>
        {canCreate && (
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2.5 rounded-xl transition-all shadow-sm text-sm"
          >
            <Plus className="w-4 h-4" />
            Buat Disposisi
          </button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Total Disposisi", value: data.length, color: "text-gray-700", bg: "bg-gray-50", border: "border-gray-200" },
          { label: "Diproses", value: data.filter(d => d.status === "diproses").length, color: "text-amber-700", bg: "bg-amber-50", border: "border-amber-200" },
          { label: "Selesai", value: data.filter(d => d.status === "selesai").length, color: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-200" },
        ].map(s => (
          <div key={s.label} className={`${s.bg} border ${s.border} rounded-xl p-4`}>
            <div className={`text-2xl ${s.color}`}>{s.value}</div>
            <div className="text-xs text-gray-500 mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Disposisi Cards */}
      <div className="space-y-3">
        {data.map(d => {
          const suratInfo = getSuratInfo(d.surat_masuk_id);
          return (
            <div key={d.disposisi_id} className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 hover:shadow-md transition-all">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center flex-shrink-0">
                    <GitBranch className="w-5 h-5 text-purple-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="text-sm text-gray-500 font-mono">{d.disposisi_id}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full border ${statusColor[d.status]}`}>
                        {d.status === "diproses" ? "Diproses" : "Selesai"}
                      </span>
                    </div>
                    {suratInfo && (
                      <p className="text-sm text-gray-800 truncate">{suratInfo.perihal}</p>
                    )}
                    <p className="text-xs text-gray-400 mt-0.5">Surat: {d.surat_masuk_id} · {d.tanggal}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs bg-purple-50 text-purple-700 px-2 py-1 rounded-lg">{d.dari}</span>
                      <ArrowRight className="w-3 h-3 text-gray-400" />
                      <span className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-lg">{d.kepada}</span>
                    </div>
                    <p className="text-xs text-gray-600 mt-2 bg-gray-50 rounded-lg px-3 py-2 italic">
                      "{d.instruksi}"
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowDetail(d)}
                  className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-all flex-shrink-0"
                >
                  <Eye className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}

        {data.length === 0 && (
          <div className="text-center py-16 text-gray-400">
            <GitBranch className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>Belum ada disposisi</p>
          </div>
        )}
      </div>

      {/* Create Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-gray-900">Buat Disposisi</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-700 mb-1.5">Surat Masuk</label>
                <select
                  value={form.surat_masuk_id}
                  onChange={e => setForm(f => ({ ...f, surat_masuk_id: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">Pilih surat masuk...</option>
                  {suratMasuk.filter(s => s.status !== "selesai").map(s => (
                    <option key={s.surat_masuk_id} value={s.surat_masuk_id}>
                      {s.surat_masuk_id} - {s.perihal}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1.5">Ditujukan Kepada</label>
                <select
                  value={form.kepada}
                  onChange={e => setForm(f => ({ ...f, kepada: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">Pilih penerima...</option>
                  {staffOptions.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1.5">Instruksi</label>
                <textarea
                  value={form.instruksi}
                  onChange={e => setForm(f => ({ ...f, instruksi: e.target.value }))}
                  placeholder="Tuliskan instruksi disposisi..."
                  rows={3}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1.5">Tanggal</label>
                <input
                  type="date"
                  value={form.tanggal}
                  onChange={e => setForm(f => ({ ...f, tanggal: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowModal(false)} className="flex-1 border border-gray-200 text-gray-600 rounded-xl py-2.5 text-sm hover:bg-gray-50">
                Batal
              </button>
              <button onClick={handleCreate} className="flex-1 bg-purple-600 text-white rounded-xl py-2.5 text-sm hover:bg-purple-700">
                Buat Disposisi
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
              <h3 className="text-gray-900">Detail Disposisi</h3>
              <button onClick={() => setShowDetail(null)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="bg-purple-50 rounded-xl p-4 mb-4">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-purple-800">{showDetail.dari}</span>
                  <ArrowRight className="w-4 h-4 text-purple-500" />
                  <span className="text-sm text-purple-800">{showDetail.kepada}</span>
                </div>
              </div>
              <p className="text-xs text-purple-600 mt-2 italic">"{showDetail.instruksi}"</p>
            </div>
            <div className="space-y-3">
              {[
                { label: "ID Disposisi", value: showDetail.disposisi_id },
                { label: "Surat Masuk", value: showDetail.surat_masuk_id },
                { label: "Tanggal", value: showDetail.tanggal },
                { label: "Status", value: showDetail.status === "diproses" ? "Diproses" : "Selesai" },
              ].map(item => (
                <div key={item.label} className="flex gap-3">
                  <span className="text-xs text-gray-400 w-28 flex-shrink-0 pt-0.5">{item.label}</span>
                  <span className="text-sm text-gray-800">{item.value}</span>
                </div>
              ))}
            </div>
            <div className="flex gap-3 mt-6">
              {showDetail.status === "diproses" && (
                <button
                  onClick={() => handleComplete(showDetail.disposisi_id)}
                  className="flex-1 bg-emerald-600 text-white rounded-xl py-2.5 text-sm hover:bg-emerald-700 flex items-center justify-center gap-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  Tandai Selesai
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
