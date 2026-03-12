import * as DialogPrimitive from '@radix-ui/react-dialog';
import {type ComponentPropsWithoutRef, type ElementRef, forwardRef} from 'react';
import {cn} from '../../lib/styles';

export const Dialog = DialogPrimitive.Root;
export const DialogTrigger = DialogPrimitive.Trigger;
export const DialogClose = DialogPrimitive.Close;

export const DialogContent = forwardRef<
  ElementRef<typeof DialogPrimitive.Content>,
  ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(function DialogContent({className, children, ...props}, ref) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/50" />
      <DialogPrimitive.Content
        ref={ref}
        className={cn(
          'fixed left-1/2 top-1/2 z-50 w-full max-w-2xl -translate-x-1/2 -translate-y-1/2 rounded-lg border border-warm-200 bg-white p-6 shadow-lg',
          'max-h-[85vh] overflow-y-auto',
          className,
        )}
        {...props}
      >
        {children}
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
});

export const DialogHeader = ({className, ...props}: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('mb-4 flex flex-col space-y-1.5', className)} {...props} />
);

export const DialogTitle = forwardRef<
  ElementRef<typeof DialogPrimitive.Title>,
  ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(function DialogTitle({className, ...props}, ref) {
  return (
    <DialogPrimitive.Title
      ref={ref}
      className={cn('font-serif text-xl text-warm-800', className)}
      {...props}
    />
  );
});
