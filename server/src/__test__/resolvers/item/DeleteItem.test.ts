import gCall from '@test_utils/gCall';
import prisma from '@utils/prisma';
import { testUser } from '@test_utils/testUser';

const deleteItemMutation = `
mutation DeleteItem($deleteItemId: String!) {
  deleteItem(id: $deleteItemId)
}
`;

describe('DeleteItem', () => {
  it('should delete an item', async () => {
    const user = await testUser();
    if (!user) return;

    const item = await prisma.item.create({
      data: {
        name: 'Xbox',
        description: 'Hot new gaming console!',
        price: 499.99,
        userId: user.id,
      },
    });

    const data = await gCall({
      source: deleteItemMutation,
      variableValues: {
        deleteItemId: item.id,
      },
    });

    expect(data.data?.deleteItem).toBe(true);
  });

  it.todo('should not delete if not authorized');
});
