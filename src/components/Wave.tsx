import { useId } from 'react';

/** JP Events waveform mark rebuilt as SVG so the bars can pulse like an audio meter. */
const BARS = [
  { x: 40, h: 16 }, { x: 50, h: 26 }, { x: 60, h: 38 }, { x: 70, h: 30 }, { x: 80, h: 52 },
  { x: 140, h: 62 }, { x: 150, h: 40 }, { x: 160, h: 54 }, { x: 170, h: 34 }, { x: 180, h: 24 }, { x: 190, h: 14 },
];
const DOTS = [8, 18, 28, 202, 212, 222];

export default function Wave({ className = '', animated = true, mono = false }: { className?: string; animated?: boolean; mono?: boolean }) {
  const id = useId().replace(/:/g, '');
  const stroke = mono ? 'currentColor' : `url(#g${id})`;
  return (
    <svg className={`wave ${animated ? 'is-anim' : ''} ${className}`} viewBox="0 0 230 100" aria-hidden="true">
      <defs>
        <linearGradient id={`g${id}`} x1="0" x2="230" y1="0" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#3FA0EF" />
          <stop offset="0.5" stopColor="#5B6BFF" />
          <stop offset="1" stopColor="#5B1AF5" />
        </linearGradient>
      </defs>
      <g fill={mono ? 'currentColor' : `url(#g${id})`}>
        {DOTS.map((x) => (
          <circle key={x} cx={x} cy="50" r="3.6" />
        ))}
      </g>
      <g stroke={stroke} strokeWidth="6.5" strokeLinecap="round" fill="none">
        {BARS.map((b, i) => (
          <line key={b.x} x1={b.x} x2={b.x} y1={50 - b.h / 2} y2={50 + b.h / 2} className="wave__bar" style={{ animationDelay: `${(i * 113) % 700}ms` }} />
        ))}
        {/* J */}
        <path d="M106 10 V66 A11 11 0 0 1 84 66" className="wave__letter" />
        <line x1="95" x2="95" y1="30" y2="46" className="wave__bar" style={{ animationDelay: '320ms' }} />
        {/* P */}
        <path d="M120 90 V12 H125 A15 15 0 0 1 125 42 H120" className="wave__letter" />
        <line x1="131" x2="131" y1="56" y2="80" className="wave__bar" style={{ animationDelay: '540ms' }} />
      </g>
    </svg>
  );
}

export function Logo({ className = '' }: { className?: string }) {
  return (
    <span className={`logo ${className}`}>
      <Wave className="logo__wave" />
      <span className="logo__text">
        <b>BUQUÉALO</b>
        <small>by JP Events</small>
      </span>
    </span>
  );
}
