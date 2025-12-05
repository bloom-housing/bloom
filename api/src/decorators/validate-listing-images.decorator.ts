import { ListingImages } from '@prisma/client';
import {
  registerDecorator,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidatorOptions,
} from 'class-validator';

export function ValidateListingImages(validationOptions?: ValidatorOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'ValidateListingImages',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: ListingImagesConstraint,
    });
  };
}

@ValidatorConstraint()
export class ListingImagesConstraint implements ValidatorConstraintInterface {
  validate(
    value: ListingImages[],
    validationArguments?: ValidationArguments,
  ): Promise<boolean> | boolean {
    const isImagesFieldRequired =
      validationArguments?.object['requiredFields']?.includes('listingImages');

    const minimumImagesRequired =
      validationArguments?.object['minimumImagesRequired'];

    if (!minimumImagesRequired || !isImagesFieldRequired) return true;
    else {
      return value?.length >= minimumImagesRequired;
    }
  }
  defaultMessage(validationArguments?: ValidationArguments): string {
    return `listingImages must contain at least ${validationArguments?.object['minimumImagesRequired']} photos`;
  }
}
