import argon2 from 'argon2';
import gCall from '@test_utils/gCall';
import prisma from '@utils/prisma';
import random from '@test_utils/random';

const loginMutation = `
mutation Login($password: String!, $usernameOrEmail: String!) {
  login(password: $password, usernameOrEmail: $usernameOrEmail) {
    username
    email
  }
}
`;

const loginData = {
  password: 'jest',
  usernameOrEmail: 'jest',
};

describe('Login', () => {
  it('logs in a user with username', async () => {
    const data = await gCall({
      source: loginMutation,
      variableValues: loginData,
    });
    expect(data).toMatchObject({
      data: {
        login: {
          username: 'jest',
          email: 'jest@jest.com',
        },
      },
    });
  });

  it('logs in a user with email', async () => {
    const data = await gCall({
      source: loginMutation,
      variableValues: { ...loginData, usernameOrEmail: 'jest@jest.com' },
    });
    expect(data).toMatchObject({
      data: {
        login: {
          username: 'jest',
          email: 'jest@jest.com',
        },
      },
    });
  });

  it('fails with unmatched username/email', async () => {
    const data = await gCall({
      source: loginMutation,
      variableValues: { ...loginData, usernameOrEmail: 'random@random.com' },
    });

    expect(data).toMatchObject({ data: { login: null } });
  });

  it('fails to login with incorrect password', async () => {
    const data = await gCall({
      source: loginMutation,
      variableValues: { ...loginData, password: 'jest@jest.com' },
    });
    expect(data).toMatchObject({
      data: { login: null },
    });
  });

  it('fails to login with an unverified account', async () => {
    const randomEmail = `${random()}@test.com`;
    const hashedPassword = await argon2.hash('hasjlkczlj1');
    await prisma.user.create({
      data: {
        email: randomEmail,
        username: random(),
        firstName: 'test',
        lastName: 'test',
        password: hashedPassword,
      },
    });

    const data = await gCall({
      source: loginMutation,
      variableValues: {
        usernameOrEmail: randomEmail,
        password: 'hasjlkczlj1',
      },
    });

    expect(data.errors![0].message).toBe("Access denied! You don't have permission for this action!");
  });
});
