import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    domains: ['avatars.githubusercontent.com'],
    // Or use remotePatterns for more control (recommended):
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
        port: '',
        pathname: '/**',
      },
      // Add other domains you might use for user images
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com', // for Google OAuth
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'platform-lookaside.fbsbx.com', // for Facebook OAuth
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
