import gCall from '@test_utils/gCall';
import prisma from '@utils/prisma';
import { testUser } from '@test_utils/testUser';
import { User } from '@models/User';

const test = `
query Query {
  test
}
`;
const testManager = `
query Query {
  testManager
}
`;

// const testAdmin = `
// query Query {
//   testAdmin
// }
// `;

describe('customAuthChecker', () => {
  let user: User | null;
  beforeAll(async () => {
    user = await testUser();
  });

  it('should trigger if not logged in', async () => {
    const data = await gCall({
      source: test,
    });

    expect(data).toMatchObject({
      data: null,
      errors: [
        {
          message: "Access denied! You don't have permission for this action!",
        },
      ],
    });
  });

  it('should fail for user with role user', async () => {
    let data;
    data = await gCall({
      source: testManager,
      userId: user?.id,
    });

    expect(data.data?.testManager).toBe('testManager');

    await prisma.user.update({
      where: {
        email: user?.email,
      },
      data: {
        role: 'USER',
      },
    });

    data = await gCall({
      source: testManager,
      userId: user?.id,
    });

    expect(data).toMatchObject({
      data: null,
      errors: [
        {
          message: "Access denied! You don't have permission for this action!",
        },
      ],
    });
  });
});
