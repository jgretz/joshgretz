import { type HasChildrenProps } from '~/Types.tsx';

export function Section({ children }: HasChildrenProps) {
  return <div className="py-1 font-bold uppercase text-primary">{children}</div>;
}
