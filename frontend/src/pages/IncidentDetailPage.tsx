import { useEffect, useState } from "react";
import ReactMarkdown, { type Components } from "react-markdown";
import { Link, useParams } from "react-router-dom";
import { getIncident } from "../api";
import { formatTime } from "../utils";
import SeverityBadge from "../components/SeverityBadge";
import type { Incident } from "../types";

const markdownComponents: Components = {
  h3: ({ children }) => (
    <h3 className="mt-8 mb-3 text-xl font-semibold text-slate-900">
      {children}
    </h3>
  ),
  p: ({ children }) => (
    <p className="mb-4 leading-7 text-slate-700">{children}</p>
  ),
  ul: ({ children }) => (
    <ul className="mb-4 list-disc space-y-2 pl-6 text-slate-700">
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol className="mb-4 list-decimal space-y-2 pl-6 text-slate-700">
      {children}
    </ol>
  ),
  li: ({ children }) => <li className="pl-1 leading-7">{children}</li>,
  strong: ({ children }) => (
    <strong className="font-semibold text-slate-900">{children}</strong>
  ),
  hr: () => <hr className="my-6 border-slate-200" />,
  code: ({ children, className, ...props }) => (
    <code
      className={`rounded bg-slate-100 px-1.5 py-0.5 font-mono text-sm text-slate-800 ${className ?? ""}`}
      {...props}
    >
      {children}
    </code>
  ),
};

function BackLink() {
  return (
    <Link
      className="inline-flex items-center text-sm font-medium text-blue-700 hover:text-blue-900 hover:underline"
      to="/"
    >
      Kembali ke daftar
    </Link>
  );
}

export default function IncidentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [incident, setIncident] = useState<Incident | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    setIncident(null);
    setError(null);
    setLoading(true);

    if (!id) {
      setError("Incident not found");
      setLoading(false);
      return () => {
        cancelled = true;
      };
    }

    getIncident(id)
      .then((data) => {
        if (!cancelled) setIncident(data);
      })
      .catch((err: Error) => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) {
    return (
      <main className="mx-auto max-w-5xl p-6">
        <p className="text-slate-500">Memuat detail incident...</p>
      </main>
    );
  }

  if (error) {
    const notFound = error === "Incident not found";

    return (
      <main className="mx-auto max-w-5xl p-6">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h1 className="mb-2 text-xl font-semibold text-slate-900">
            {notFound ? "Incident tidak ditemukan" : "Gagal memuat data"}
          </h1>
          {!notFound && <p className="mb-4 text-red-700">{error}</p>}
          <BackLink />
        </div>
      </main>
    );
  }

  if (!incident) return null;

  const info = [
    { label: "Device", value: incident.device_id },
    { label: "Anomaly type", value: incident.anomaly_type },
    { label: "Root cause", value: incident.root_cause },
    { label: "Start time", value: formatTime(incident.start_time) },
    { label: "End time", value: formatTime(incident.end_time) },
  ];
  const analysis = incident.ai_analysis.replace(
    /^(\s*[-*]\s+).*Unit of Measure:.*$/gim,
    "$1Unit of Measure: Bandwidth unit is unspecified.",
  );

  return (
    <main className="mx-auto max-w-5xl space-y-6 p-6">
      <BackLink />

      <header className="flex flex-wrap items-center gap-3">
        <h1 className="text-2xl font-bold text-slate-900">
          {incident.incident_id}
        </h1>
        <SeverityBadge severity={incident.severity} />
      </header>

      <section
        aria-label="Incident information"
        className="grid gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:grid-cols-2 lg:grid-cols-3"
      >
        {info.map(({ label, value }) => (
          <div key={label}>
            <h2 className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
              {label}
            </h2>
            <p className="break-words text-sm text-slate-900">{value}</p>
          </div>
        ))}
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="mb-3 text-lg font-semibold text-slate-900">Evidence</h2>
        <p className="leading-7 text-slate-700">{incident.evidence}</p>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="mb-2 text-lg font-semibold text-slate-900">AI Analysis</h2>
        <ReactMarkdown components={markdownComponents}>
          {analysis}
        </ReactMarkdown>
      </section>
    </main>
  );
}
