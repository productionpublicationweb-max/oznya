// lib/animations.ts
export const animations = {
  fadeIn: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: 0.3, ease: "easeOut" }
  },
  slideIn: {
    initial: { x: -100, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    transition: { type: "spring", stiffness: 100, damping: 15 }
  },
  scaleIn: {
    initial: { scale: 0.8, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    transition: { duration: 0.2 }
  },
  mysticalGlow: {
    animate: {
      boxShadow: [
        "0 0 20px rgba(6, 182, 212, 0.3)",
        "0 0 40px rgba(139, 92, 246, 0.5)",
        "0 0 20px rgba(6, 182, 212, 0.3)"
      ]
    },
    transition: { duration: 2, repeat: Infinity }
  }
};
