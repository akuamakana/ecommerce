import { CreateItemInput } from '@models/Inputs/CreateItemInput';
import { Item } from '@models/Item';
import prisma from '@utils/prisma';
import { Arg, Mutation, Resolver } from 'type-graphql';

@Resolver()
class UpdateItemResolver {
  @Mutation(() => Item, { nullable: true })
  async updateItem(@Arg('id') id: string, @Arg('data') data: CreateItemInput): Promise<Item | null> {
    const item = await prisma.item.update({ where: { id }, data });

    return item;
  }
}

export default UpdateItemResolver;
