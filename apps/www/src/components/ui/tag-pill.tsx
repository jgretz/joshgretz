import {cn} from '../../lib/styles';

interface TagPillProps {
  children: React.ReactNode;
  className?: string;
}

export const TagPill = ({children, className}: TagPillProps) => {
  return (
    <span
      className={cn(
        'rounded-full border-2 border-warm-600 bg-white/50 px-4 py-2 font-sans text-sm text-warm-700',
        className,
      )}
    >
      {children}
    </span>
  );
};
