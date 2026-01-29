import {redirect} from '@tanstack/react-router';
import {isAuthenticated} from './auth-service';

export const requireAuth = ({location}: {location: {href: string}}) => {
  if (!isAuthenticated()) {
    throw redirect({
      to: '/admin/login',
      search: {
        redirect: location.href,
      },
    });
  }
};
