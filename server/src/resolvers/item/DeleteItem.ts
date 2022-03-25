import prisma from '@utils/prisma';
import { Arg, Authorized, Mutation, Resolver } from 'type-graphql';

@Resolver()
class DeleteItemResolver {
  @Authorized(['ADMIN', 'MANAGER'])
  @Mutation(() => Boolean)
  async deleteItem(@Arg('id') id: string): Promise<boolean> {
    await prisma.item.delete({ where: { id } });

    return true;
  }
}

export default DeleteItemResolver;
