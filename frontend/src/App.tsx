import { useEffect, useState } from "react";
import { getIncidents } from "./api";
import type { Incident } from "./types";
import IncidentTable from "./components/IncidentTable";

export default function App() {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getIncidents()
      .then(setIncidents)
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="mx-auto max-w-6xl p-6">
      <h1 className="mb-6 text-2xl font-bold">AI Network Assistant</h1>
      {loading && <p className="text-gray-500">Loading incidents...</p>}
      {error && <p className="text-red-600">Gagal memuat data: {error}</p>}
      {!loading && !error && <IncidentTable incidents={incidents} />}
    </main>
  );
}