export const MOTION = {
  fast: 200,
  normal: 300,
  slow: 440,
  staggerStep: 36,
  enter: {
    duration: 300,
    damping: 21,
    stiffness: 195,
  },
  spring: {
    damping: 22,
    stiffness: 185,
    mass: 0.85,
  },
  pressScale: 0.965,
  cardPressScale: 0.982,
} as const;