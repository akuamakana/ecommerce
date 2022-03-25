import { PasswordInput } from '@models/Inputs/PasswordInput';
import { Arg, Ctx, Mutation, Resolver } from 'type-graphql';
import { MyContext } from 'types/MyContext';
import redis from '@utils/redis';
import prisma from '@utils/prisma';
import argon2 from 'argon2';

@Resolver()
class ResetPasswordResolver {
  @Mutation(() => Boolean, { nullable: true })
  async resetPassword(@Ctx() ctx: MyContext, @Arg('password') { password }: PasswordInput): Promise<Boolean> {
    const { authorization, email } = ctx.req.headers;

    if (!authorization || !email) {
      return false;
    }
    const token = await redis.get(authorization);
    if (!token || token !== email) {
      return false;
    }
    const hashedPassword = await argon2.hash(password);
    await prisma.user.update({
      where: {
        email: token,
      },
      data: {
        password: hashedPassword,
      },
    });
    
    await redis.del([authorization]);
    return true;
  }
}

export default ResetPasswordResolver;
