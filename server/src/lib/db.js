import { PrismaClient } from '@prisma/client';
import ENV from '../config/env.config.js';

const globalForPrisma = global;
const prisma = new PrismaClient();

if (ENV.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

export default prisma;
