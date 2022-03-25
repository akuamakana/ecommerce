import { Prisma, PrismaClient } from '@prisma/client';
/* istanbul ignore next */
const logConfig: Prisma.LogLevel[] = process.env.NODE_ENV === 'test' ? [] : ['query', 'info', 'warn', 'error'];

const prisma = new PrismaClient({
  log: logConfig,
});

export default prisma;
