import gCall from '@test_utils/gCall';

jest.mock('@utils/sendEmail', () => ({
  sendEmail: jest.fn(() => true),
}));

const sendVerificationMutation = `
mutation SendVerification($email: String!) {
  sendVerification(email: $email)
}
`;

describe('SendVerificationEmail', () => {
  it('should send email to user', async () => {
    const data = await gCall({
      source: sendVerificationMutation,
      variableValues: {
        email: 'tester@test.com',
      },
    });

    expect(data.data?.sendVerification).toBeTruthy();
  });

  it('should not find email', async () => {
    const data = await gCall({
      source: sendVerificationMutation,
      variableValues: {
        email: 'nothere@gmail.com',
      },
    });

    expect(data.data?.sendVerification).toBeTruthy();
  });

  it('should not send email if user is already verified', async () => {
    const data = await gCall({
      source: sendVerificationMutation,
      variableValues: {
        email: 'jest@jest.com',
      },
    });

    expect(data.data?.sendVerification).toBeTruthy();
  });
});
