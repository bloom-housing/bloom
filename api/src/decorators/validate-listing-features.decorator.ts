import { ListingFeatures } from '@prisma/client';
import {
  registerDecorator,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidatorOptions,
} from 'class-validator';
import { ListingFeaturesConfiguration } from '../../src/dtos/jurisdictions/listing-features-config.dto';

const missingCategories = (
  featuresConfiguration: ListingFeaturesConfiguration,
  value: ListingFeatures,
) => {
  if (featuresConfiguration?.categories?.length) {
    const requiredCategories = featuresConfiguration.categories.filter(
      (category) => category.required,
    );
    const missingCategories = [];
    requiredCategories.forEach((category) => {
      const atLeastOneField = category.fields.some((field) => {
        return value[field.id] === true;
      });
      if (!atLeastOneField) missingCategories.push(category.id);
    });
    return missingCategories;
  }
};

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
    const featuresConfiguration: ListingFeaturesConfiguration =
      validationArguments?.object['listingFeaturesConfiguration'];
    const missingCategoriesList = missingCategories(
      featuresConfiguration,
      value,
    );
    return missingCategoriesList.length === 0;
  }

  defaultMessage(validationArguments?: ValidationArguments): string {
    return `listingFeatures has no data in these required categories: [${missingCategories(
      validationArguments?.object['listingFeaturesConfiguration'],
      validationArguments?.object['listingFeatures'],
    ).join(', ')}]`;
  }
}
