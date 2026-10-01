const STYLES: Record<string, string> = {
  CRITICAL: "bg-red-100 text-red-800",
  HIGH: "bg-orange-100 text-orange-800",
  MEDIUM: "bg-yellow-100 text-yellow-800",
  LOW: "bg-green-100 text-green-800",
};

export default function SeverityBadge({ severity }: { severity: string }) {
  const style = STYLES[severity.toUpperCase()] ?? "bg-gray-100 text-gray-800";
  return (
    <span
      className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${style}`}
    >
      {severity}
    </span>
  );
}