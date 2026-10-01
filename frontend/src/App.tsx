import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import IncidentDetailPage from "./pages/IncidentDetailPage";
import IncidentListPage from "./pages/IncidentListPage";

function NotFoundPage() {
  return (
    <main className="mx-auto max-w-6xl p-6">
      <h1 className="mb-4 text-2xl font-bold">Halaman tidak ditemukan</h1>
      <Link className="text-blue-600 underline" to="/">
        Kembali ke daftar incident
      </Link>
    </main>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<IncidentListPage />} />
        <Route path="/incidents/:id" element={<IncidentDetailPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}
