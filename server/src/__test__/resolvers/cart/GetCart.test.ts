import { User } from '@models/User';
import gCall from '@test_utils/gCall';
import { testUser } from '@test_utils/testUser';
import { UserCart } from '@lib/UserCart';
import prisma from '@utils/prisma';
import { Item } from '@models/Item';

const getCartQuery = `
query GetCart {
  getCart {
    items {
      id
      quantity
      itemId
      item {
        id
        name
        description
        price
        imageUrl
        quantity
      }
    }
  }
}
`;

describe('GetCart', () => {
  let user: User | null;
  let item: Item | null;

  beforeAll(async () => {
    // TODO: use a different user
    user = await testUser();
    item = await prisma.item.create({
      data: {
        name: 'get item',
        description: 'get description',
        price: 10,
        imageUrl: 'https://get.com',
        quantity: 10,
        createdBy: {
          connect: {
            id: user?.id,
          },
        },
      },
    });
  });

  it('should return cart', async () => {
    const data = await gCall({
      source: getCartQuery,
      userId: user?.id,
    });

    expect(data.data?.getCart).toBeNull();
  });

  it('should return cart with items in it', async () => {
    const cart = new UserCart(user!.id);
    await cart.update(item!.id, 1);
    const data = await gCall({
      source: getCartQuery,
      userId: user!.id,
    });

    expect(data.data?.getCart).toMatchObject(
      expect.objectContaining({
        items: [
          {
            id: expect.any(String),
            quantity: 1,
            itemId: item!.id,
            item: {
              id: item!.id,
              name: item!.name,
              description: item!.description,
              price: item!.price,
              imageUrl: item!.imageUrl,
              quantity: item!.quantity,
            },
          },
        ],
      })
    );
  });

  it('should return error if not logged in', async () => {
    const data = await gCall({
      source: getCartQuery,
    });

    expect(data).toMatchObject({
      data: {
        getCart: null,
      },
      errors: [
        {
          message: "Access denied! You don't have permission for this action!",
        },
      ],
    });
  });
});
