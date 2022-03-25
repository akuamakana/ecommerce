import sendVerificationEmail from '@utils/sendVerificationEmail';
import argon2 from 'argon2';
import { RegisterInput } from '@models/Inputs/RegisterInput';
import { User } from '@models/User';
import { Arg, Mutation, Resolver } from 'type-graphql';
import prisma from '@utils/prisma';

@Resolver()
class RegisterResolver {
  @Mutation(() => User)
  async register(@Arg('input') { email, username, password, firstName, lastName }: RegisterInput): Promise<User> {
    const hashedPassword = await argon2.hash(password);
    const user = {
      email,
      username,
      firstName,
      lastName,
      password: hashedPassword,
    };

    const createdUser = await prisma.user.create({ data: user });

    await sendVerificationEmail(createdUser);

    return createdUser;
  }
}

export default RegisterResolver;
