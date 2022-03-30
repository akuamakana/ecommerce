import { Min } from 'class-validator';
import { Field, InputType } from 'type-graphql';

@InputType()
export class CartItemInput {
  @Field()
  itemId: string;

  @Field()
  @Min(0)
  quantity: number;
}
