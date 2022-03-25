import { IsUsernameAlreadyExist } from './../../validators/isUsernameAlreadyExist';
import { PasswordInput } from '@models/Inputs/PasswordInput';
import { IsEmail, Length, NotContains } from 'class-validator';
import { Field, InputType } from 'type-graphql';
import { IsEmailAlreadyExist } from '@validators/isEmailAlreadyExist';

@InputType()
export class RegisterInput extends PasswordInput {
  @Field()
  @IsEmail()
  @IsEmailAlreadyExist({ message: 'Email is already in use' })
  email: string;

  @Length(1, 255)
  @Field()
  firstName: string;

  @Length(1, 255)
  @Field()
  lastName: string;

  @Field()
  @Length(4, 255)
  @NotContains('@')
  @IsUsernameAlreadyExist({ message: 'Username is already in use' })
  username: string;
}
