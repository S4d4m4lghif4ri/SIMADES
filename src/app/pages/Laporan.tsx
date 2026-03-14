import { useState } from "react";
import { suratKeluar, suratMasuk, tugas, kegiatan, keuangan } from "../data/mockData";
import { BarChart3, FileDown, FileSpreadsheet, Calendar, Filter, CheckCircle, Mail, MailOpen, ClipboardList, Wallet } from "lucide-react";

type ReportType = "surat-keluar" | "surat-masuk" | "tugas" | "kegiatan" | "keuangan";

const formatRupiah = (v: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(v);

const reportTypes = [
  { id: "surat-keluar" as ReportType, label: "Surat Keluar", icon: Mail, color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-200", count: suratKeluar.length },
  { id: "surat-masuk" as ReportType, label: "Surat Masuk", icon: MailOpen, color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-200", count: suratMasuk.length },
  { id: "tugas" as ReportType, label: "Tugas", icon: ClipboardList, color: "text-purple-600", bg: "bg-purple-50", border: "border-purple-200", count: tugas.length },
  { id: "kegiatan" as ReportType, label: "Kegiatan Desa", icon: Calendar, color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-200", count: kegiatan.length },
  { id: "keuangan" as ReportType, label: "Keuangan", icon: Wallet, color: "text-rose-600", bg: "bg-rose-50", border: "border-rose-200", count: keuangan.length },
];

export default function Laporan() {
  const [activeReport, setActiveReport] = useState<ReportType>("surat-keluar");
  const [filterFrom, setFilterFrom] = useState("2026-01-01");
  const [filterTo, setFilterTo] = useState(new Date().toISOString().split("T")[0]);
  const [exporting, setExporting] = useState(false);

  const handleExport = (format: "PDF" | "Excel") => {
    setExporting(true);
    setTimeout(() => setExporting(false), 1500);
  };

  const renderReportTable = () => {
    switch (activeReport) {
      case "surat-keluar":
        return (
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                {["No", "Nomor Surat", "Jenis Surat", "Tanggal", "Pembuat", "Status"].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs text-gray-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {suratKeluar.filter(s => s.tanggal >= filterFrom && s.tanggal <= filterTo).map((s, i) => (
                <tr key={s.surat_id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-500">{i + 1}</td>
                  <td className="px-4 py-3 font-mono text-gray-700">{s.nomor_surat}</td>
                  <td className="px-4 py-3 text-gray-800">{s.jenis_surat}</td>
                  <td className="px-4 py-3 text-gray-500">{s.tanggal}</td>
                  <td className="px-4 py-3 text-gray-600">{s.pembuat}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      s.status === "approved" ? "bg-emerald-100 text-emerald-700" :
                      s.status === "pending" ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-700"
                    }`}>{s.status === "approved" ? "Disetujui" : s.status === "pending" ? "Pending" : "Ditolak"}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        );
      case "surat-masuk":
        return (
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                {["No", "Nomor Surat", "Asal", "Perihal", "Tanggal", "Status"].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs text-gray-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {suratMasuk.filter(s => s.tanggal_surat >= filterFrom && s.tanggal_surat <= filterTo).map((s, i) => (
                <tr key={s.surat_masuk_id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-500">{i + 1}</td>
                  <td className="px-4 py-3 font-mono text-gray-700">{s.nomor_surat}</td>
                  <td className="px-4 py-3 text-gray-600">{s.asal_surat}</td>
                  <td className="px-4 py-3 text-gray-800 max-w-[200px] truncate">{s.perihal}</td>
                  <td className="px-4 py-3 text-gray-500">{s.tanggal_surat}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      s.status === "selesai" ? "bg-emerald-100 text-emerald-700" :
                      s.status === "baru" ? "bg-blue-100 text-blue-700" : "bg-amber-100 text-amber-700"
                    }`}>{s.status === "selesai" ? "Selesai" : s.status === "baru" ? "Baru" : "Diproses"}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        );
      case "tugas":
        return (
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                {["No", "Nama Tugas", "Pemberi", "Penerima", "Deadline", "Status"].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs text-gray-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {tugas.filter(t => t.tanggal_mulai >= filterFrom && t.tanggal_mulai <= filterTo).map((t, i) => (
                <tr key={t.tugas_id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-500">{i + 1}</td>
                  <td className="px-4 py-3 text-gray-800 max-w-[180px] truncate">{t.nama_tugas}</td>
                  <td className="px-4 py-3 text-gray-600">{t.pemberi_tugas}</td>
                  <td className="px-4 py-3 text-gray-600">{t.penerima_tugas}</td>
                  <td className="px-4 py-3 text-gray-500">{t.deadline}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      t.status === "selesai" ? "bg-emerald-100 text-emerald-700" :
                      t.status === "proses" ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-600"
                    }`}>{t.status === "selesai" ? "Selesai" : t.status === "proses" ? "Proses" : "Belum Mulai"}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        );
      case "kegiatan":
        return (
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                {["No", "Nama Kegiatan", "Tanggal", "Waktu", "Pelaksana", "Peserta"].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs text-gray-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {kegiatan.filter(k => k.tanggal >= filterFrom && k.tanggal <= filterTo).map((k, i) => (
                <tr key={k.kegiatan_id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-500">{i + 1}</td>
                  <td className="px-4 py-3 text-gray-800">{k.nama_kegiatan}</td>
                  <td className="px-4 py-3 text-gray-500">{k.tanggal}</td>
                  <td className="px-4 py-3 text-gray-500">{k.waktu}</td>
                  <td className="px-4 py-3 text-gray-600">{k.pelaksana}</td>
                  <td className="px-4 py-3 text-gray-600">{k.peserta}</td>
                </tr>
              ))}
            </tbody>
          </table>
        );
      case "keuangan":
        const filtered = keuangan.filter(k => k.tanggal >= filterFrom && k.tanggal <= filterTo);
        const totalIn = filtered.filter(k => k.jenis === "masuk").reduce((a, b) => a + b.jumlah, 0);
        const totalOut = filtered.filter(k => k.jenis === "keluar").reduce((a, b) => a + b.jumlah, 0);
        return (
          <div>
            <div className="grid grid-cols-3 gap-3 mb-4 p-4 bg-gray-50 rounded-xl">
              <div className="text-center">
                <p className="text-xs text-gray-500">Total Pemasukan</p>
                <p className="text-sm text-emerald-600">{formatRupiah(totalIn)}</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-500">Total Pengeluaran</p>
                <p className="text-sm text-red-600">{formatRupiah(totalOut)}</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-500">Saldo Bersih</p>
                <p className="text-sm text-blue-600">{formatRupiah(totalIn - totalOut)}</p>
              </div>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  {["No", "Tanggal", "Jenis", "Sumber Dana", "Keterangan", "Jumlah"].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs text-gray-500 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((k, i) => (
                  <tr key={k.transaksi_id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-500">{i + 1}</td>
                    <td className="px-4 py-3 text-gray-500">{k.tanggal}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${k.jenis === "masuk" ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}`}>
                        {k.jenis === "masuk" ? "Pemasukan" : "Pengeluaran"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{k.sumber_dana}</td>
                    <td className="px-4 py-3 text-gray-800 max-w-[200px] truncate">{k.keterangan}</td>
                    <td className={`px-4 py-3 ${k.jenis === "masuk" ? "text-emerald-600" : "text-red-600"}`}>
                      {k.jenis === "masuk" ? "+" : "-"}{formatRupiah(k.jumlah)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
    }
  };

  const activeType = reportTypes.find(r => r.id === activeReport)!;

  return (
    <div className="p-4 lg:p-6 space-y-5">
      {/* Header */}
      <div>
        <h1 className="text-gray-900">Laporan</h1>
        <p className="text-gray-500 text-sm mt-0.5">Generate dan ekspor laporan sistem administrasi desa</p>
      </div>

      {/* Report Type Selector */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {reportTypes.map(rt => {
          const Icon = rt.icon;
          return (
            <button
              key={rt.id}
              onClick={() => setActiveReport(rt.id)}
              className={`p-4 rounded-xl border transition-all text-left ${
                activeReport === rt.id
                  ? `${rt.bg} ${rt.border} shadow-sm`
                  : "bg-white border-gray-200 hover:bg-gray-50"
              }`}
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-2 ${
                activeReport === rt.id ? rt.bg : "bg-gray-50"
              }`}>
                <Icon className={`w-4 h-4 ${activeReport === rt.id ? rt.color : "text-gray-400"}`} />
              </div>
              <p className={`text-sm ${activeReport === rt.id ? "text-gray-900" : "text-gray-600"}`}>{rt.label}</p>
              <p className="text-xs text-gray-400 mt-0.5">{rt.count} data</p>
            </button>
          );
        })}
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Filter className="w-4 h-4 text-gray-400" />
          <span>Filter Periode:</span>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <label className="text-xs text-gray-500">Dari</label>
            <input type="date" value={filterFrom} onChange={e => setFilterFrom(e.target.value)}
              className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-xs text-gray-500">Sampai</label>
            <input type="date" value={filterTo} onChange={e => setFilterTo(e.target.value)}
              className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
        </div>
        <div className="flex gap-2 sm:ml-auto">
          <button
            onClick={() => handleExport("PDF")}
            disabled={exporting}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white px-4 py-2 rounded-xl text-sm transition-all"
          >
            <FileDown className="w-4 h-4" />
            {exporting ? "Memproses..." : "PDF"}
          </button>
          <button
            onClick={() => handleExport("Excel")}
            disabled={exporting}
            className="flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white px-4 py-2 rounded-xl text-sm transition-all"
          >
            <FileSpreadsheet className="w-4 h-4" />
            {exporting ? "Memproses..." : "Excel"}
          </button>
        </div>
      </div>

      {/* Report Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className={`px-4 py-3 border-b ${activeType.border} ${activeType.bg} flex items-center justify-between`}>
          <div className="flex items-center gap-2">
            <activeType.icon className={`w-5 h-5 ${activeType.color}`} />
            <span className="text-sm text-gray-800">Laporan {activeType.label}</span>
          </div>
          <span className="text-xs text-gray-500">Periode: {filterFrom} s/d {filterTo}</span>
        </div>
        <div className="overflow-x-auto">
          {renderReportTable()}
        </div>
      </div>

      {/* Export Success Notice */}
      {exporting && (
        <div className="fixed bottom-6 right-6 bg-gray-900 text-white rounded-xl px-4 py-3 text-sm shadow-xl flex items-center gap-2 z-50">
          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          Sedang mengekspor laporan...
        </div>
      )}
    </div>
  );
}
