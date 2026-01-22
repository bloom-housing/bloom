import { ListingFeatures } from '@prisma/client';
import {
  registerDecorator,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidatorOptions,
} from 'class-validator';
import { ListingFeaturesConfiguration } from '../../src/dtos/jurisdictions/listing-features-config.dto';

export function ValidateListingFeatures(validationOptions?: ValidatorOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'ValidateListingFeatures',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: ListingFeaturesConstraint,
    });
  };
}

@ValidatorConstraint()
export class ListingFeaturesConstraint implements ValidatorConstraintInterface {
  validate(
    value: ListingFeatures,
    validationArguments?: ValidationArguments,
  ): Promise<boolean> | boolean {
    console.log({ validationArguments });
    const featuresConfiguration: ListingFeaturesConfiguration =
      validationArguments?.object['listingFeaturesConfiguration'];
    console.log('VALUE!!!');
    console.log({ value });
    console.log('CONFIG!!!');
    console.log({ featuresConfiguration });
    return true;
  }
  defaultMessage(validationArguments?: ValidationArguments): string {
    return `listingFeatures has required categories ${validationArguments?.object['minimumImagesRequired']} photos`;
  }
}
