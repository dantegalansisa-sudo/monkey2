export const EASE = {
  premium: [0.76, 0, 0.24, 1],
  smooth: [0.25, 0.8, 0.25, 1],
  bounce: [0.34, 1.56, 0.64, 1],
  snappy: [0.4, 0, 0.2, 1],
  cinematic: [0.86, 0, 0.07, 1],
} as const;

export const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09, delayChildren: 0.1 } },
};

export const cardIn = {
  hidden: { opacity: 0, y: 48, scale: 0.96 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.75, ease: EASE.premium } },
};

export const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE.smooth } },
};
