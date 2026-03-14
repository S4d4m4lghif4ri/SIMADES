import { createBrowserRouter } from "react-router";
import Layout from "./components/Layout";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import SuratKeluar from "./pages/SuratKeluar";
import SuratMasuk from "./pages/SuratMasuk";
import Disposisi from "./pages/Disposisi";
import ManajemenTugas from "./pages/ManajemenTugas";
import KegiatanDesa from "./pages/KegiatanDesa";
import KeuanganDesa from "./pages/KeuanganDesa";
import ArsipDokumen from "./pages/ArsipDokumen";
import Laporan from "./pages/Laporan";
import Pengaturan from "./pages/Pengaturan";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Login,
  },
  {
    path: "/",
    Component: Layout,
    children: [
      { path: "dashboard", Component: Dashboard },
      { path: "surat-keluar", Component: SuratKeluar },
      { path: "surat-masuk", Component: SuratMasuk },
      { path: "disposisi", Component: Disposisi },
      { path: "tugas", Component: ManajemenTugas },
      { path: "kegiatan", Component: KegiatanDesa },
      { path: "keuangan", Component: KeuanganDesa },
      { path: "arsip", Component: ArsipDokumen },
      { path: "laporan", Component: Laporan },
      { path: "pengaturan", Component: Pengaturan },
    ],
  },
]);