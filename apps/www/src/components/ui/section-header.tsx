import {cn} from '../../lib/styles';

interface SectionHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export const SectionHeader = ({children, className}: SectionHeaderProps) => {
  return (
    <h2
      className={cn(
        'mb-6 font-sans text-sm font-medium uppercase tracking-widest text-warm-600',
        className,
      )}
    >
      {children}
    </h2>
  );
};
