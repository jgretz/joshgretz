import type {ReactNode} from 'react';

interface Props {
  children: ReactNode;
}

export default function Page({children}: Props) {
  return (
    <div className="p-5 min-h-screen w-full max-w-7xl sm:flex sm:flex-col sm:justify-center">
      {children}
    </div>
  );
}
