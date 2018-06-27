import {isDev} from '../services';

export default () => app => {
  if (isDev()) {
    return;
  }

  app.get('/site/*', (req, res, next) => {
    res.setHeader('Cache-Control', 'public, max-age=2592000');
    res.setHeader('Expires', new Date(Date.now() + 2592000000).toUTCString());

    next();
  });
};
