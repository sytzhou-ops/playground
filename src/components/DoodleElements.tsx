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

export { DoodleUnderline, DoodleCircle, DoodleArrow, DoodleStar, DoodleSquiggle, DoodleBracket };
