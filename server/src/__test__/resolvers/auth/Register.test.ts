import gCall from '@test_utils/gCall';

jest.mock('@utils/sendEmail', () => ({
  sendEmail: jest.fn(() => true),
}));

describe('Register', () => {
  const registerMutation = `
  mutation Register($input: RegisterInput!) {
    register(input: $input) {
      id
      username
      email
      firstName
      lastName
    }
  }
  `;

  const userData = {
    input: {
      email: 'jest@jest.com',
      username: 'jest',
      password: 'jest',
      firstName: 'jest',
      lastName: 'jest',
    },
  };

  it('creates a user', async () => {
    const data = await gCall({
      source: registerMutation,
      variableValues: userData,
    });

    expect(data).toEqual(
      expect.objectContaining({
        data: {
          register: {
            email: 'jest@jest.com',
            firstName: 'jest',
            lastName: 'jest',
            username: 'jest',
            id: expect.stringContaining('-'),
          },
        },
      })
    );
  });

  it('fails to create with duplicate email', async () => {
    const { errors } = await gCall({
      source: registerMutation,
      variableValues: {
        input: {
          email: 'jest@jest.com',
          username: 'jester',
          password: 'jest',
          firstName: 'jester',
          lastName: 'jest',
        },
      },
    });
    expect(errors![0].message).toBe('Argument Validation Error');
  });

  it('fails to create with duplicate username', async () => {
    const { errors } = await gCall({
      source: registerMutation,
      variableValues: {
        input: {
          email: 'jester@jest.com',
          username: 'jest',
          password: 'jest',
          firstName: 'jester',
          lastName: 'jest',
        },
      },
    });
    expect(errors![0].message).toBe('Argument Validation Error');
  });
});
