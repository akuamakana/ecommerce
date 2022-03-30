import { CartItemInput } from './../../models/Inputs/CartItemInput';
import { Request } from 'express';
import Cart from '@models/Cart';
import { MyContext } from 'types/MyContext';
import { Arg, Authorized, Ctx, Mutation, Resolver } from 'type-graphql';
import prisma from '@utils/prisma';

const addItemToCart = async (userId: string, req: Request, itemId: string, quantity: number) => {
  const item = await prisma.item.findUnique({
    where: {
      id: itemId,
    },
  });

  if (!item || item.quantity < quantity) {
    throw new Error('Not enough items in stock');
  }

  const cart = await prisma.cart.upsert({
    where: {
      userId,
    },
    update: {},
    create: {
      userId,
    },
  });

  req.session.cartId = cart.id;

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

const deleteItemFromCart = async (userId: string, itemId: string): Promise<Cart> => {
  const cart = await prisma.cart.update({
    where: {
      userId,
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

const getCart = async (userId: string) => {
  const cart = prisma.cart.findUnique({
    where: {
      userId,
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

@Resolver()
class UpdateCartResolver {
  @Authorized(['USER', 'ADMIN', 'MANAGER'])
  @Mutation(() => Cart, { nullable: true })
  async updateCart(@Arg('data') data: CartItemInput, @Ctx() { req }: MyContext): Promise<Cart | null> {
    const { itemId, quantity } = data;
    const { userId } = req.session;
    try {
      let cart: Cart;
      if (quantity === 0) {
        cart = await deleteItemFromCart(userId, itemId);
      } else {
        cart = await addItemToCart(userId, req, itemId, quantity);
      }
      return cart;
    } catch (e: any) {
      if (['P2017', 'P2025'].includes(e.code)) {
        const cart = await getCart(userId);
        return cart;
      }
      throw e;
    }
  }
}

export default UpdateCartResolver;
