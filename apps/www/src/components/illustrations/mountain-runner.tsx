interface MountainRunnerProps {
  className?: string;
}

export const MountainRunner = ({className}: MountainRunnerProps) => {
  return (
    <svg viewBox="0 0 400 350" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="skyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#e8dfd5" />
          <stop offset="100%" stopColor="#d5c4a1" />
        </linearGradient>
        <linearGradient id="mountainGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#8b7355" />
          <stop offset="100%" stopColor="#5d4e37" />
        </linearGradient>
      </defs>

      {/* Sun/glow */}
      <circle cx="320" cy="80" r="40" fill="#f5d5a8" opacity="0.6" />
      <circle cx="320" cy="80" r="25" fill="#f5c878" opacity="0.4" />

      {/* Far mountains */}
      <path
        d="M0 280 L80 180 L120 220 L180 140 L240 200 L280 120 L340 180 L400 160 L400 350 L0 350 Z"
        fill="#a08060"
        opacity="0.4"
      />

      {/* Mid mountains */}
      <path
        d="M0 300 L60 220 L100 260 L160 180 L220 240 L260 160 L320 220 L380 180 L400 200 L400 350 L0 350 Z"
        fill="#8b7355"
        opacity="0.6"
      />

      {/* Close mountains */}
      <path
        d="M0 320 L50 260 L90 290 L140 220 L200 280 L240 200 L300 260 L360 220 L400 250 L400 350 L0 350 Z"
        fill="url(#mountainGrad)"
      />

      {/* Trail/path */}
      <path
        d="M50 340 Q 100 320, 150 330 T 250 310 T 350 300"
        stroke="#c4a574"
        strokeWidth="3"
        strokeLinecap="round"
        strokeDasharray="8 4"
        fill="none"
      />

      {/* Runner silhouette */}
      <g transform="translate(100, 285) scale(0.8)">
        {/* Body */}
        <ellipse cx="25" cy="35" rx="8" ry="12" fill="#5d4e37" />
        {/* Head */}
        <circle cx="28" cy="18" r="8" fill="#5d4e37" />
        {/* Back leg */}
        <path d="M20 45 L10 70" stroke="#5d4e37" strokeWidth="5" strokeLinecap="round" />
        {/* Front leg */}
        <path d="M30 45 L50 60" stroke="#5d4e37" strokeWidth="5" strokeLinecap="round" />
        {/* Back arm */}
        <path d="M22 30 L5 40" stroke="#5d4e37" strokeWidth="4" strokeLinecap="round" />
        {/* Front arm */}
        <path d="M30 30 L50 25" stroke="#5d4e37" strokeWidth="4" strokeLinecap="round" />
      </g>
    </svg>
  );
};
