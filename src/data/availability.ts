// Demo availability per artist/day, deterministic so the calendar looks real
// until it is connected to the agency's booking backend.

export type DayStatus = 'libre' | 'espera' | 'reservado' | 'pasado';

function hash(str: string) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0) % 100;
}

export const dayKey = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

export function dayStatus(slug: string, d: Date): DayStatus {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (d < today) return 'pasado';
  const weekend = d.getDay() === 5 || d.getDay() === 6;
  const h = hash(`${slug}|${dayKey(d)}`);
  const busy = weekend ? 52 : 22;
  if (h < busy) return 'reservado';
  if (h < busy + 10) return 'espera';
  return 'libre';
}

export function nextFree(slug: string, from = new Date()) {
  const d = new Date(from.getFullYear(), from.getMonth(), from.getDate());
  for (let i = 0; i < 120; i++) {
    const day = new Date(d.getFullYear(), d.getMonth(), d.getDate() + i);
    if ((day.getDay() === 5 || day.getDay() === 6) && dayStatus(slug, day) === 'libre') return day;
  }
  return null;
}

export function monthGrid(year: number, month: number) {
  const first = new Date(year, month, 1);
  const offset = first.getDay();
  const days = new Date(year, month + 1, 0).getDate();
  const cells: (Date | null)[] = Array.from({ length: offset }, () => null);
  for (let i = 1; i <= days; i++) cells.push(new Date(year, month, i));
  return cells;
}

export const fmtDate = (d: Date, opts: Intl.DateTimeFormatOptions = { weekday: 'short', day: 'numeric', month: 'short' }) =>
  d.toLocaleDateString('es-PR', opts).replace(/\./g, '');
