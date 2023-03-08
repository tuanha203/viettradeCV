const { i18n } = require("./next-i18next.config.js");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  i18n,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.cssdemoco.com',
        port: '',
        pathname: '/public/files/**',
      },
    ],
  },
};

module.exports = nextConfig;
