import { ListingsStatusEnum } from '@prisma/client';
import { ValidationOptions, ValidateIf } from 'class-validator';

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
  return ValidateIf(
    (o) => {
      // Always validate if the field has a value
      const hasValue =
        o[field] !== undefined && o[field] !== null && o[field] !== '';

      if (hasValue) {
        return true;
      }

      // Check required fields only when publishing (status = active)
      const isPublishing = o['status'] === ListingsStatusEnum.active;
      if (!isPublishing) {
        return false;
      }

      // Safely check if field is required
      const requiredFields = o['requiredFields'] || [];
      return Array.isArray(requiredFields) && requiredFields.includes(field);
    },
    {
      ...validationOptions,
    },
  );
}
