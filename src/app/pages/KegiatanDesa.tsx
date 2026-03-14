import { useState } from "react";
import { kegiatan as initialKegiatan } from "../data/mockData";
import { Plus, Search, Eye, Calendar, Clock, Users, MapPin, X, Camera } from "lucide-react";

type Kegiatan = typeof initialKegiatan[0];

export default function KegiatanDesa() {
  const [data, setData] = useState(initialKegiatan);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showDetail, setShowDetail] = useState<Kegiatan | null>(null);
  const [form, setForm] = useState({
    nama_kegiatan: "",
    tanggal: new Date().toISOString().split("T")[0],
    waktu: "08:00",
    pelaksana: "",
    peserta: "",
    catatan: "",
  });

  const filtered = data.filter(k =>
    k.nama_kegiatan.toLowerCase().includes(search.toLowerCase()) ||
    k.pelaksana.toLowerCase().includes(search.toLowerCase())
  );

  const handleCreate = () => {
    if (!form.nama_kegiatan || !form.pelaksana) return;
    const newId = `K${String(data.length + 1).padStart(3, "0")}`;
    const newKegiatan: Kegiatan = {
      kegiatan_id: newId,
      nama_kegiatan: form.nama_kegiatan,
      tanggal: form.tanggal,
      waktu: form.waktu,
      pelaksana: form.pelaksana,
      peserta: form.peserta,
      dokumentasi: null,
      catatan: form.catatan,
    };
    setData(prev => [newKegiatan, ...prev]);
    setShowModal(false);
    setForm({ nama_kegiatan: "", tanggal: new Date().toISOString().split("T")[0], waktu: "08:00", pelaksana: "", peserta: "", catatan: "" });
  };

  const kegiatanColors = [
    "bg-blue-50 border-blue-200",
    "bg-emerald-50 border-emerald-200",
    "bg-purple-50 border-purple-200",
    "bg-amber-50 border-amber-200",
    "bg-rose-50 border-rose-200",
    "bg-cyan-50 border-cyan-200",
  ];

  const iconBgColors = [
    "bg-blue-100 text-blue-600",
    "bg-emerald-100 text-emerald-600",
    "bg-purple-100 text-purple-600",
    "bg-amber-100 text-amber-600",
    "bg-rose-100 text-rose-600",
    "bg-cyan-100 text-cyan-600",
  ];

  const staffOptions = ["Budi Santoso", "Siti Rahayu", "Ahmad Fauzi", "Dewi Lestari", "Rini Wulandari", "Hendra Wijaya"];

  return (
    <div className="p-4 lg:p-6 space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-gray-900">Kegiatan Desa</h1>
          <p className="text-gray-500 text-sm mt-0.5">Pencatatan dan dokumentasi kegiatan desa</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-xl transition-all shadow-sm text-sm"
        >
          <Plus className="w-4 h-4" />
          Catat Kegiatan
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
          <div className="text-2xl text-emerald-700">{data.length}</div>
          <div className="text-xs text-gray-500 mt-0.5">Total Kegiatan</div>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <div className="text-2xl text-blue-700">{data.filter(k => k.tanggal >= "2026-03-01").length}</div>
          <div className="text-xs text-gray-500 mt-0.5">Bulan Ini</div>
        </div>
        <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
          <div className="text-2xl text-purple-700">{data.filter(k => k.dokumentasi).length}</div>
          <div className="text-xs text-gray-500 mt-0.5">Terdokumentasi</div>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Cari kegiatan..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
        />
      </div>

      {/* Kegiatan Cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {filtered.map((k, idx) => (
          <div
            key={k.kegiatan_id}
            className={`rounded-xl border p-4 hover:shadow-md transition-all cursor-pointer ${kegiatanColors[idx % kegiatanColors.length]}`}
            onClick={() => setShowDetail(k)}
          >
            <div className="flex items-start gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${iconBgColors[idx % iconBgColors.length]}`}>
                <Calendar className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm text-gray-900 line-clamp-2 mb-2">{k.nama_kegiatan}</h4>
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-gray-400" />
                    <span className="text-xs text-gray-600">{k.tanggal}</span>
                    <Clock className="w-3.5 h-3.5 text-gray-400 ml-1" />
                    <span className="text-xs text-gray-600">{k.waktu}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-gray-400" />
                    <span className="text-xs text-gray-600">{k.peserta}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-gray-400" />
                    <span className="text-xs text-gray-600">{k.pelaksana}</span>
                  </div>
                </div>
                {k.dokumentasi && (
                  <div className="mt-2 flex items-center gap-1 text-xs text-emerald-600">
                    <Camera className="w-3.5 h-3.5" />
                    <span>Terdokumentasi</span>
                  </div>
                )}
              </div>
            </div>
            {k.catatan && (
              <p className="text-xs text-gray-500 mt-3 pt-3 border-t border-white/50 line-clamp-2">
                {k.catatan}
              </p>
            )}
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="sm:col-span-2 xl:col-span-3 text-center py-16 text-gray-400">
            <Calendar className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>Tidak ada kegiatan ditemukan</p>
          </div>
        )}
      </div>

      {/* Create Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-gray-900">Catat Kegiatan</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-700 mb-1.5">Nama Kegiatan</label>
                <input
                  type="text"
                  placeholder="Nama kegiatan"
                  value={form.nama_kegiatan}
                  onChange={e => setForm(f => ({ ...f, nama_kegiatan: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm text-gray-700 mb-1.5">Tanggal</label>
                  <input type="date" value={form.tanggal} onChange={e => setForm(f => ({ ...f, tanggal: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1.5">Waktu</label>
                  <input type="time" value={form.waktu} onChange={e => setForm(f => ({ ...f, waktu: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1.5">Pelaksana</label>
                <select value={form.pelaksana} onChange={e => setForm(f => ({ ...f, pelaksana: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500">
                  <option value="">Pilih pelaksana...</option>
                  {staffOptions.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1.5">Peserta</label>
                <input type="text" placeholder="Contoh: 50 Warga RW 03" value={form.peserta}
                  onChange={e => setForm(f => ({ ...f, peserta: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1.5">Catatan</label>
                <textarea value={form.catatan} onChange={e => setForm(f => ({ ...f, catatan: e.target.value }))}
                  placeholder="Catatan kegiatan..." rows={3}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none" />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1.5">Upload Dokumentasi</label>
                <div className="border-2 border-dashed border-gray-200 rounded-xl p-5 text-center text-gray-400 hover:border-emerald-300 transition-colors cursor-pointer">
                  <Camera className="w-7 h-7 mx-auto mb-2 opacity-50" />
                  <p className="text-xs">Klik upload foto kegiatan</p>
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
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-gray-900">Detail Kegiatan</h3>
              <button onClick={() => setShowDetail(null)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="bg-emerald-50 rounded-xl p-4 mb-4">
              <h4 className="text-emerald-900 mb-1">{showDetail.nama_kegiatan}</h4>
              <p className="text-xs text-emerald-700">{showDetail.tanggal} · {showDetail.waktu}</p>
            </div>
            <div className="space-y-3">
              {[
                { label: "ID Kegiatan", value: showDetail.kegiatan_id },
                { label: "Pelaksana", value: showDetail.pelaksana },
                { label: "Peserta", value: showDetail.peserta },
                { label: "Dokumentasi", value: showDetail.dokumentasi || "Tidak ada" },
                { label: "Catatan", value: showDetail.catatan },
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
