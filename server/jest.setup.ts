import prisma from './src/utils/prisma';
import 'reflect-metadata';
import argon2 from 'argon2';

const userData = {
  input: {
    email: 'jest@jest.com',
    username: 'jest',
    password: 'jest',
    firstName: 'jest',
    lastName: 'jest',
  },
};

const main = async () => {
  await prisma.user.upsert({
    where: {
      email: userData.input.email,
    },
    update: {
      password: await argon2.hash(userData.input.password),
    },
    create: {
      ...userData.input,
      password: await argon2.hash(userData.input.password),
    },
  });
};

main().catch((e) => console.error(e));
