import { betterAuth } from 'better-auth';
import { deviceAuthorization } from 'better-auth/plugins';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import prisma from './db.js';
import ENV from '../config/env.config.js';

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),
  basePath: '/api/auth',
  trustedOrigins: [ENV.FRONTEND_URL],
  plugins: [
    deviceAuthorization({
      expiresIn: '30m',
      interval: '5s',
    }),
  ],
  socialProviders: {
    github: {
      clientId: ENV.GITHUB_CLIENT_ID,
      clientSecret: ENV.GITHUB_CLIENT_SECRET,
    },
  },
});
