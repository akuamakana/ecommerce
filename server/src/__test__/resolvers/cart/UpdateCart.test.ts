import gCall from '@test_utils/gCall';
import prisma from '@utils/prisma';
import { testUser } from '@test_utils/testUser';

const updateCartMutation = `
mutation UpdateCart($data: CartItemInput!) {
  updateCart(data: $data) {
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

describe('UpdateCart', () => {
  let item: any;
  let user: any;

  beforeAll(async () => {
    user = await testUser();
    item = await prisma.item.create({
      data: {
        name: 'test item',
        description: 'test description',
        price: 10,
        imageUrl: 'https://test.com',
        quantity: 10,
        createdBy: {
          connect: {
            id: user?.id,
          },
        },
      },
    });
  });

  afterEach(async () => {
    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        cart: {
          update: {
            items: {
              set: [],
            },
          },
        },
      },
    });
  });

  it('should add an item to cart with quantity 1', async () => {
    const data = await gCall({
      source: updateCartMutation,
      variableValues: {
        data: {
          itemId: item.id,
          quantity: 1,
        },
      },
      userId: user?.id,
    });
    console.log('🚀 ~ file: UpdateCart.test.ts ~ line 75 ~ it ~ data', JSON.stringify(data, null, 2));

    expect(data.data?.updateCart).toMatchObject(
      expect.objectContaining({
        items: [
          {
            id: expect.any(String),
            quantity: 1,
            itemId: item.id,
            item: {
              id: item.id,
              name: item.name,
              description: item.description,
              price: item.price,
              imageUrl: item.imageUrl,
              quantity: item.quantity,
            },
          },
        ],
      })
    );
  });
  it.todo('should add an item to cart with quantity 2');
  it.todo('should remove an item from cart');
  it.todo('should update an item quantity in cart');
  it.todo('should return cart if updated item is not in cart');
  it.todo('should return cart if item does not exist');
  it.todo('should fail if add to cart quantity > item quantity');
  it.todo('should fail if not logged in');
});
