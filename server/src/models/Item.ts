import { Authorized, Field, ID, ObjectType } from 'type-graphql';

@ObjectType()
export class Item {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field()
  description: string;

  @Field()
  price: number;

  @Field()
  imageUrl: string;

  @Field()
  quantity: number;

  @Authorized(['ADMIN', 'MANAGER'])
  @Field()
  userId: string;

  createdAt: Date;
  updatedAt: Date;
}
