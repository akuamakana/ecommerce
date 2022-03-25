import gCall from '@test_utils/gCall';
import redis from '@utils/redis';

const resetPasswordMutation = `
mutation Mutation($password: PasswordInput!) {
  resetPassword(password: $password)
}
`;

describe('ResetPassword', () => {
  it('should return false if token not found', async () => {
    const data = await gCall({
      source: resetPasswordMutation,
      variableValues: {
        password: {
          password: 'PASSWORD',
        },
      },
    });

    expect(data.data?.resetPassword).toBeFalsy();
  });

  it('should error if password not long enough', async () => {
    const data = await gCall({
      source: resetPasswordMutation,
      variableValues: {
        password: {
          password: '',
        },
      },
    });
    expect(data.errors![0].message).toBe('Argument Validation Error');
  });

  it('should return false if auth token != email', async () => {
    await redis.set('1', 'jest@gmail.com');
    const data = await gCall({
      source: resetPasswordMutation,
      variableValues: {
        password: {
          password: 'PASSWORD',
        },
      },
      headers: {
        authorization: '1',
        email: 'jest@hotmail.com',
      },
    });

    expect(data.data?.resetPassword).toBeFalsy();
  });

  it('should reset password', async () => {
    await redis.set('1', 'jest@jest.com');
    const data = await gCall({
      source: resetPasswordMutation,
      variableValues: {
        password: {
          password: 'PASSWORD',
        },
      },
      headers: {
        authorization: '1',
        email: 'jest@jest.com',
      },
    });

    expect(data.data?.resetPassword).toBeTruthy();
  });
});
