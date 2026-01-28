import {redirect} from '@tanstack/react-router';
import {isAuthenticated} from './auth-service';

export const requireAuth = ({location}: {location: {href: string}}) => {
  // Skip auth check during SSR - let client handle it
  if (typeof document === 'undefined') {
    return;
  }

  if (!isAuthenticated()) {
    throw redirect({
      to: '/admin/login',
      search: {
        redirect: location.href,
      },
    });
  }
};
