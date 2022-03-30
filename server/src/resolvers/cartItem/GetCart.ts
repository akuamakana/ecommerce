import Cart from '@models/Cart';
import { MyContext } from 'types/MyContext';
import { Ctx, Query, Resolver } from 'type-graphql';
import prisma from '@utils/prisma';

@Resolver()
class GetCartResolver {
  @Query(() => Cart, { nullable: true })
  async getCart(@Ctx() { req }: MyContext): Promise<Cart | null> {
    const cart = await prisma.cart.findUnique({
      where: { userId: req.session.userId },
      include: {
        items: {
          include: { item: true },
        },
        user: true,
      },
    });

    return cart;
  }
}

export default GetCartResolver;
