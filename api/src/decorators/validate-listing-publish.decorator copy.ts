import { applyDecorators } from '@nestjs/common';
import { ListingsStatusEnum } from '@prisma/client';
import { ValidationOptions, ValidateIf, IsDefined } from 'class-validator';

class ListingPublishRequiredValidator {
  static hasValue(value: any): boolean {
    return value !== undefined && value !== null && value !== '';
  }

  static isPublishing(status: ListingsStatusEnum): boolean {
    return status === ListingsStatusEnum.active;
  }

  static isRequiredField(field: string, requiredFields: string[]): boolean {
    return Array.isArray(requiredFields) && requiredFields.includes(field);
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
  return applyDecorators(
    // Decide should we perform futher validation or not
    ValidateIf(
      (o) => {
        // Always validate if the field has a value
        if (ListingPublishRequiredValidator.hasValue(o[field])) {
          return true;
        }

        // If not publishing do not validate at all
        if (!ListingPublishRequiredValidator.isPublishing(o['status'])) {
          return false;
        }

        // Perform validation if field is required
        // CAUTION! If field is not required it will stop ALL validation
        const isRequired = ListingPublishRequiredValidator.isRequiredField(
          field,
          o['requiredFields'] || [],
        );

        return isRequired;
      },
      {
        ...validationOptions,
      },
    ),
    IsDefined(validationOptions),
  );
}
