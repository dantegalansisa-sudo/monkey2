import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useRef, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { useCanHover } from '../lib/hooks';

type Props = {
  children: ReactNode;
  className?: string;
  to?: string;
  href?: string;
  onClick?: () => void;
  strength?: number;
  ariaLabel?: string;
  target?: string;
};

/** CTA that leans toward the pointer when it gets close (desktop only). */
export default function Magnetic({ children, className = '', to, href, onClick, strength = 0.35, ariaLabel, target }: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const canHover = useCanHover();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 18, mass: 0.6 });
  const sy = useSpring(y, { stiffness: 220, damping: 18, mass: 0.6 });

  const move = (e: React.MouseEvent) => {
    if (!canHover || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * strength);
    y.set((e.clientY - (r.top + r.height / 2)) * strength);
  };
  const leave = () => {
    x.set(0);
    y.set(0);
  };

  const inner = <motion.span style={{ x: sx, y: sy, display: 'inline-flex' }}>{children}</motion.span>;
  const rel = target === '_blank' ? 'noopener noreferrer' : undefined;

  return (
    <span ref={ref} className="magnetic" onMouseMove={move} onMouseLeave={leave}>
      {to ? (
        <Link to={to} className={className} aria-label={ariaLabel} onClick={onClick}>
          {inner}
        </Link>
      ) : href ? (
        <a href={href} className={className} aria-label={ariaLabel} target={target} rel={rel} onClick={onClick}>
          {inner}
        </a>
      ) : (
        <button type="button" className={className} aria-label={ariaLabel} onClick={onClick}>
          {inner}
        </button>
      )}
    </span>
  );
}
