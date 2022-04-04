import { Item } from './Item';
import { Field, ID, ObjectType } from 'type-graphql';

@ObjectType()
class CartItem {
  @Field(() => ID)
  id: number;

  @Field()
  quantity: number;

  @Field(() => Item, { nullable: true })
  item: Item;

  @Field()
  itemId: string;

  @Field({ nullable: true })
  cartId?: string;
}

export default CartItem;
