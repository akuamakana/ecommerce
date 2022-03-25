import { Length } from 'class-validator';
import { Field, InputType } from 'type-graphql';

@InputType()
export class PasswordInput {
  @Field()
  @Length(4, 255)
  password: string;
}
