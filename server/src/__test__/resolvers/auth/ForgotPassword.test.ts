import gCall from '@test_utils/gCall';

jest.mock('@utils/sendEmail', () => ({
  sendEmail: jest.fn(() => true),
}));

const forgotPasswordMutation = `
mutation ForgotPassword($email: String!) {
  forgotPassword(email: $email)
}
`;

describe('ForgotPassword', () => {
  it('should not find user by email', async () => {
    const data = await gCall({
      source: forgotPasswordMutation,
      variableValues: {
        email: 'test@gmail.com',
      },
    });
    expect(data.data?.forgotPassword).toBe('An email has been sent to the requested email with a reset password link. This link will expire in 24 hours.');
  });

  it('should send email to user', async () => {
    const data = await gCall({
      source: forgotPasswordMutation,
      variableValues: {
        email: 'jest@jest.com',
      },
    });
    expect(data.data?.forgotPassword).toBe('An email has been sent to the requested email with a reset password link. This link will expire in 24 hours.');
  });
});
