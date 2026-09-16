import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { unusableTokens } from '../utilities/brand-tokens';

@ValidatorConstraint({ name: 'allowlistedTokens', async: false })
export class AllowlistedTokens implements ValidatorConstraintInterface {
  validate(tokens: unknown): boolean {
    if (tokens === null || tokens === undefined) return true;
    if (typeof tokens !== 'object' || Array.isArray(tokens)) return false;

    return !unusableTokens(tokens as Record<string, string>).length;
  }

  defaultMessage(args: ValidationArguments): string {
    const unusable = unusableTokens(args.value as Record<string, string>).join(
      ', ',
    );

    return unusable
      ? `these tokens are not overridable, or their values are: ${unusable}`
      : 'tokens must be an object of token names to values';
  }
}
