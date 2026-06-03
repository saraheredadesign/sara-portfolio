import { defineConfig } from 'vite';

function rewriteTestRoute() {
  return {
    name: 'rewrite-test-route',
    configureServer(server) {
      server.middlewares.use((req, _res, next) => {
        if (!req.url) {
          next();
          return;
        }

        const [pathname, search = ''] = req.url.split('?', 2);

        if (pathname === '/test' || pathname === '/test/') {
          req.url = `/test.html${search ? `?${search}` : ''}`;
        }

        next();
      });
    },
    configurePreviewServer(server) {
      server.middlewares.use((req, _res, next) => {
        if (!req.url) {
          next();
          return;
        }

        const [pathname, search = ''] = req.url.split('?', 2);

        if (pathname === '/test' || pathname === '/test/') {
          req.url = `/test.html${search ? `?${search}` : ''}`;
        }

        next();
      });
    },
  };
}

export default defineConfig({
  plugins: [rewriteTestRoute()],
});
