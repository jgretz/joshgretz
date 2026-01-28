interface UnderlineProps {
  className?: string;
}

export const Underline = ({className}: UnderlineProps) => {
  return (
    <svg viewBox="0 0 200 12" className={className} fill="none" aria-hidden="true">
      <path
        d="M5 8 Q 50 2, 100 7 T 195 6"
        stroke="#c4a574"
        strokeWidth="3"
        strokeLinecap="round"
        opacity="0.6"
      />
    </svg>
  );
};
