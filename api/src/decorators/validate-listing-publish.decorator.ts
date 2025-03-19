import { ListingsStatusEnum } from '@prisma/client';
import { ValidationOptions, ValidateIf } from 'class-validator';

export function ValidateListingPublish(
  field: string,
  validationOptions?: ValidationOptions,
) {
  return ValidateIf(
    (o) => {
      return (
        (o['requiredFields'].includes(field) &&
          o['status'] === ListingsStatusEnum.active) ||
        o[field]
      );
    },
    {
      ...validationOptions,
    },
  );
}
