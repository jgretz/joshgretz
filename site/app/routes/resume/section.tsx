import {HasChildrenProps} from '~/Types';

export function Section({children}: HasChildrenProps) {
  return <div className="font-bold text-primary uppercase py-1">{children}</div>;
}
