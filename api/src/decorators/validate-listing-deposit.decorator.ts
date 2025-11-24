import {
  registerDecorator,
  ValidationArguments,
  ValidationTypes,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidatorOptions,
} from 'class-validator';
import Listing from '../dtos/listings/listing.dto';
import { DepositTypeEnum, ListingTypeEnum } from '@prisma/client';

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
    const { depositValue, depositMin, depositMax, listingType } =
      args.object as Listing;

    if (!listingType || listingType === ListingTypeEnum.regulated) {
      return true;
    }

    if (value === DepositTypeEnum.fixedDeposit) {
      return this.isFieldEmpty(depositMin) && this.isFieldEmpty(depositMax);
    }
    if (value === DepositTypeEnum.depositRange) {
      return this.isFieldEmpty(depositValue);
    }

    // If no Deposit type is selected then validate that it's either just depositValue or just the range values
    return (
      this.isFieldEmpty(depositValue) ||
      (this.isFieldEmpty(depositMin) && this.isFieldEmpty(depositMax))
    );
  }
  defaultMessage(args?: ValidationArguments): string {
    const value = args.value as DepositTypeEnum;

    if (value === DepositTypeEnum.fixedDeposit) {
      return 'When deposit is of type "fixedDeposit" the "depositValue" must be filled and the "depositMin"|"depositMax" fields must be null';
    }
    return 'When deposit is of type "depositRange" the "depositMin" and "depositMax" fields must be filled and "depositValue" must be null';
  }
}
