import {cn} from '../../lib/styles';

interface SocialLinkProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  className?: string;
}

export const SocialLink = ({href, icon, label, className}: SocialLinkProps) => {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className={cn(
        'flex h-10 w-10 items-center justify-center rounded-full bg-warm-700 text-xs text-warm-50 transition-colors hover:bg-warm-600',
        className,
      )}
    >
      {icon}
    </a>
  );
};
