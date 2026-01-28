import {Slot} from '@radix-ui/react-slot';
import {type VariantProps, cva} from 'class-variance-authority';
import * as React from 'react';

import {cn} from '../../lib/styles';

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-full font-sans text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-warm-600 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-warm-700 text-warm-50 hover:bg-warm-600',
        destructive: 'bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90',
        outline: 'border-2 border-warm-700 bg-transparent text-warm-700 hover:bg-warm-700/10',
        secondary: 'bg-warm-200 text-warm-700 hover:bg-warm-300',
        ghost: 'hover:bg-warm-200 hover:text-warm-700',
        link: 'text-warm-600 underline-offset-4 hover:underline',
      },
      size: {
        default: 'px-6 py-3',
        sm: 'px-4 py-2 text-xs',
        lg: 'px-8 py-4',
        icon: 'h-9 w-9',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({className, variant, size, asChild = false, ...props}, ref) => {
    const Comp = asChild ? Slot : 'button';
    return <Comp className={cn(buttonVariants({variant, size, className}))} ref={ref} {...props} />;
  },
);
Button.displayName = 'Button';

export {Button, buttonVariants};
