/**
 * PM2 ecosystem configuration for VillaKurdu Frontend (Next.js).
 *
 * Usage:
 *   pm2 start ecosystem.config.js --env staging
 *   pm2 start ecosystem.config.js --env production
 */

module.exports = {
  apps: [
    {
      name: "villakurdu-frontend",
      script: "node_modules/.bin/next",
      args: "start -p 3000",
      cwd: __dirname,
      instances: 1,
      exec_mode: "fork",
      autorestart: true,
      watch: false,
      max_memory_restart: "512M",
      env_staging: {
        NODE_ENV: "production",
        PORT: 3000,
      },
      env_production: {
        NODE_ENV: "production",
        PORT: 3000,
      },
    },
  ],
};
