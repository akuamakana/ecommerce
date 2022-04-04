import { Field, ID, ObjectType } from 'type-graphql';
import CartItem from './CartItem';
import { User } from './User';

@ObjectType()
class Cart {
  @Field(() => ID)
  id: string;

  @Field(() => User)
  user: User;

  @Field()
  userId: string;

  @Field(() => [CartItem], { nullable: true })
  items: CartItem[];
}

export default Cart;
