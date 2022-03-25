import { ObjectType, Field, ID, Authorized } from 'type-graphql';

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

  createdAt: Date;
  updatedAt: Date;
}
