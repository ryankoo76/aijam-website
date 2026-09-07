/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['cdn.gamma.app'],
  },
  async rewrites() {
    return {
      // "/" serves the 2026 results page (public/results-2026.html) while keeping
      // the URL as "/". The competition site moved to /competition.
      beforeFiles: [
        { source: '/', destination: '/results-2026.html' },
      ],
    };
  },
  async redirects() {
    return [
      // old bookmarks and links that meant the competition home
      { source: '/home', destination: '/competition', permanent: false },
    ];
  },
};

module.exports = nextConfig;
