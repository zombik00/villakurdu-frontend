import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '*.digitaloceanspaces.com' },
    ]
  },
  async rewrites() {
    return process.env.NODE_ENV === 'development' ? [{
      source: '/api/:path*',
      destination: 'http://localhost:8000/api/:path*'
    }] : [];
  }
};

export default withNextIntl(nextConfig);
