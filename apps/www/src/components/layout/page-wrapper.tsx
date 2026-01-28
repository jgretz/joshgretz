import {type PropsWithChildren} from 'react';
import {cn} from '../../lib/styles';

interface PageWrapperProps extends PropsWithChildren {
  className?: string;
  maxWidth?: 'md' | 'lg' | 'xl' | '2xl' | '4xl' | '5xl';
}

const maxWidthClasses = {
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  '2xl': 'max-w-2xl',
  '4xl': 'max-w-4xl',
  '5xl': 'max-w-5xl',
};

export const PageWrapper = ({children, className, maxWidth = '5xl'}: PageWrapperProps) => {
  return (
    <main className={cn('mx-auto px-6 pb-16 pt-28 md:px-12', maxWidthClasses[maxWidth], className)}>
      {children}
    </main>
  );
};
