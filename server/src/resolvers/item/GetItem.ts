import { Item } from '@models/Item';
import { Arg, Query, Resolver } from 'type-graphql';
import prisma from '@utils/prisma';

@Resolver()
class GetItemResolver {
  @Query(() => Item, { nullable: true })
  async getItem(@Arg('id') id: string): Promise<Item | null> {
    const item = await prisma.item.findUnique({ where: { id } });

    return item;
  }
}

export default GetItemResolver;
