// Format "2026-09-06T14:00:00.000" -> "2026-09-06 14:00"
// Sengaja tidak pakai new Date() supaya jam tidak geser karena timezone.
export function formatTime(value: string): string {
  const [date, time = ""] = value.split("T");
  return `${date} ${time.slice(0, 5)}`;
}