import { ObjectType, Field, ID, Authorized } from 'type-graphql';
import Cart from './Cart';

@ObjectType()
export class User {
  @Field(() => ID)
  id: string;

  @Field()
  username: string;

  @Field()
  email: string;

  @Field()
  firstName: string;

  @Field()
  lastName: string;

  @Authorized(['ADMIN', 'MANAGER'])
  @Field()
  verified: boolean;

  @Authorized(['ADMIN', 'MANAGER'])
  @Field()
  role: string;

  // @Field(() => Cart, { nullable: true })
  cart?: Cart;

  createdAt: Date;
  updatedAt: Date;
}
