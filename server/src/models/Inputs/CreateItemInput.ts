import { IsNumber, IsPositive, IsUrl, Length, MinLength } from 'class-validator';
import { Field, InputType } from 'type-graphql';

@InputType()
export class CreateItemInput {
  @Field({ nullable: true })
  @Length(1, 255)
  name: string;

  @Field({ nullable: true })
  @MinLength(1)
  description: string;

  @Field({ nullable: true })
  @IsNumber({
    maxDecimalPlaces: 2,
  })
  @IsPositive()
  price: number;

  @Field({ nullable: true })
  @IsUrl()
  imageUrl: string;

  @Field({ nullable: true })
  @IsPositive()
  @IsNumber()
  quantity: number;
}
