import {redirect} from '@tanstack/react-router';
import type {User} from './types';

export const requireAuth = ({
  context,
  location,
}: {
  context: {user: User | null};
  location: {href: string};
}) => {
  if (!context.user || !context.user.admin) {
    throw redirect({
      to: '/admin/login',
      search: {
        redirect: location.href,
      },
    });
  }
};
