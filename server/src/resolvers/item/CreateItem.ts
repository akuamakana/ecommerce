import { CreateItemInput } from '@models/Inputs/CreateItemInput';
import { Item } from '@models/Item';
import prisma from '@utils/prisma';
import { Arg, Authorized, Ctx, Mutation, Resolver } from 'type-graphql';
import { MyContext } from './../../types/MyContext';

@Resolver()
class CreateItemResolver {
  @Authorized(['ADMIN', 'MANAGER'])
  @Mutation(() => Item, { nullable: true })
  async createItem(@Ctx() ctx: MyContext, @Arg('data') data: CreateItemInput): Promise<Item> {
    const item = await prisma.item.create({
      data: {
        ...data,
        userId: ctx.req.session!.userId,
      },
    });

    return item;
  }
}

export default CreateItemResolver;
