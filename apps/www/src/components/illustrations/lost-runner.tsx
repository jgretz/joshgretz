interface LostRunnerProps {
  className?: string;
}

export const LostRunner = ({className}: LostRunnerProps) => {
  return (
    <svg viewBox="0 0 400 280" className={className} aria-hidden="true">
      {/* Mountain silhouettes in background */}
      <path
        d="M0 200 L60 140 L100 170 L160 100 L220 150 L260 90 L320 140 L380 110 L400 130 L400 280 L0 280 Z"
        fill="#d5c4a1"
        opacity="0.4"
      />
      <path
        d="M0 220 L80 160 L120 190 L180 130 L240 175 L300 120 L360 160 L400 140 L400 280 L0 280 Z"
        fill="#c4a574"
        opacity="0.3"
      />

      {/* Ground/horizon */}
      <ellipse cx="200" cy="250" rx="180" ry="20" fill="#d5c4a1" opacity="0.5" />

      {/* Trail that fades/disappears */}
      <path
        d="M50 250 Q 120 240, 150 245 T 220 240 T 280 242"
        stroke="#8b7355"
        strokeWidth="8"
        strokeLinecap="round"
        fill="none"
        opacity="0.6"
      />
      {/* Trail becoming dashed/fading */}
      <path
        d="M280 242 Q 310 240, 340 238"
        stroke="#8b7355"
        strokeWidth="6"
        strokeLinecap="round"
        strokeDasharray="12 8"
        fill="none"
        opacity="0.4"
      />
      <path
        d="M340 238 Q 360 235, 380 232"
        stroke="#8b7355"
        strokeWidth="4"
        strokeLinecap="round"
        strokeDasharray="6 10"
        fill="none"
        opacity="0.2"
      />

      {/* Question mark sign post */}
      <g transform="translate(300, 140)">
        {/* Post */}
        <rect x="0" y="0" width="8" height="110" fill="#5d4e37" rx="2" />
        {/* Sign board */}
        <rect
          x="-30"
          y="5"
          width="70"
          height="50"
          fill="#f5ebe0"
          stroke="#5d4e37"
          strokeWidth="3"
          rx="4"
        />
        {/* Question mark */}
        <text
          x="5"
          y="42"
          fontFamily="Libre Baskerville, serif"
          fontSize="32"
          fill="#8b5a2b"
          textAnchor="middle"
        >
          ?
        </text>
      </g>

      {/* Runner looking confused */}
      <g transform="translate(140, 160)">
        {/* Shadow */}
        <ellipse cx="25" cy="88" rx="20" ry="5" fill="#5d4e37" opacity="0.2" />

        {/* Body */}
        <ellipse cx="25" cy="50" rx="12" ry="18" fill="#5d4e37" />

        {/* Head - bald */}
        <circle cx="28" cy="22" r="14" fill="#e8c4a0" stroke="#5d4e37" strokeWidth="2" />

        {/* Subtle head shine for bald look */}
        <ellipse cx="24" cy="14" rx="6" ry="4" fill="#f5ebe0" opacity="0.5" />

        {/* Simple face - confused expression */}
        <circle cx="23" cy="20" r="2" fill="#5d4e37" />
        <circle cx="33" cy="20" r="2" fill="#5d4e37" />
        <path
          d="M24 28 Q 28 26, 32 28"
          stroke="#5d4e37"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
        />

        {/* Raised eyebrow */}
        <path
          d="M30 14 Q 34 11, 38 14"
          stroke="#5d4e37"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
        />

        {/* Legs - standing pose */}
        <path d="M20 66 L15 88" stroke="#5d4e37" strokeWidth="8" strokeLinecap="round" />
        <path d="M30 66 L35 88" stroke="#5d4e37" strokeWidth="8" strokeLinecap="round" />

        {/* Arms - one scratching head */}
        <path d="M15 45 L0 55" stroke="#5d4e37" strokeWidth="6" strokeLinecap="round" />
        <path d="M35 42 Q 50 30, 42 18" stroke="#5d4e37" strokeWidth="6" strokeLinecap="round" />

        {/* Headphones */}
        <path
          d="M14 22 Q 8 12, 14 4 Q 28 -4, 42 4 Q 48 12, 42 22"
          stroke="#3d3d3d"
          strokeWidth="4"
          fill="none"
        />
        <rect x="6" y="18" width="10" height="12" rx="3" fill="#3d3d3d" />
        <rect x="40" y="18" width="10" height="12" rx="3" fill="#3d3d3d" />
      </g>

      {/* Motion lines / dust to suggest momentum */}
      <g stroke="#c4a574" strokeWidth="2" strokeLinecap="round" opacity="0.5">
        <path d="M80 240 Q 95 238, 110 242" />
        <path d="M90 235 Q 105 232, 115 236" />
        <path d="M85 245 Q 100 244, 112 247" />
      </g>

      {/* Small dust clouds */}
      <g fill="#c4a574" opacity="0.5">
        <circle cx="100" cy="245" r="4" />
        <circle cx="90" cy="242" r="3" />
        <circle cx="108" cy="248" r="2.5" />
        <circle cx="82" cy="248" r="2" />
      </g>

      {/* Handwritten "wait... where?" annotation */}
      <text
        x="85"
        y="145"
        fontFamily="Caveat, cursive"
        fontSize="16"
        fill="#8b5a2b"
        transform="rotate(-8, 85, 145)"
      >
        wait... where?
      </text>
      <path
        d="M140 150 Q 150 160, 155 165"
        stroke="#8b5a2b"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
};
