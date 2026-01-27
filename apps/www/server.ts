const SERVER_PORT = Number(process.env.PORT ?? 3000);

const handler = (await import('./dist/server/server.js')).default;

Bun.serve({
  port: SERVER_PORT,
  fetch: handler.fetch,
});

console.log(`Server running on http://localhost:${SERVER_PORT}`);
