import prisma from '@utils/prisma';
import gCall from '@test_utils/gCall';

describe('Me', () => {
  const loginMutation = `
  mutation Login($password: String!, $usernameOrEmail: String!) {
    login(password: $password, usernameOrEmail: $usernameOrEmail) {
      id
    }
  }
  `;

  const meQuery = `
  query Me {
    me {
      id
      username
      email
    }
  }
  `;

  it('gets logged in user', async () => {
    const user = await prisma.user.findUnique({ where: { username: 'jest' } });
    await gCall({
      source: loginMutation,
      variableValues: {
        usernameOrEmail: 'jest',
        password: 'jest',
      },
    });
    const data = await gCall({
      source: meQuery,
      userId: user?.id,
    });

    expect(data).toMatchObject({
      data: {
        me: {
          username: 'jest',
          email: 'jest@jest.com',
          id: expect.any(String),
        },
      },
    });
  });

  it('gets null', async () => {
    const data = await gCall({
      source: meQuery,
    });
    expect(data).toMatchObject({ data: { me: null } });
  });
});

