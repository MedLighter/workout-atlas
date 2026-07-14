function resolveBasePath() {
  const fromEnv = process.env.EXPO_BASE_PATH?.trim();
  if (fromEnv) {
    return `/${fromEnv.replace(/^\/+|\/+$/g, '')}`;
  }

  if (process.env.GITHUB_PAGES === 'true') {
    return '/workout-atlas';
  }

  return '';
}

const basePath = resolveBasePath();

/** @type {import('workbox-build').GenerateSWOptions} */
module.exports = {
  globDirectory: 'dist/',
  globPatterns: ['**/*.{js,html,css,ico,json,png,woff2,ttf,svg}'],
  swDest: 'dist/sw.js',
  clientsClaim: true,
  skipWaiting: true,
  maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
  ...(basePath
    ? {
        modifyURLPrefix: {
          '': basePath,
        },
        navigateFallback: `${basePath}/index.html`,
        navigateFallbackDenylist: [/^\/_/, /\/[^/?]+\.[^/]+$/],
      }
    : {}),
};