import { motion } from "framer-motion";

/** Floating gradient orb */
const Orb = ({ className = "", color = "primary" }: { className?: string; color?: "primary" | "accent" }) => (
  <div
    className={`absolute rounded-full blur-3xl animate-pulse-glow pointer-events-none ${className}`}
    style={{
      background: color === "primary"
        ? "radial-gradient(circle, hsl(270 95% 65% / 0.3), transparent 70%)"
        : "radial-gradient(circle, hsl(175 85% 55% / 0.25), transparent 70%)",
    }}
  />
);

/** AI sparkle icon */
const AISparkle = ({ className = "", style }: { className?: string; style?: React.CSSProperties }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} style={style} xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2L14 10L22 12L14 14L12 22L10 14L2 12L10 10L12 2Z" fill="currentColor" opacity="0.8" />
  </svg>
);

/** Grid lines background */
const GridBackground = ({ className = "" }: { className?: string }) => (
  <div className={`absolute inset-0 pointer-events-none ${className}`} style={{
    backgroundImage: `
      linear-gradient(hsl(var(--border) / 0.15) 1px, transparent 1px),
      linear-gradient(90deg, hsl(var(--border) / 0.15) 1px, transparent 1px)
    `,
    backgroundSize: "80px 80px",
  }} />
);

/** Animated beam line */
const BeamLine = ({ className = "" }: { className?: string }) => (
  <motion.div
    className={`absolute h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent ${className}`}
    initial={{ scaleX: 0, opacity: 0 }}
    animate={{ scaleX: 1, opacity: 1 }}
    transition={{ duration: 2, ease: "easeOut" }}
  />
);

/** Neural network node */
const NeuralDot = ({ className = "" }: { className?: string }) => (
  <div className={`w-1.5 h-1.5 rounded-full bg-primary/40 ${className}`} />
);

// Keep legacy exports for compatibility
const DoodleUnderline = ({ className = "" }: { className?: string }) => (
  <div className={`doodle-underline ${className}`} />
);

const DoodleCircle = ({ className = "" }: { className?: string }) => (
  <div className={`w-16 h-16 rounded-full border border-primary/20 ${className}`} />
);

const DoodleArrow = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 24 12" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M0 6h20m-4-4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const DoodleStar = ({ className = "", style }: { className?: string; style?: React.CSSProperties }) => (
  <AISparkle className={className} style={style} />
);

const DoodleSquiggle = ({ className = "" }: { className?: string }) => (
  <div className={`h-px bg-gradient-to-r from-primary/30 to-accent/30 ${className}`} />
);

const DoodleBracket = ({ className = "" }: { className?: string }) => (
  <div className={`w-1 h-8 bg-gradient-to-b from-primary/30 to-transparent rounded-full ${className}`} />
);

export {
  DoodleUnderline, DoodleCircle, DoodleArrow, DoodleStar, DoodleSquiggle, DoodleBracket,
  Orb, AISparkle, GridBackground, BeamLine, NeuralDot,
};
