import { ListingsStatusEnum } from '@prisma/client';
import {
  ValidationOptions,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  registerDecorator,
  ValidationTypes,
} from 'class-validator';

//
/**
 * Register the validator once
 * This Validator checks if a field is required when publishing a listing.
 * It DO NOT decide about further validation, just checks if the field is required and has value.
 */
@ValidatorConstraint({ async: false })
class ListingPublishRequiredConstraint implements ValidatorConstraintInterface {
  static hasValue(value: any): boolean {
    return value !== undefined && value !== null && value !== '';
  }

  /*
   * Check if the listing is being published.
   * A listing is considered "publishing" if its status is 'active' or 'pending review'.
   * If status is undefined, null, or an empty string we have to assume that it is publishing in order to apply validation
   * so that strict validation will be applied
   */
  static isPublishing(status?: ListingsStatusEnum | ''): boolean {
    return (
      status === ListingsStatusEnum.active ||
      status === ListingsStatusEnum.pendingReview ||
      status === undefined ||
      status === null ||
      status === ''
    );
  }

  static isRequiredField(field: string, requiredFields: string[]): boolean {
    return Array.isArray(requiredFields) && requiredFields.includes(field);
  }

  // Validate method checks if the field is required and has a value
  validate(value: any, args: ValidationArguments) {
    const object = args.object as any;
    const isRequired = ListingPublishRequiredConstraint.isRequiredField(
      args.property,
      object['requiredFields'] || [],
    );

    if (!isRequired) {
      return true; // Not a required field, validation passes
    }

    if (ListingPublishRequiredConstraint.hasValue(value)) {
      return true; // Value exists, validation passes
    }

    if (!ListingPublishRequiredConstraint.isPublishing(object['status'])) {
      return true; // Not publishing, validation passes
    }

    // If reach here, the field is required but has no value while publishing
    return false;
  }

  defaultMessage(args: ValidationArguments) {
    const [field] = args.constraints;
    return `${field} is required when publishing the listing`;
  }
}

// Decorator factory uses the pre-registered validator
/**
 * Custom decorator that validates a field based on either:
 * 1. The field has a value (not undefined/null/empty string) OR
 * 2. The listing is being published (status = active) AND the field is in the requiredFields array
 *
 * @param field - The name of the field being validated
 * @param validationOptions - Additional validation options
 */
export function ValidateListingPublish(
  field: string,
  validationOptions?: ValidationOptions,
) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: ValidationTypes.IS_DEFINED,
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [field],
      validator: ListingPublishRequiredConstraint,
    });
  };
}
