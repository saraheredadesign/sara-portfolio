import { defineConfig } from 'vite';
import { resolve } from 'node:path';

const truffleRedirectPaths = new Set([
  '/projects/truffle',
  '/project-truffle',
  '/project-truffle.html',
  '/project-truffle-draft',
  '/project-truffle-draft.html',
  '/truffle-product-case-study',
  '/truffle-product-case-study.html',
  '/project-truffle-brand-identity-ui-system',
  '/project-truffle-brand-identity-ui-system.html',
]);

function handlePortfolioRoute(req, res, next) {
  if (!req.url) {
    next();
    return;
  }

  const [pathname, search = ''] = req.url.split('?', 2);

  if (truffleRedirectPaths.has(pathname) || pathname.startsWith('/projects/truffle-final-preview/')) {
    res.statusCode = 308;
    res.setHeader('Location', `/projects/truffle/${search ? `?${search}` : ''}`);
    res.end();
    return;
  }

  if (pathname === '/projects/truffle-final-preview') {
    res.statusCode = 308;
    res.setHeader('Location', `/projects/truffle/${search ? `?${search}` : ''}`);
    res.end();
    return;
  }

  if (pathname === '/test' || pathname === '/test/') {
    req.url = `/test.html${search ? `?${search}` : ''}`;
  }

  next();
}

function rewriteTestRoute() {
  return {
    name: 'portfolio-local-routes',
    configureServer(server) {
      server.middlewares.use(handlePortfolioRoute);
    },
    configurePreviewServer(server) {
      server.middlewares.use(handlePortfolioRoute);
    },
  };
}

export default defineConfig({
  plugins: [rewriteTestRoute()],
  build: {
    rollupOptions: {
      input: [
        resolve(import.meta.dirname, 'index.html'),
        resolve(import.meta.dirname, 'about.html'),
        resolve(import.meta.dirname, 'projects.html'),
        resolve(import.meta.dirname, 'my-projects.html'),
        resolve(import.meta.dirname, 'project-campaign-shark.html'),
        resolve(import.meta.dirname, 'project-flexee.html'),
        resolve(import.meta.dirname, 'project-moveit.html'),
        resolve(import.meta.dirname, 'project-schultz-studios.html'),
        resolve(import.meta.dirname, 'test.html'),
        resolve(import.meta.dirname, 'projects/truffle/index.html'),
      ],
    },
  },
});
