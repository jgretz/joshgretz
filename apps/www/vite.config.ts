import {tanstackStart} from '@tanstack/react-start/plugin/vite';
import react from '@vitejs/plugin-react';
import {defineConfig} from 'vite';
import tsConfigPaths from 'vite-tsconfig-paths';
import {fetchSitemapResponse} from './src/lib/sitemap';

export default defineConfig({
  server: {port: 3000},
  plugins: [
    {
      name: 'sitemap',
      configureServer(server) {
        server.middlewares.use('/api/sitemap', async (_req, res) => {
          const response = await fetchSitemapResponse();
          res.setHeader('Content-Type', 'application/xml');
          res.setHeader('Cache-Control', 'public, max-age=3600');
          res.end(await response.text());
        });
      },
    },
    tsConfigPaths({ignoreConfigErrors: true}),
    // @ts-expect-error - customViteReactPlugin prevents infinite vite.config.timestamp files
    tanstackStart({customViteReactPlugin: true}),
    react(),
  ],
});
