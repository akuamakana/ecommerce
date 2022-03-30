import { CartItemInput } from '@models/Inputs/CartItemInput';
import Cart from '@models/Cart';
import { MyContext } from 'types/MyContext';
import { Arg, Authorized, Ctx, Mutation, Resolver } from 'type-graphql';
import { UserCart } from '@lib/UserCart';

@Resolver()
class UpdateCartResolver {
  @Authorized(['USER', 'ADMIN', 'MANAGER'])
  @Mutation(() => Cart, { nullable: true })
  async updateCart(@Arg('data') { itemId, quantity }: CartItemInput, @Ctx() { req }: MyContext): Promise<Cart | null> {
    const { userId } = req.session;
    try {
      const cart = new UserCart(userId);
      if (quantity === 0) {
        return await cart.deleteItemFromCart(itemId);
      } else {
        await cart.isItemInStock(itemId, quantity);
        return await cart.update(itemId, quantity);
      }
    } catch (e: any) {
      throw e;
    }
  }
}

export default UpdateCartResolver;
