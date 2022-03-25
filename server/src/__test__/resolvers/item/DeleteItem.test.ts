import gCall from '@test_utils/gCall';
import prisma from '@utils/prisma';
import { testUser } from '@test_utils/testUser';
import { User } from '@models/User';

const deleteItemMutation = `
mutation DeleteItem($deleteItemId: String!) {
  deleteItem(id: $deleteItemId)
}
`;

describe('DeleteItem', () => {
  let user: User | null;
  beforeAll(async () => {
    user = await testUser();
  });
  it('should delete an item', async () => {
    const item = await prisma.item.create({
      data: {
        name: 'Xbox',
        description: 'Hot new gaming console!',
        price: 499.99,
        userId: user!.id,
      },
    });

    const data = await gCall({
      source: deleteItemMutation,
      variableValues: {
        deleteItemId: item.id,
      },
      userId: user!.id,
    });

    expect(data.data?.deleteItem).toBe(true);
  });

  it('should not delete if not authorized', async () => {
    const item = await prisma.item.create({
      data: {
        name: 'Xbox',
        description: 'Hot new gaming console!',
        price: 499.99,
        userId: user!.id,
      },
    });

    const data = await gCall({
      source: deleteItemMutation,
      variableValues: {
        deleteItemId: item.id,
      },
    });

    expect(data.errors![0].message).toBe("Access denied! You don't have permission for this action!");
  });
});
