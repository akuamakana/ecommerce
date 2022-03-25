import { sendEmail } from '@utils/sendEmail';
import { Arg, Resolver, Mutation } from 'type-graphql';
import prisma from '@utils/prisma';
import redis from '@utils/redis';
import { v4 } from 'uuid';

const sentMessage = 'An email has been sent to the requested email with a reset password link. This link will expire in 24 hours.';
const client = process.env.WEB_CLIENT_URL;

@Resolver()
class ForgotPasswordResolver {
  @Mutation(() => String)
  async forgotPassword(@Arg('email') email: string): Promise<String> {
    const token = v4();
    const message = `Click here to reset the password for the account with an email address of ${email}`;
    const link = `${client}/reset-password?token=${token}&email=${email.toLowerCase()}`;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return sentMessage;
    }
    await redis.set(token, `${email.toLowerCase()}`, 'EX', 60 * 24); // expire after 24 hours
    await sendEmail(email, message, link);
    return sentMessage;
  }
}

export default ForgotPasswordResolver;
