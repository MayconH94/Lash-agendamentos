// Date -> "2026-12-15" usando o dia LOCAL (toISOString converteria para UTC)
export function toISO(d: Date): string {
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${month}-${day}`;
}

export function todayISO(): string {
  return toISO(new Date());
}

// "2026-12-15" -> "15/12/2026"
export function formatDateBR(iso: string): string {
  return iso.split("-").reverse().join("/");
}