import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { EASE } from '../lib/motion';

type Tag = 'h1' | 'h2' | 'h3' | 'p' | 'div';

/** Cinematic line-mask reveal: each line rises out of its own clipped box. */
export default function Reveal({
  lines,
  as = 'h2',
  className = '',
  delay = 0,
  once = true,
  animateNow = false,
}: {
  lines: ReactNode[];
  as?: Tag;
  className?: string;
  delay?: number;
  once?: boolean;
  animateNow?: boolean;
}) {
  const Tag = motion[as];
  const trigger = animateNow
    ? { initial: 'hidden', animate: 'visible' }
    : { initial: 'hidden', whileInView: 'visible', viewport: { once, amount: 0.4 } };
  return (
    <Tag className={`reveal ${className}`} {...trigger}>
      {lines.map((line, i) => (
        <span className="reveal__mask" key={i}>
          <motion.span
            className="reveal__line"
            variants={{
              hidden: { y: '115%', rotate: 3 },
              visible: { y: '0%', rotate: 0, transition: { duration: 1, delay: delay + i * 0.09, ease: EASE.premium } },
            }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}
