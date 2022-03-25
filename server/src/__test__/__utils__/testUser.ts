import prisma from '@utils/prisma';

export const testUser = async () => await prisma.user.findUnique({ where: { username: 'jest' } });
