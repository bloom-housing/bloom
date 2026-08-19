import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

// Schemes allowed in stored URL fields (link href, logo src/url). A relative URL, fragment, or
// query-only value carries no scheme and is allowed; anything with a scheme must use one of these.
// This rejects javascript:, data:, vbscript:, file:, and similar, so a stored value cannot become a
// script-executing link when the public site renders it into an href.
const ALLOWED_URL_SCHEMES = ['http', 'https', 'mailto', 'tel'];

// Matches a leading URL scheme (the part before the first colon), e.g. "https" in "https://x".
const SCHEME_PATTERN = /^([a-zA-Z][a-zA-Z0-9+.-]*):/;
// Control characters and whitespace (U+0000 to U+0020) that browsers ignore inside a scheme, so
// "java\tscript:" runs as javascript:. Stripped before reading the scheme.
const CONTROL_AND_SPACE = /[\u0000-\u0020]/g;

export function IsSafeUrl(validationOptions?: ValidationOptions) {
  return function (object: unknown, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsSafeUrlConstraint,
    });
  };
}

@ValidatorConstraint({ name: 'isSafeUrl' })
export class IsSafeUrlConstraint implements ValidatorConstraintInterface {
  validate(value: unknown) {
    // Leave type-checking to @IsString; a non-string is not this validator's concern.
    if (typeof value !== 'string') {
      return true;
    }
    const schemeMatch = value
      .replace(CONTROL_AND_SPACE, '')
      .match(SCHEME_PATTERN);
    if (!schemeMatch) {
      // No scheme: a relative path, fragment, or query. Safe.
      return true;
    }
    return ALLOWED_URL_SCHEMES.includes(schemeMatch[1].toLowerCase());
  }

  defaultMessage(args: ValidationArguments) {
    return `${
      args.property
    } must be a relative URL or use one of: ${ALLOWED_URL_SCHEMES.join(', ')}`;
  }
}
