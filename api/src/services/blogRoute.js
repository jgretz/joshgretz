import isDev from './isDev';

export default route => (isDev() ? `./src/blog/${route}` : `./blog/${route}`);
