import { Arg, Mutation, Resolver } from 'type-graphql';
import sendVerificationEmail from '@utils/sendVerificationEmail';
import prisma from '@utils/prisma';

@Resolver()
class SendVerificationEmailResolver {
  @Mutation(() => Boolean)
  async sendVerification(@Arg('email') email: string): Promise<Boolean> {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || user.verified) {
      return true;
    }

    await sendVerificationEmail(user);
    return true;
  }
}

export default SendVerificationEmailResolver;
