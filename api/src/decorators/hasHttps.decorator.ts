import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

export function hasHttps(validationOptions?: ValidationOptions) {
  return function (object: unknown, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [],
      validator: hasHttpsConstraint,
    });
  };
}

@ValidatorConstraint({ name: 'hasHttps' })
export class hasHttpsConstraint implements ValidatorConstraintInterface {
  validate(url: string) {
    const httpsRegex = /^https?:\/\//i;
    return httpsRegex.test(url);
  }

  defaultMessage(args: ValidationArguments) {
    return `${args.property} must have https://`;
  }
}
