import { spawnSync } from 'node:child_process';

const env = {
  ...process.env,
  GITHUB_PAGES: 'true',
  EXPO_BASE_PATH: process.env.EXPO_BASE_PATH ?? 'workout-atlas',
};

function run(command, args) {
  const result = spawnSync(command, args, {
    stdio: 'inherit',
    shell: true,
    env,
  });

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

run('npx', ['expo', 'export', '-p', 'web']);
run('npx', ['workbox', 'generateSW', 'workbox-config.js']);
run('node', ['scripts/prepare-github-pages.mjs']);