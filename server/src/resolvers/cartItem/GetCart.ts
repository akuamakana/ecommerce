import Cart from '@models/Cart';
import { MyContext } from 'types/MyContext';
import { Authorized, Ctx, Query, Resolver } from 'type-graphql';
import { UserCart } from '@lib/UserCart';

@Resolver()
class GetCartResolver {
  @Authorized(['USER', 'ADMIN', 'MANAGER'])
  @Query(() => Cart, { nullable: true })
  async getCart(@Ctx() { req }: MyContext): Promise<Cart | null> {
    const cart = new UserCart(req.session.userId);

    return await cart.getCart();
  }
}

export default GetCartResolver;
