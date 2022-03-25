import { MyContext } from './../../types/MyContext';
import { Item } from '@models/Item';
import { Arg, Ctx, Mutation, Resolver, UseMiddleware } from 'type-graphql';
import prisma from '@utils/prisma';
import { CreateItemInput } from '@models/Inputs/CreateItemInput';
import { isAuth } from '@middleware/isAuth';

@Resolver()
class CreateItemResolver {
  @UseMiddleware(isAuth)
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
