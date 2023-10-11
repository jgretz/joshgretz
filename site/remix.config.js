import {flatRoutes} from 'remix-flat-routes';

export default {
  ignoredRouteFiles: ['**/.*'],
  routes: async (defineRoutes) => {
    return flatRoutes('routes', defineRoutes);
  },

  tailwind: true,
  postcss: true,

  watchPaths: ['./tailwind.config.ts'],
};
