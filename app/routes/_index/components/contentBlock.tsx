import { type HasChildrenProps } from '~/Types.ts';

export default function ContentBlock({ children }: HasChildrenProps) {
  return <div className="my-2">{children}</div>;
}
