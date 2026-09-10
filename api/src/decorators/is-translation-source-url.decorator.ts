import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

// Hosts the translation backfill may read override files from.
export const ALLOWED_TRANSLATION_SOURCE_HOSTS = ['raw.githubusercontent.com'];

export function IsTranslationSourceUrl(validationOptions?: ValidationOptions) {
  return function (object: unknown, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsTranslationSourceUrlConstraint,
    });
  };
}

@ValidatorConstraint({ name: 'isTranslationSourceUrl' })
export class IsTranslationSourceUrlConstraint
  implements ValidatorConstraintInterface
{
  validate(value: unknown) {
    if (typeof value !== 'string') {
      return true;
    }

    let url: URL;
    try {
      url = new URL(value);
    } catch {
      return false;
    }

    return (
      url.protocol === 'https:' &&
      ALLOWED_TRANSLATION_SOURCE_HOSTS.includes(url.host) &&
      !url.username &&
      !url.password &&
      !url.search &&
      !url.hash
    );
  }

  defaultMessage(args: ValidationArguments) {
    return `${
      args.property
    } must be an https url with no credentials, query or fragment, on one of: ${ALLOWED_TRANSLATION_SOURCE_HOSTS.join(
      ', ',
    )}`;
  }
}
