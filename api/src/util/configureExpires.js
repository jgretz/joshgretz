import {isDev} from '../services';

const maxExpires = (res, next) => {
  res.setHeader('Cache-Control', 'public, max-age=2592000');
  res.setHeader('Expires', new Date(Date.now() + 2592000000).toUTCString());

  next();
};

export default () => app => {
  if (isDev()) {
    return;
  }

  ['*.css', '*.js', '*.png'].forEach(pattern => {
    app.get(pattern, (req, res, next) => {
      maxExpires(res, next);
    });
  });

  app.get('/api/blog/map', (req, res, next) => {
    res.setHeader('Cache-Control', 'public, max-age=86400');
    res.setHeader('Expires', new Date(Date.now() + 86400000).toUTCString());

    next();
  });
};
