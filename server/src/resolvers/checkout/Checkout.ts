import { UserCart } from '@lib/UserCart';
import prisma from '@utils/prisma';
import { Authorized, Ctx, Mutation, Resolver } from 'type-graphql';
import { MyContext } from 'types/MyContext';

@Resolver()
class CheckoutResolver {
  @Authorized(['USER', 'MANAGER', 'ADMIN'])
  @Mutation(() => Boolean)
  async checkout(@Ctx() { req }: MyContext) {
    const cart = new UserCart(req.session!.userId);
    const cartItems = await cart.getCart();

    if (!cartItems || cartItems.items.length === 0) {
      throw new Error('Cart is empty');
    }
    await Promise.all(
      cartItems.items.map(async (item) => {
        await cart.isItemInStock(item.itemId, item.quantity);
      })
    );

    await Promise.all(
      cartItems.items.map(async (item) => {
        await prisma.item.update({
          where: {
            id: item.itemId,
          },
          data: {
            quantity: {
              decrement: item.quantity,
            },
          },
        });
      })
    );

    await prisma.cart.delete({
      where: {
        userId: req.session!.userId,
      },
    });

    return true;
  }
}

export default CheckoutResolver;
