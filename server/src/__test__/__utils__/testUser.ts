/* istanbul ignore file */
import prisma from '@utils/prisma';
import random from './random';
import argon2 from 'argon2';

interface UserData {
  email: string;
  username: string;
  password: string;
  firstName: string;
  lastName: string;
}

const randomUserData: UserData = {
  email: `${random()}@jest.com`,
  username: random(),
  password: random(),
  firstName: random(),
  lastName: random(),
};

export const testUser = async () => await prisma.user.findUnique({ where: { username: 'jest' } });

export const getTestUser = async (username: string = 'jest') => {
  await prisma.user.findUnique({ where: { username } });
};

export const createTestUser = async (data: UserData = randomUserData) => {
  const user = await prisma.user.create({
    data: {
      ...randomUserData,
      ...data,
      password: await argon2.hash(data.password),
    },
  });

  return user;
};
