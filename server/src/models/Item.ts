import { Field, ID, ObjectType } from 'type-graphql';

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

  userId: string;

  createdAt: Date;
  updatedAt: Date;
}
