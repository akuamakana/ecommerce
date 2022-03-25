import gCall from '@test_utils/gCall';

const logoutMutation = `
mutation Logout {
  logout
}
`;

describe('Logout', () => {
  it('logs out user', async () => {
    const data = await gCall({
      source: logoutMutation,
    });
    expect(data).toMatchObject({
      data: {
        logout: true,
      },
    });
  });
});
