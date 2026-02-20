const PlaygroundLogo = ({ className = "w-7 h-7" }: { className?: string }) => (
  <svg
    viewBox="0 0 40 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    {/* Rounded square background with gradient */}
    <defs>
      <linearGradient id="pg-bg" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
        <stop stopColor="hsl(270, 95%, 65%)" />
        <stop offset="1" stopColor="hsl(200, 95%, 55%)" />
      </linearGradient>
      <linearGradient id="pg-accent" x1="14" y1="10" x2="30" y2="34" gradientUnits="userSpaceOnUse">
        <stop stopColor="white" stopOpacity="0.95" />
        <stop offset="1" stopColor="white" stopOpacity="0.7" />
      </linearGradient>
    </defs>

    <rect width="40" height="40" rx="10" fill="url(#pg-bg)" />

    {/* Play triangle — the "playground" symbol */}
    <path
      d="M16 12L30 20L16 28V12Z"
      fill="url(#pg-accent)"
    />

    {/* Small dot — the "." in playground.ai */}
    <circle cx="13" cy="31" r="2" fill="white" opacity="0.8" />
  </svg>
);

export default PlaygroundLogo;
