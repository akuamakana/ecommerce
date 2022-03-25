import argon2 from 'argon2';
import { Arg, Ctx, Mutation, Resolver, ForbiddenError } from 'type-graphql';
import { User } from '@models/User';
import prisma from '@utils/prisma';
import { MyContext } from 'types/MyContext';

@Resolver()
class LoginResolver {
  @Mutation(() => User, { nullable: true })
  async login(@Arg('usernameOrEmail') usernameOrEmail: string, @Arg('password') password: string, @Ctx() ctx: MyContext): Promise<User | null> {
    const user = usernameOrEmail.includes('@') ? await prisma.user.findUnique({ where: { email: usernameOrEmail } }) : await prisma.user.findUnique({ where: { username: usernameOrEmail } });

    if (!user) {
      return null;
    }

    const decryptedPassword = await argon2.verify(user.password, password);
    if (!decryptedPassword) {
      return null;
    }

    if (!user.verified) {
      throw new ForbiddenError();
    }

    ctx.req.session!.userId = user.id;

    return user;
  }
}

export default LoginResolver;
