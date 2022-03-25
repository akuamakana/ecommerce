import gCall from '@test_utils/gCall';
import { User } from './../../../models/User';
import { Item } from './../../../models/Item';
import prisma from '@utils/prisma';
import { testUser } from '@test_utils/testUser';

const updateItemMutation = `
mutation UpdateItem($updateItemId: String!, $data: CreateItemInput!) {
  updateItem(id: $updateItemId, data: $data) {
    id
    name
    description
    price
    quantity
    imageUrl
  }
}
`;

describe('UpdateItem', () => {
  let item: Item;
  let user: User | null;

  beforeAll(async () => {
    user = await testUser();
    if (!user) return;
    item = await prisma.item.create({
      data: {
        name: 'Xbox',
        description: 'Hot new gaming console!',
        price: 499.99,
        userId: user.id,
      },
    });
  });

  it('should update an item', async () => {
    const data = await gCall({
      source: updateItemMutation,
      variableValues: {
        updateItemId: item.id,
        data: {
          name: 'Playstation',
          description: 'Hot new gaming console!',
          price: 499.99,
          quantity: 1,
        },
      },
    });

    expect(data.data?.updateItem).toEqual(
      expect.objectContaining({
        id: item.id,
        name: 'Playstation',
        description: 'Hot new gaming console!',
        price: 499.99,
        quantity: 1,
      })
    );
  });

  it('should fail if no name is provided', async () => {
    const data = await gCall({
      source: updateItemMutation,
      variableValues: {
        updateItemId: item.id,
        data: {
          name: '',
          description: 'Hot new gaming console!',
          price: 499.99,
          quantity: 1,
        },
      },
    });

    expect(data).toMatchObject({
      data: {
        updateItem: null,
      },
      errors: [
        {
          message: 'Argument Validation Error',
        },
      ],
    });
  });

  it('should fail if price is negative', async () => {
    const data = await gCall({
      source: updateItemMutation,
      variableValues: {
        updateItemId: item.id,
        data: {
          name: 'Playstation',
          description: 'Hot new gaming console!',
          price: -1,
          quantity: 1,
        },
      },
    });

    expect(data).toMatchObject({
      data: {
        updateItem: null,
      },
      errors: [
        {
          message: 'Argument Validation Error',
        },
      ],
    });
  });

  it.todo('should not update if not authorized');
});
