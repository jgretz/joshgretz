import {cn} from '../../lib/styles';

interface StatBlockProps {
  value: string;
  label: string;
  className?: string;
}

export const StatBlock = ({value, label, className}: StatBlockProps) => {
  return (
    <div className={cn(className)}>
      <div className="font-serif text-2xl sm:text-3xl text-warm-700">{value}</div>
      <div className="font-sans text-sm text-warm-500">{label}</div>
    </div>
  );
};
