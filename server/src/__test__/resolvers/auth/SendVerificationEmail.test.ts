import gCall from '@test_utils/gCall';
import prisma from '@utils/prisma';

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
    const user = await prisma.user.upsert({
      where: {
        email: 'email@email.com',
      },
      update: {},
      create: {
        email: 'email@email.com',
        username: 'username',
        password: 'password',
        firstName: 'firstName',
        lastName: 'lastName',
      },
    });

    const data = await gCall({
      source: sendVerificationMutation,
      variableValues: {
        email: user.email,
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
