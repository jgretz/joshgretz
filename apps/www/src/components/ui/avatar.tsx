import {cn} from '../../lib/styles';

interface AvatarProps {
  src: string;
  alt: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeClasses = {
  sm: 'w-16 h-16',
  md: 'w-[100px] h-[100px]',
  lg: 'w-[140px] h-[140px]',
};

const sizePixels = {
  sm: 64,
  md: 100,
  lg: 140,
};

export const Avatar = ({src, alt, size = 'lg', className}: AvatarProps) => {
  const pixels = sizePixels[size];

  return (
    <div
      className={cn(
        'overflow-hidden rounded-full border-4 border-warm-700 shadow-lg',
        sizeClasses[size],
        className,
      )}
      style={{width: pixels, height: pixels}}
    >
      <img
        src={src}
        alt={alt}
        width={pixels}
        height={pixels}
        className="h-full w-full object-cover object-center"
      />
    </div>
  );
};
