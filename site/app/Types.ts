import {ReactNode} from 'react';

export type HasChildrenProps = {
  children: ReactNode;
};

export interface User {
  id: number;
  email: string;
  admin: boolean;
}
