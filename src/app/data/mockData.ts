export const ROLES = {
  KEPALA_DESA: "Kepala Desa",
  SEKDES: "Sekretaris Desa",
  KAUR: "Kaur",
  KASI: "Kasi",
  BENDAHARA: "Bendahara",
  ADMIN: "Admin Desa",
};

export const users = [
  { user_id: "U001", nama: "Budi Santoso", jabatan: "Kepala Desa", role: "KEPALA_DESA", email: "kades@desa.id", password: "kades123", status: "aktif" },
  { user_id: "U002", nama: "Siti Rahayu", jabatan: "Sekretaris Desa", role: "SEKDES", email: "sekdes@desa.id", password: "sekdes123", status: "aktif" },
  { user_id: "U003", nama: "Ahmad Fauzi", jabatan: "Kaur Umum", role: "KAUR", email: "kaur@desa.id", password: "kaur123", status: "aktif" },
  { user_id: "U004", nama: "Dewi Lestari", jabatan: "Kasi Pemerintahan", role: "KASI", email: "kasi@desa.id", password: "kasi123", status: "aktif" },
  { user_id: "U005", nama: "Rini Wulandari", jabatan: "Bendahara Desa", role: "BENDAHARA", email: "bendahara@desa.id", password: "bendahara123", status: "aktif" },
  { user_id: "U006", nama: "Hendra Wijaya", jabatan: "Admin Sistem", role: "ADMIN", email: "admin@desa.id", password: "admin123", status: "aktif" },
];

export const suratKeluar = [
  { surat_id: "SK001", nomor_surat: "001/SK/2026/I", jenis_surat: "Surat Keterangan Domisili", tanggal: "2026-01-05", pembuat: "Ahmad Fauzi", file_draft: "draft_sk001.pdf", status: "approved", ttd_kades: true, tanggal_approve: "2026-01-06" },
  { surat_id: "SK002", nomor_surat: "002/SK/2026/I", jenis_surat: "Surat Pengantar SKCK", tanggal: "2026-01-10", pembuat: "Ahmad Fauzi", file_draft: "draft_sk002.pdf", status: "pending", ttd_kades: false, tanggal_approve: null },
  { surat_id: "SK003", nomor_surat: "003/SK/2026/I", jenis_surat: "Surat Keterangan Tidak Mampu", tanggal: "2026-01-15", pembuat: "Hendra Wijaya", file_draft: "draft_sk003.pdf", status: "approved", ttd_kades: true, tanggal_approve: "2026-01-16" },
  { surat_id: "SK004", nomor_surat: "004/SK/2026/II", jenis_surat: "Surat Keterangan Usaha", tanggal: "2026-02-02", pembuat: "Ahmad Fauzi", file_draft: "draft_sk004.pdf", status: "pending", ttd_kades: false, tanggal_approve: null },
  { surat_id: "SK005", nomor_surat: "005/SK/2026/II", jenis_surat: "Surat Rekomendasi", tanggal: "2026-02-10", pembuat: "Hendra Wijaya", file_draft: "draft_sk005.pdf", status: "rejected", ttd_kades: false, tanggal_approve: null },
  { surat_id: "SK006", nomor_surat: "006/SK/2026/II", jenis_surat: "Surat Pernyataan", tanggal: "2026-02-18", pembuat: "Ahmad Fauzi", file_draft: "draft_sk006.pdf", status: "approved", ttd_kades: true, tanggal_approve: "2026-02-19" },
  { surat_id: "SK007", nomor_surat: "007/SK/2026/III", jenis_surat: "Surat Keterangan Pindah", tanggal: "2026-03-01", pembuat: "Ahmad Fauzi", file_draft: "draft_sk007.pdf", status: "pending", ttd_kades: false, tanggal_approve: null },
];

export const suratMasuk = [
  { surat_masuk_id: "SM001", nomor_surat: "001/KECAMATAN/2026", asal_surat: "Kecamatan Cibiru", tanggal_surat: "2026-01-03", perihal: "Undangan Rapat Koordinasi", file_surat: "sm001.pdf", status: "diproses" },
  { surat_masuk_id: "SM002", nomor_surat: "045/DINKES/2026", asal_surat: "Dinas Kesehatan", tanggal_surat: "2026-01-08", perihal: "Pemberitahuan Program Imunisasi", file_surat: "sm002.pdf", status: "selesai" },
  { surat_masuk_id: "SM003", nomor_surat: "012/DISDUKCAPIL/2026", asal_surat: "Dinas Kependudukan", tanggal_surat: "2026-01-15", perihal: "Sosialisasi E-KTP Terbaru", file_surat: "sm003.pdf", status: "baru" },
  { surat_masuk_id: "SM004", nomor_surat: "078/DPMD/2026", asal_surat: "Dinas PMD", tanggal_surat: "2026-02-05", perihal: "Laporan Dana Desa Triwulan I", file_surat: "sm004.pdf", status: "diproses" },
  { surat_masuk_id: "SM005", nomor_surat: "023/POLRES/2026", asal_surat: "Polres Setempat", tanggal_surat: "2026-02-12", perihal: "Keamanan Lingkungan", file_surat: "sm005.pdf", status: "selesai" },
  { surat_masuk_id: "SM006", nomor_surat: "089/BPBD/2026", asal_surat: "BPBD Kabupaten", tanggal_surat: "2026-03-01", perihal: "Kesiapsiagaan Bencana", file_surat: "sm006.pdf", status: "baru" },
];

export const disposisi = [
  { disposisi_id: "D001", surat_masuk_id: "SM001", dari: "Budi Santoso", kepada: "Siti Rahayu", instruksi: "Harap diwakili dan laporkan hasilnya", tanggal: "2026-01-04", status: "selesai" },
  { disposisi_id: "D002", surat_masuk_id: "SM002", dari: "Budi Santoso", kepada: "Dewi Lestari", instruksi: "Koordinasikan dengan Posyandu setempat", tanggal: "2026-01-09", status: "diproses" },
  { disposisi_id: "D003", surat_masuk_id: "SM004", dari: "Budi Santoso", kepada: "Ahmad Fauzi", instruksi: "Siapkan data pendukung dan kirimkan tepat waktu", tanggal: "2026-02-06", status: "diproses" },
];

export const tugas = [
  { tugas_id: "T001", nama_tugas: "Penyusunan RAB Dana Desa 2026", deskripsi: "Menyusun rencana anggaran biaya dana desa tahun 2026 sesuai juknis", pemberi_tugas: "Budi Santoso", penerima_tugas: "Ahmad Fauzi", tanggal_mulai: "2026-01-10", deadline: "2026-01-20", file_referensi: "juknis_dana_desa.pdf", status: "selesai" },
  { tugas_id: "T002", nama_tugas: "Pendataan Warga Miskin", deskripsi: "Melakukan pendataan warga miskin untuk program bantuan sosial", pemberi_tugas: "Siti Rahayu", penerima_tugas: "Dewi Lestari", tanggal_mulai: "2026-01-15", deadline: "2026-02-15", file_referensi: null, status: "proses" },
  { tugas_id: "T003", nama_tugas: "Pelaporan Keuangan Bulan Januari", deskripsi: "Menyusun laporan keuangan bulan Januari dan realisasi anggaran", pemberi_tugas: "Budi Santoso", penerima_tugas: "Rini Wulandari", tanggal_mulai: "2026-02-01", deadline: "2026-02-07", file_referensi: null, status: "selesai" },
  { tugas_id: "T004", nama_tugas: "Pembaruan Data Kependudukan", deskripsi: "Update data penduduk di sistem informasi desa", pemberi_tugas: "Siti Rahayu", penerima_tugas: "Ahmad Fauzi", tanggal_mulai: "2026-02-10", deadline: "2026-03-10", file_referensi: null, status: "proses" },
  { tugas_id: "T005", nama_tugas: "Persiapan Musrenbangdes 2026", deskripsi: "Persiapan dokumen dan tempat untuk musyawarah rencana pembangunan desa", pemberi_tugas: "Budi Santoso", penerima_tugas: "Dewi Lestari", tanggal_mulai: "2026-02-20", deadline: "2026-03-20", file_referensi: null, status: "belum_mulai" },
  { tugas_id: "T006", nama_tugas: "Sosialisasi BPNT", deskripsi: "Sosialisasi program Bantuan Pangan Non Tunai kepada warga", pemberi_tugas: "Siti Rahayu", penerima_tugas: "Ahmad Fauzi", tanggal_mulai: "2026-03-01", deadline: "2026-03-15", file_referensi: null, status: "belum_mulai" },
];

export const kegiatan = [
  { kegiatan_id: "K001", nama_kegiatan: "Posyandu Balita", tanggal: "2026-01-10", waktu: "08:00", pelaksana: "Dewi Lestari", peserta: "50 Ibu dan Balita", dokumentasi: "posyandu_jan.jpg", catatan: "Berjalan lancar, semua balita mendapat imunisasi" },
  { kegiatan_id: "K002", nama_kegiatan: "Gotong Royong Bersih Desa", tanggal: "2026-01-18", waktu: "07:00", pelaksana: "Ahmad Fauzi", peserta: "120 Warga", dokumentasi: "goro_jan.jpg", catatan: "Pembersihan saluran air dan jalan desa" },
  { kegiatan_id: "K003", nama_kegiatan: "Rapat BPD Bulanan", tanggal: "2026-02-05", waktu: "10:00", pelaksana: "Budi Santoso", peserta: "15 Anggota BPD", dokumentasi: null, catatan: "Pembahasan APBDes dan program kerja" },
  { kegiatan_id: "K004", nama_kegiatan: "Pelatihan Keterampilan Ibu PKK", tanggal: "2026-02-15", waktu: "09:00", pelaksana: "Siti Rahayu", peserta: "35 Anggota PKK", dokumentasi: "pkk_feb.jpg", catatan: "Pelatihan kerajinan tangan dan memasak" },
  { kegiatan_id: "K005", nama_kegiatan: "Sosialisasi Dana Desa", tanggal: "2026-03-05", waktu: "13:00", pelaksana: "Budi Santoso", peserta: "200 Warga", dokumentasi: "sosialisasi_mar.jpg", catatan: "Transparansi penggunaan dana desa" },
  { kegiatan_id: "K006", nama_kegiatan: "Perlombaan HUT Desa", tanggal: "2026-03-10", waktu: "08:00", pelaksana: "Ahmad Fauzi", peserta: "500 Warga", dokumentasi: "hut_desa.jpg", catatan: "Berbagai lomba tradisional dan modern" },
];

export const keuangan = [
  { transaksi_id: "KU001", tanggal: "2026-01-02", jenis: "masuk", sumber_dana: "Dana Desa", jumlah: 150000000, keterangan: "Transfer Dana Desa Tahap 1", bukti: "bukti_dd_t1.pdf" },
  { transaksi_id: "KU002", tanggal: "2026-01-05", jenis: "keluar", sumber_dana: "Dana Desa", jumlah: 25000000, keterangan: "Pembayaran Jasa Konstruksi Jalan", bukti: "bukti_konstruksi.pdf" },
  { transaksi_id: "KU003", tanggal: "2026-01-10", jenis: "masuk", sumber_dana: "ADD", jumlah: 75000000, keterangan: "Alokasi Dana Desa Tahap 1", bukti: "bukti_add.pdf" },
  { transaksi_id: "KU004", tanggal: "2026-01-15", jenis: "keluar", sumber_dana: "ADD", jumlah: 10000000, keterangan: "Biaya Operasional Kantor Desa", bukti: "bukti_ops.pdf" },
  { transaksi_id: "KU005", tanggal: "2026-02-01", jenis: "keluar", sumber_dana: "Dana Desa", jumlah: 35000000, keterangan: "Pembangunan Saluran Irigasi", bukti: "bukti_irigasi.pdf" },
  { transaksi_id: "KU006", tanggal: "2026-02-10", jenis: "masuk", sumber_dana: "PADes", jumlah: 8500000, keterangan: "Pendapatan Asli Desa", bukti: "bukti_pades.pdf" },
  { transaksi_id: "KU007", tanggal: "2026-02-20", jenis: "keluar", sumber_dana: "ADD", jumlah: 15000000, keterangan: "Tunjangan Perangkat Desa Februari", bukti: "bukti_tunjangan.pdf" },
  { transaksi_id: "KU008", tanggal: "2026-03-05", jenis: "masuk", sumber_dana: "Dana Desa", jumlah: 150000000, keterangan: "Transfer Dana Desa Tahap 2", bukti: "bukti_dd_t2.pdf" },
  { transaksi_id: "KU009", tanggal: "2026-03-08", jenis: "keluar", sumber_dana: "Dana Desa", jumlah: 50000000, keterangan: "Pembangunan Balai Desa", bukti: "bukti_balai.pdf" },
  { transaksi_id: "KU010", tanggal: "2026-03-12", jenis: "keluar", sumber_dana: "ADD", jumlah: 5000000, keterangan: "Kegiatan HUT Desa", bukti: "bukti_hut.pdf" },
];

export const dokumen = [
  { dokumen_id: "DOK001", nama_dokumen: "RPJM Desa 2021-2026", kategori: "Perencanaan", file: "rpjm_desa.pdf", tanggal: "2021-01-01", uploader: "Siti Rahayu" },
  { dokumen_id: "DOK002", nama_dokumen: "APBDes 2026", kategori: "Keuangan", file: "apbdes_2026.pdf", tanggal: "2026-01-02", uploader: "Rini Wulandari" },
  { dokumen_id: "DOK003", nama_dokumen: "Perdes No. 1 Tahun 2026", kategori: "Peraturan", file: "perdes_01_2026.pdf", tanggal: "2026-01-10", uploader: "Hendra Wijaya" },
  { dokumen_id: "DOK004", nama_dokumen: "Profil Desa 2025", kategori: "Umum", file: "profil_desa.pdf", tanggal: "2025-12-31", uploader: "Ahmad Fauzi" },
  { dokumen_id: "DOK005", nama_dokumen: "Data Penduduk 2026", kategori: "Kependudukan", file: "data_penduduk.xlsx", tanggal: "2026-01-05", uploader: "Ahmad Fauzi" },
  { dokumen_id: "DOK006", nama_dokumen: "Laporan Keuangan Q1 2026", kategori: "Keuangan", file: "laporan_keu_q1.pdf", tanggal: "2026-03-31", uploader: "Rini Wulandari" },
  { dokumen_id: "DOK007", nama_dokumen: "RKP Desa 2026", kategori: "Perencanaan", file: "rkp_desa_2026.pdf", tanggal: "2025-11-15", uploader: "Siti Rahayu" },
];

export const monthlyLetterStats = [
  { bulan: "Jan", keluar: 8, masuk: 5 },
  { bulan: "Feb", keluar: 12, masuk: 7 },
  { bulan: "Mar", keluar: 10, masuk: 6 },
  { bulan: "Apr", keluar: 15, masuk: 9 },
  { bulan: "Mei", keluar: 11, masuk: 4 },
  { bulan: "Jun", keluar: 9, masuk: 6 },
];

export const taskCompletionStats = [
  { name: "Selesai", value: 12, color: "#10b981" },
  { name: "Proses", value: 8, color: "#3b82f6" },
  { name: "Belum Mulai", value: 5, color: "#f59e0b" },
];

export const financialStats = [
  { bulan: "Jan", masuk: 225000000, keluar: 35000000 },
  { bulan: "Feb", masuk: 8500000, keluar: 50000000 },
  { bulan: "Mar", masuk: 150000000, keluar: 55000000 },
  { bulan: "Apr", masuk: 0, keluar: 0 },
  { bulan: "Mei", masuk: 0, keluar: 0 },
  { bulan: "Jun", masuk: 0, keluar: 0 },
];

export const rolePermissions: Record<string, string[]> = {
  KEPALA_DESA: ["dashboard", "surat-keluar", "surat-masuk", "disposisi", "tugas", "kegiatan", "keuangan", "arsip", "laporan", "pengaturan"],
  SEKDES: ["dashboard", "surat-keluar", "surat-masuk", "disposisi", "tugas", "kegiatan", "arsip", "laporan", "pengaturan"],
  KAUR: ["dashboard", "surat-keluar", "surat-masuk", "tugas", "kegiatan", "arsip", "laporan"],
  KASI: ["dashboard", "surat-keluar", "surat-masuk", "tugas", "kegiatan", "arsip"],
  BENDAHARA: ["dashboard", "keuangan", "arsip", "laporan"],
  ADMIN: ["dashboard", "surat-keluar", "surat-masuk", "tugas", "kegiatan", "arsip", "laporan", "pengaturan"],
};
