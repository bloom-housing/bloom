import {
  registerDecorator,
  ValidationArguments,
  ValidationTypes,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidatorOptions,
} from 'class-validator';
import Listing from '../dtos/listings/listing.dto';
import { DepositTypeEnum } from '@prisma/client';

export function ValidateListingDeposit(validationOptions?: ValidatorOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: ValidationTypes.CUSTOM_VALIDATION,
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: DepositValueConstraint,
    });
  };
}

@ValidatorConstraint()
export class DepositValueConstraint implements ValidatorConstraintInterface {
  isFieldEmpty(value): boolean {
    return value === null || value === undefined;
  }

  validate(value: DepositTypeEnum, args: ValidationArguments) {
    const { depositValue, depositRangeMin, depositRangeMax } =
      args.object as Listing;

    if (value === DepositTypeEnum.fixedDeposit) {
      return (
        this.isFieldEmpty(depositRangeMin) && this.isFieldEmpty(depositRangeMax)
      );
    }

    // Verify if both fields are either filled or empty
    const areBothFieldsValid =
      (this.isFieldEmpty(depositRangeMin) &&
        !this.isFieldEmpty(depositRangeMax)) ||
      (!this.isFieldEmpty(depositRangeMin) &&
        this.isFieldEmpty(depositRangeMax));

    return this.isFieldEmpty(depositValue) && areBothFieldsValid;
  }
  defaultMessage(args?: ValidationArguments): string {
    const value = args.value as DepositTypeEnum;
    if (value === DepositTypeEnum.fixedDeposit) {
      return 'When deposit is of type "fixedDeposit" the "depositValue" must be filled and the "depositRangeMin"|"depositRangeMax" fields must be null';
    }
    return 'When deposit is of type "depositRange" the "depositRangeMin" and "depositRangeMax" fields must be filled and "depositValue" must be null';
  }
}
