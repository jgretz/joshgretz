import {Outlet, createFileRoute} from '@tanstack/react-router';
import {getServerSession} from '../../services/auth/auth-server';
import type {User} from '../../services/auth/types';

export type AdminRouteContext = {
  user: User | null;
};

export const Route = createFileRoute('/admin')({
  beforeLoad: async () => {
    const user = await getServerSession();
    return {user};
  },
  component: () => <Outlet />,
});
