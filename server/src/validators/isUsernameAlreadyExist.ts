import { registerDecorator, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import prisma from '@utils/prisma';

@ValidatorConstraint({ async: true })
export class IsUsernameAlreadyExistConstraint implements ValidatorConstraintInterface {
  async validate(username: string) {
    const user = await prisma.user.findUnique({ where: { username } });
    if (user) {
      return false;
    }
    return true;
  }
}

export function IsUsernameAlreadyExist(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsUsernameAlreadyExistConstraint,
    });
  };
}
