import { Ctx, Mutation, Resolver } from 'type-graphql';
import { MyContext } from 'types/MyContext';
import redis from '@utils/redis';
import prisma from '@utils/prisma';

@Resolver()
class ConfirmEmailResolver {
  @Mutation(() => Boolean, { nullable: true })
  async confirmEmail(@Ctx() ctx: MyContext): Promise<Boolean> {
    // get token from url
    const auth = ctx.req.headers.authorization;
    const email = ctx.req.headers.email;

    if (!auth || !email) {
      return false;
    }
    // find user with redis
    let token = await redis.get(auth);

    if (!token || token !== email) {
      return false;
    }
    // set user validation to true
    await prisma.user.update({
      where: {
        email: token,
      },
      data: {
        verified: true,
      },
    });

    await redis.del([auth]);
    return true;
  }
}

export default ConfirmEmailResolver;
