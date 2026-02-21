const PlaygroundLogo = ({ className = "w-7 h-7" }: { className?: string }) => (
  <svg
    viewBox="0 0 40 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <g fill="currentColor">
      {/* Pinwheel blade — top-left, sweeping from top toward left */}
      <path d="M19 4C14 3 8 5.5 5.5 11C3.5 15 5.5 18 9 18C13 17.5 17 14 19.5 8.5C20.5 6 20.5 4.5 19 4Z" />
      {/* Pinwheel blade — top-right, sweeping from right toward top */}
      <path d="M36 19C37 14 34.5 8 29 5.5C25 3.5 22 5.5 22 9C22.5 13 26 17 31.5 19.5C34 20.5 35.5 20.5 36 19Z" />
      {/* Pinwheel blade — bottom-right, sweeping from bottom toward right */}
      <path d="M21 36C26 37 32 34.5 34.5 29C36.5 25 34.5 22 31 22C27 22.5 23 26 20.5 31.5C19.5 34 19.5 35.5 21 36Z" />
      {/* Pinwheel blade — bottom-left, sweeping from left toward bottom */}
      <path d="M4 21C3 26 5.5 32 11 34.5C15 36.5 18 34.5 18 31C17.5 27 14 23 8.5 20.5C6 19.5 4.5 19.5 4 21Z" />
      {/* Center dot */}
      <circle cx="14.5" cy="14.5" r="2.5" />
    </g>
  </svg>
);

export default PlaygroundLogo;
