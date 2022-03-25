import { Item } from '@models/Item';
import prisma from '@utils/prisma';
import { Query, Resolver } from 'type-graphql';

@Resolver()
export class GetItemsResolver {
  @Query(() => [Item])
  async getItems(): Promise<Item[]> {
    const items = await prisma.item.findMany();

    return items;
  }
}

export default GetItemsResolver;
