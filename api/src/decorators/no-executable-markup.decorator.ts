import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

// Tags refused in stored translation values.
const BLOCKED_TAGS = [
  'script',
  'style',
  'iframe',
  'object',
  'embed',
  'link',
  'meta',
  'base',
  'form',
  'img',
  'svg',
];

const BLOCKED_TAG_PATTERN = new RegExp(
  `<\\s*/?\\s*(${BLOCKED_TAGS.join('|')})\\b`,
  'i',
);

// Control characters and whitespace (U+0000 to U+0020) that browsers ignore inside a tag name, so
// "<scr\tipt" still opens a script element. Stripped before the tag name is read.
const CONTROL_AND_SPACE = /[\u0000-\u0020]/g;

const BLOCKED_PATTERNS: { label: string; pattern: RegExp }[] = [
  { label: 'an inline event handler', pattern: /<[^>]*\son[a-z]+\s*=/i },
  { label: 'a style attribute', pattern: /<[^>]*\sstyle\s*=/i },
  {
    label: 'a javascript: or vbscript: url',
    pattern: /(javascript|vbscript)\s*:/i,
  },
  // Loads remote content on render, which is why img is blocked above.
  { label: 'a markdown image', pattern: /!\[[^\]]*\]\([^)]*\)/ },
];

export function NoExecutableMarkup(validationOptions?: ValidationOptions) {
  return function (object: unknown, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [],
      validator: NoExecutableMarkupConstraint,
    });
  };
}

@ValidatorConstraint({ name: 'noExecutableMarkup' })
export class NoExecutableMarkupConstraint
  implements ValidatorConstraintInterface
{
  validate(value: unknown) {
    // Leave type-checking to @IsString; a non-string is not this validator's concern.
    if (typeof value !== 'string') {
      return true;
    }
    return (
      !BLOCKED_TAG_PATTERN.test(value) &&
      !BLOCKED_TAG_PATTERN.test(value.replace(CONTROL_AND_SPACE, '')) &&
      !BLOCKED_PATTERNS.some(({ pattern }) => pattern.test(value))
    );
  }

  defaultMessage(args: ValidationArguments) {
    return `${args.property} must not contain ${BLOCKED_PATTERNS.map(
      ({ label }) => label,
    ).join(', ')}, or any of these tags: ${BLOCKED_TAGS.join(', ')}`;
  }
}
