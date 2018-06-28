import {isDev} from '../services';

export default () => app => {
  if (isDev()) {
    return;
  }

  app.get('*.css', (req, res, next) => {
    res.setHeader('Cache-Control', 'public, max-age=2592000');
    res.setHeader('Expires', new Date(Date.now() + 2592000000).toUTCString());

    next();
  });

  app.get('*.js', (req, res, next) => {
    res.setHeader('Cache-Control', 'public, max-age=2592000');
    res.setHeader('Expires', new Date(Date.now() + 2592000000).toUTCString());

    next();
  });

  app.get('/api/blog/map', (req, res, next) => {
    res.setHeader('Cache-Control', 'public, max-age=86400');
    res.setHeader('Expires', new Date(Date.now() + 86400000).toUTCString());

    next();
  });
};
