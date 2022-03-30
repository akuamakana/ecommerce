import Cart from '@models/Cart';
import prisma from '@utils/prisma';

export class UserCart {
  userId: string;
  constructor(userId: string) {
    this.userId = userId;
  }

  getCart = async () => {
    const cart = prisma.cart.findUnique({
      where: {
        userId: this.userId,
      },
      include: {
        items: {
          include: {
            item: true,
          },
        },
        user: true,
      },
    });

    return cart;
  };

  isItemInStock = async (itemId: string, quantity: number): Promise<Boolean> => {
    const item = await prisma.item.findUnique({
      where: {
        id: itemId,
      },
    });

    if (!item || item.quantity < quantity) {
      throw new Error('Not enough items in stock');
    }

    return true;
  };

  update = async (itemId: string, quantity: number) => {
    const cart = await prisma.cart.upsert({
      where: {
        userId: this.userId,
      },
      update: {},
      create: {
        userId: this.userId,
      },
    });

    const updatedCart = await prisma.cart.update({
      where: {
        id: cart.id,
      },
      data: {
        items: {
          upsert: {
            where: {
              itemId,
            },
            update: {
              quantity,
            },
            create: {
              quantity,
              item: {
                connect: {
                  id: itemId,
                },
              },
            },
          },
        },
      },
      include: {
        items: {
          include: {
            item: true,
          },
        },
        user: true,
      },
    });

    return updatedCart;
  };

  deleteItemFromCart = async (itemId: string): Promise<Cart> => {
    const cart = await prisma.cart.update({
      where: {
        userId: this.userId,
      },
      data: {
        items: {
          delete: {
            itemId,
          },
        },
      },
      include: {
        items: {
          include: {
            item: true,
          },
        },
        user: true,
      },
    });

    return cart;
  };
}
