interface Props {
  className?: string;
}

export default function LogoMark({ className }: Props) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id="cs-badge" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
          <stop stopColor="#22d3ee" />
          <stop offset="1" stopColor="#2563eb" />
        </linearGradient>
        <linearGradient id="cs-gloss" x1="16" y1="1" x2="16" y2="18" gradientUnits="userSpaceOnUse">
          <stop stopColor="#ffffff" stopOpacity="0.3" />
          <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
      </defs>

      <rect x="1" y="1" width="30" height="30" rx="9" fill="url(#cs-badge)" />
      <rect x="1" y="1" width="30" height="30" rx="9" fill="url(#cs-gloss)" />

      <circle cx="14" cy="14" r="6.1" stroke="#0a0a0a" strokeWidth="2.4" />
      <path d="M18.4 18.4 23 23" stroke="#0a0a0a" strokeWidth="2.4" strokeLinecap="round" />
      <path
        d="M14 10.9c.3 1.8 1.3 2.8 3.1 3.1-1.8.3-2.8 1.3-3.1 3.1-.3-1.8-1.3-2.8-3.1-3.1 1.8-.3 2.8-1.3 3.1-3.1Z"
        fill="#0a0a0a"
      />
    </svg>
  );
}
