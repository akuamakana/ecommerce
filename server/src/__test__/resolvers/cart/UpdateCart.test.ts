import gCall from '@test_utils/gCall';
import prisma from '@utils/prisma';
import { testUser } from '@test_utils/testUser';
import { User } from '@models/User';
import { Item } from '@models/Item';

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

const resetCart = async (user: User) => {
  await prisma.user.update({
    where: {
      id: user!.id,
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
};

describe('UpdateCart', () => {
  let user: User | null;
  let item: Item | null;

  beforeAll(async () => {
    user = await testUser();
    await resetCart(user!);

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

  afterAll(async () => {
    await resetCart(user!);
  });

  it('should add an item to cart with quantity 1', async () => {
    const data = await gCall({
      source: updateCartMutation,
      variableValues: {
        data: {
          itemId: item!.id,
          quantity: 1,
        },
      },
      userId: user?.id,
    });

    expect(data.data?.updateCart).toMatchObject(
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

  it('should update an item quantity in cart', async () => {
    const data = await gCall({
      source: updateCartMutation,
      variableValues: {
        data: {
          itemId: item!.id,
          quantity: 2,
        },
      },
      userId: user?.id,
    });

    expect(data.data?.updateCart).toMatchObject(
      expect.objectContaining({
        items: [
          {
            id: expect.any(String),
            quantity: 2,
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

  it('should return error message if item does not exist in inventory/cart', async () => {
    const data = await gCall({
      source: updateCartMutation,
      variableValues: {
        data: {
          itemId: 'not in cart',
          quantity: 2,
        },
      },
      userId: user?.id,
    });

    expect(data).toMatchObject({
      data: {
        updateCart: null,
      },
      errors: [
        {
          message: 'Not enough items in stock',
        },
      ],
    });
  });

  it('should remove an item from cart', async () => {
    let data: any;
    data = await gCall({
      source: updateCartMutation,
      variableValues: {
        data: {
          itemId: item!.id,
          quantity: 1,
        },
      },
      userId: user?.id,
    });

    expect(data.data?.updateCart).toMatchObject(
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

    data = await gCall({
      source: updateCartMutation,
      variableValues: {
        data: {
          itemId: item!.id,
          quantity: 0,
        },
      },
      userId: user?.id,
    });

    expect(data.data?.updateCart).toMatchObject(
      expect.objectContaining({
        items: [],
      })
    );
  });

  it('should return error message if item does not exist', async () => {
    const data = await gCall({
      source: updateCartMutation,
      variableValues: {
        data: {
          itemId: 'not in database',
          quantity: 2,
        },
      },
      userId: user?.id,
    });

    expect(data).toMatchObject({
      data: {
        updateCart: null,
      },
      errors: [
        {
          message: 'Not enough items in stock',
        },
      ],
    });
  });

  it('should return error message if add to cart quantity > item quantity', async () => {
    const data = await gCall({
      source: updateCartMutation,
      variableValues: {
        data: {
          itemId: item!.id,
          quantity: item!.quantity + 1,
        },
      },
      userId: user?.id,
    });

    expect(data).toMatchObject({
      data: {
        updateCart: null,
      },
      errors: [
        {
          message: 'Not enough items in stock',
        },
      ],
    });
  });

  it('should fail if not logged in', async () => {
    const data = await gCall({
      source: updateCartMutation,
      variableValues: {
        data: {
          itemId: item!.id,
          quantity: 1,
        },
      },
    });

    expect(data).toMatchObject({
      data: {
        updateCart: null,
      },
      errors: [
        {
          message: "Access denied! You don't have permission for this action!",
        },
      ],
    });
  });
});
