import gCall from '@test_utils/gCall';
import random from '@test_utils/random';

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
      email: `${random()}@jest.com`,
      username: random(),
      password: random(),
      firstName: random(),
      lastName: random(),
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
            email: userData.input.email,
            firstName: userData.input.firstName,
            lastName: userData.input.lastName,
            username: userData.input.username,
            id: expect.any(String),
          },
        },
      })
    );
  });

  it('fails to create with duplicate email', async () => {
    const data = await gCall({
      source: registerMutation,
      variableValues: {
        input: {
          ...userData.input,
          username: random(),
        },
      },
    });

    expect(data).toMatchObject({
      data: null,
      errors: [
        {
          message: 'Argument Validation Error',
        },
      ],
    });
  });

  it('fails to create with duplicate username', async () => {
    const { errors } = await gCall({
      source: registerMutation,
      variableValues: {
        input: {
          ...userData.input,
          email: `${random()}@jest.com`,
        },
      },
    });

    expect(errors![0].message).toBe('Argument Validation Error');
  });
});
