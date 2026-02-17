const DoodleUnderline = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 200 12" fill="none" className={`w-full ${className}`} xmlns="http://www.w3.org/2000/svg">
    <path d="M2 8c30-6 60 2 90-2s60-4 90 0 15 6 16 4" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
  </svg>
);

const DoodleCircle = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 120 120" fill="none" className={`${className}`} xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="60" cy="60" rx="55" ry="50" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="4 6" />
  </svg>
);

const DoodleArrow = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 80 30" fill="none" className={`${className}`} xmlns="http://www.w3.org/2000/svg">
    <path d="M2 15c20-8 40-2 60 0m-8-8l8 8-8 8" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const DoodleStar = ({ className = "", style }: { className?: string; style?: React.CSSProperties }) => (
  <svg viewBox="0 0 40 40" fill="none" className={`${className}`} style={style} xmlns="http://www.w3.org/2000/svg">
    <path d="M20 2l3 12h12l-10 7 4 12-9-7-9 7 4-12L5 14h12z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const DoodleSquiggle = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 100 20" fill="none" className={`${className}`} xmlns="http://www.w3.org/2000/svg">
    <path d="M2 10c10-8 20 8 30 0s20 8 30 0 20 8 30 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const DoodleBracket = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 20 60" fill="none" className={`${className}`} xmlns="http://www.w3.org/2000/svg">
    <path d="M15 5c-8 5-10 15-10 25s2 20 10 25" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
  </svg>
);

// Western-themed elements
const WantedBadge = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 120 40" fill="none" className={`${className}`} xmlns="http://www.w3.org/2000/svg">
    <rect x="2" y="2" width="116" height="36" rx="4" stroke="currentColor" strokeWidth="2" strokeDasharray="6 3" />
    <rect x="6" y="6" width="108" height="28" rx="2" stroke="currentColor" strokeWidth="1" opacity="0.5" />
  </svg>
);

const Crosshair = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 40 40" fill="none" className={`${className}`} xmlns="http://www.w3.org/2000/svg">
    <circle cx="20" cy="20" r="14" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 4" />
    <circle cx="20" cy="20" r="6" stroke="currentColor" strokeWidth="1.5" />
    <line x1="20" y1="2" x2="20" y2="10" stroke="currentColor" strokeWidth="1.5" />
    <line x1="20" y1="30" x2="20" y2="38" stroke="currentColor" strokeWidth="1.5" />
    <line x1="2" y1="20" x2="10" y2="20" stroke="currentColor" strokeWidth="1.5" />
    <line x1="30" y1="20" x2="38" y2="20" stroke="currentColor" strokeWidth="1.5" />
  </svg>
);

const BulletHole = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 30 30" fill="none" className={`${className}`} xmlns="http://www.w3.org/2000/svg">
    <circle cx="15" cy="15" r="5" fill="currentColor" opacity="0.3" />
    <circle cx="15" cy="15" r="3" fill="currentColor" opacity="0.5" />
    <path d="M15 8l1-3M15 22l-1 3M8 15l-3-1M22 15l3 1M10 10l-2-2M20 20l2 2M10 20l-2 2M20 10l2-2" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity="0.3" />
  </svg>
);

export { DoodleUnderline, DoodleCircle, DoodleArrow, DoodleStar, DoodleSquiggle, DoodleBracket, WantedBadge, Crosshair, BulletHole };
