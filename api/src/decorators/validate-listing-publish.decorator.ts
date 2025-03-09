import { ValidationOptions, ValidateIf } from 'class-validator';

export function ValidateListingPublish(
  field: string,
  validationOptions?: ValidationOptions,
) {
  return ValidateIf(
    (o) => {
      console.log('o', o);
      return o['requiredFields'].includes(field);
    },
    {
      ...validationOptions,
    },
  );
}
