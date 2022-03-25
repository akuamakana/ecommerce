import gCall from '@test_utils/gCall';
import prisma from '@utils/prisma';
import { testUser } from '@test_utils/testUser';

const getItemQuery = `
query GetItem($id: String!) {
  getItem(id: $id) {
    id
    name
    description
    price
    imageUrl
    quantity
  }
}
`;

describe('GetItem', () => {
  it('should return an item', async () => {
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
      source: getItemQuery,
      variableValues: {
        id: item.id,
      },
    });

    expect(item).toEqual(expect.objectContaining(data.data?.getItem));
  });
});
