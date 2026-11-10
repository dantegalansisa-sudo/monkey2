import type { SVGProps } from 'react';
import type { IconName } from '../data/services';

const base = (p: SVGProps<SVGSVGElement>) => ({
  width: 24,
  height: 24,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
  ...p,
});

type P = SVGProps<SVGSVGElement>;
export const Arrow = (p: P) => <svg {...base(p)}><path d="M5 12h14M13 6l6 6-6 6" /></svg>;
export const ArrowUpRight = (p: P) => <svg {...base(p)}><path d="M7 17 17 7M8 7h9v9" /></svg>;
export const Plus = (p: P) => <svg {...base(p)}><path d="M12 5v14M5 12h14" /></svg>;
export const Check = (p: P) => <svg {...base(p)}><path d="m5 12 5 5L20 7" /></svg>;
export const Close = (p: P) => <svg {...base(p)}><path d="M6 6l12 12M18 6 6 18" /></svg>;
export const Play = (p: P) => <svg {...base(p)} fill="currentColor" stroke="none"><path d="M8 5.5v13a1 1 0 0 0 1.5.86l10.5-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5Z" /></svg>;
export const Search = (p: P) => <svg {...base(p)}><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>;
export const Calendar = (p: P) => <svg {...base(p)}><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M3 10h18M8 3v4M16 3v4" /></svg>;
export const Pin = (p: P) => <svg {...base(p)}><path d="M12 21s-7-6.2-7-12a7 7 0 0 1 14 0c0 5.8-7 12-7 12Z" /><circle cx="12" cy="9" r="2.5" /></svg>;
export const Users = (p: P) => <svg {...base(p)}><circle cx="9" cy="8" r="3.5" /><path d="M2.5 20a6.5 6.5 0 0 1 13 0M16 4.5a3.5 3.5 0 0 1 0 7M18 14a6.5 6.5 0 0 1 3.5 6" /></svg>;
export const Clock = (p: P) => <svg {...base(p)}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>;
export const Whats = (p: P) => <svg {...base(p)}><path d="M3.5 20.5 5 16a8.5 8.5 0 1 1 3 3Z" /><path d="M9 9.5c0 3 2.5 5.5 5.5 5.5l1.2-1.4-2-1-1 .8a4 4 0 0 1-2-2l.8-1-1-2Z" /></svg>;
export const Mail = (p: P) => <svg {...base(p)}><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></svg>;
export const Phone = (p: P) => <svg {...base(p)}><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z" /></svg>;
export const Insta = (p: P) => <svg {...base(p)}><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" /></svg>;
export const Shield = (p: P) => <svg {...base(p)}><path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6Z" /><path d="m9 12 2 2 4-4" /></svg>;
export const File = (p: P) => <svg {...base(p)}><path d="M14 3H6v18h12V7Z" /><path d="M14 3v4h4M9 13h6M9 17h6" /></svg>;
export const Music = (p: P) => <svg {...base(p)}><path d="M9 18V5l11-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="17" cy="16" r="3" /></svg>;
export const Bag = (p: P) => <svg {...base(p)}><path d="M5 8h14l-1 13H6Z" /><path d="M9 8V6a3 3 0 0 1 6 0v2" /></svg>;

const SVC: Record<IconName, (p: P) => React.ReactElement> = {
  disc: (p) => <svg {...base(p)}><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="3" /><path d="M12 3a9 9 0 0 1 9 9" /></svg>,
  mic: (p) => <svg {...base(p)}><rect x="9" y="3" width="6" height="11" rx="3" /><path d="M5 11a7 7 0 0 0 14 0M12 18v3" /></svg>,
  glass: (p) => <svg {...base(p)}><path d="M5 4h14l-7 8Z" /><path d="M12 12v8M8 20h8" /></svg>,
  floor: (p) => <svg {...base(p)}><path d="M3 9h18M3 15h18M9 3v18M15 3v18" /><rect x="3" y="3" width="18" height="18" rx="2" /></svg>,
  stage: (p) => <svg {...base(p)}><path d="M3 16h18v4H3zM6 16V9M18 16V9M4 9h16" /></svg>,
  light: (p) => <svg {...base(p)}><path d="M8 3h8l-2 6h-4Z" /><path d="M10 9 5 21M14 9l5 12M12 9v12" /></svg>,
  speaker: (p) => <svg {...base(p)}><rect x="6" y="2" width="12" height="20" rx="2" /><circle cx="12" cy="15" r="3.5" /><circle cx="12" cy="7" r="1.5" /></svg>,
  screen: (p) => <svg {...base(p)}><rect x="2" y="4" width="20" height="13" rx="2" /><path d="M8 21h8M12 17v4" /></svg>,
  camera: (p) => <svg {...base(p)}><path d="M4 8h3l2-3h6l2 3h3v11H4z" /><circle cx="12" cy="13" r="3.5" /></svg>,
  spark: (p) => <svg {...base(p)}><path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M6 18l2.5-2.5M15.5 8.5 18 6" /></svg>,
  clip: (p) => <svg {...base(p)}><rect x="5" y="4" width="14" height="17" rx="2" /><path d="M9 4V3h6v1M9 11h6M9 15h4" /></svg>,
};

export const SvcIcon = ({ name, ...p }: P & { name: IconName }) => SVC[name](p);
