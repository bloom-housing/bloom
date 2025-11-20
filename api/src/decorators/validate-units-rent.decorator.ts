import { RentTypeEnum } from '@prisma/client';
import {
  registerDecorator,
  ValidationArguments,
  ValidationTypes,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidatorOptions,
} from 'class-validator';
import UnitGroup from '../dtos/unit-groups/unit-group.dto';

export function ValidateUnitGroupRent(validationOptions?: ValidatorOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: ValidationTypes.CUSTOM_VALIDATION,
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: RentValueConstraint,
    });
  };
}

@ValidatorConstraint()
export class RentValueConstraint implements ValidatorConstraintInterface {
  isFieldEmpty(value): boolean {
    return value === null || value === undefined;
  }

  validate(
    value: RentTypeEnum,
    validationArguments?: ValidationArguments,
  ): Promise<boolean> | boolean {
    const { flatRentValueFrom, flatRentValueTo } =
      validationArguments.object as UnitGroup;

    if (value === RentTypeEnum.rentRange) {
      return (
        !this.isFieldEmpty(flatRentValueFrom) &&
        !this.isFieldEmpty(flatRentValueTo)
      );
    } else {
      return (
        this.isFieldEmpty(flatRentValueFrom) &&
        this.isFieldEmpty(flatRentValueTo)
      );
    }

    return true;
  }

  defaultMessage(validationArguments?: ValidationArguments): string {
    const rentType = validationArguments.value as RentTypeEnum;
    if (rentType === RentTypeEnum.rentRange) {
      return 'When rent is of type "rentRange" the "flatRentValueFrom" and "flatRentValueTo" fields must be filled';
    }
  }
}
