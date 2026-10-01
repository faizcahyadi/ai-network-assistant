import type { Incident } from "../types";
import { formatTime } from "../utils";
import { Link } from "react-router-dom";
import SeverityBadge from "./SeverityBadge";

export default function IncidentTable({ incidents }: { incidents: Incident[] }) {
  if (incidents.length === 0) {
    return <p className="text-gray-500">Tidak ada incident.</p>;
  }

  // Terbaru di atas. String ISO bisa diurutkan langsung sebagai teks.
  const sorted = [...incidents].sort((a, b) =>
    b.start_time.localeCompare(a.start_time),
  );

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200">
      <table className="min-w-full divide-y divide-gray-200 text-left text-sm">
        <thead className="bg-gray-50 text-xs uppercase text-gray-500">
          <tr>
            <th className="px-4 py-3">ID</th>
            <th className="px-4 py-3">Device</th>
            <th className="px-4 py-3">Severity</th>
            <th className="px-4 py-3">Type</th>
            <th className="px-4 py-3">Start</th>
            <th className="px-4 py-3">Summary</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {sorted.map((incident) => (
            <tr className="transition-colors hover:bg-gray-50" key={incident.incident_id}>
              <td className="px-4 py-3 font-medium">
                <Link className="text-blue-700 hover:underline" to={`/incidents/${incident.incident_id}`}>
                  {incident.incident_id}
                </Link>
              </td>
              <td className="px-4 py-3">{incident.device_id}</td>
              <td className="px-4 py-3">
                <SeverityBadge severity={incident.severity} />
              </td>
              <td className="px-4 py-3">{incident.root_cause}</td>
              <td className="px-4 py-3 whitespace-nowrap">
                {formatTime(incident.start_time)}
              </td>
              <td className="px-4 py-3 text-gray-600">{incident.evidence}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
