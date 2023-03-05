/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable @typescript-eslint/no-var-requires */
const runtimeCaching = require('next-pwa/cache');
const withPWA = require('next-pwa')({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development', // 👈 DISABLING PWA IN DEVELOPMENT MODE
  register: true,
  skipWaiting: true,
  runtimeCaching,
});

/* GITHUB PAGES */
const isGithubActions = process.env.GITHUB_ACTIONS || false;

let assetPrefix;
let basePath;

if (isGithubActions) {
  const repository = process.env.GITHUB_REPOSITORY.replace(/.*?\//, '');
  assetPrefix = `/${repository}/`;
  basePath = `/${repository}`;
}

const nextConfig = withPWA({
  assetPrefix,
  basePath,
  env: {
    BASE_PATH: basePath || '',
  },
  reactStrictMode: false, // 👈 DISABLING THIS TO AVOID DOUBLE RENDER
});

module.exports = nextConfig;
