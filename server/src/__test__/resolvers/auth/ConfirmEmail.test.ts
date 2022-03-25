import redis from '@utils/redis';
import gCall from '@test_utils/gCall';
import prisma from '@utils/prisma';

const confirmEmailMutation = `
mutation Mutation {
  confirmEmail
}
`;

describe('ConfirmEmail', () => {
  it('should return true if account is not verified', async () => {
    await redis.set('1', 'jest@jest.com');
    const data = await gCall({
      source: confirmEmailMutation,
      headers: {
        authorization: '1',
        email: 'jest@jest.com',
      },
    });

    expect(data?.data?.confirmEmail).toBeTruthy();
    const user = await prisma.user.findUnique({ where: { email: 'jest@jest.com' } });
    expect(user?.verified).toBeTruthy();
  });

  it('should return false if no headers sent', async () => {
    const data = await gCall({
      source: confirmEmailMutation,
      headers: {
        authorization: null,
        email: null,
      },
    });

    expect(data.data?.confirmEmail).toBeFalsy();
  });

  it('should return false if token does not exist', async () => {
    await redis.set('1', 'jest@jest.com');
    const data = await gCall({
      source: confirmEmailMutation,
      headers: {
        authorization: '1',
        email: 'test@test.com',
      },
    });

    expect(data.data?.confirmEmail).toBeFalsy();
  });
});
