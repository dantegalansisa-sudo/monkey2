import { useState } from 'react';
import { dayKey, dayStatus, monthGrid } from '../data/availability';

const WD = ['D', 'L', 'M', 'M', 'J', 'V', 'S'];

/** Month view of an artist's agenda: open, on hold and booked dates. */
export default function MonthCalendar({ slug, value, onPick }: { slug: string; value?: string; onPick: (d: Date) => void }) {
  const now = new Date();
  const [cursor, setCursor] = useState({ y: now.getFullYear(), m: now.getMonth() });
  const cells = monthGrid(cursor.y, cursor.m);
  const title = new Date(cursor.y, cursor.m, 1).toLocaleDateString('es-PR', { month: 'long', year: 'numeric' });
  const canPrev = cursor.y > now.getFullYear() || cursor.m > now.getMonth();
  const shift = (n: number) => {
    const d = new Date(cursor.y, cursor.m + n, 1);
    setCursor({ y: d.getFullYear(), m: d.getMonth() });
  };

  return (
    <div className="cal">
      <div className="cal__head">
        <button onClick={() => shift(-1)} disabled={!canPrev} aria-label="Mes anterior">
          ‹
        </button>
        <strong>{title}</strong>
        <button onClick={() => shift(1)} aria-label="Mes siguiente">
          ›
        </button>
      </div>
      <div className="cal__grid">
        {WD.map((w, i) => (
          <span key={i} className="cal__wd">
            {w}
          </span>
        ))}
        {cells.map((d, i) => {
          if (!d) return <span key={i} />;
          const st = dayStatus(slug, d);
          const on = value === dayKey(d);
          return (
            <button
              key={i}
              className={`cal__day is-${st} ${on ? 'is-on' : ''}`}
              disabled={st === 'pasado' || st === 'reservado'}
              onClick={() => onPick(d)}
              aria-label={`${d.getDate()} · ${st}`}
            >
              {d.getDate()}
            </button>
          );
        })}
      </div>
      <div className="cal__legend">
        <span><i className="is-libre" /> Libre</span>
        <span><i className="is-espera" /> En espera</span>
        <span><i className="is-reservado" /> Reservado</span>
      </div>
    </div>
  );
}
