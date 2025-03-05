import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
  getMetadataStorage,
  ValidationTypes,
  ValidateIf,
  buildMessage,
} from 'class-validator';
// import { ValidationMetadata } from 'class-validator/types/metadata/ValidationMetadata';
import { PrismaService } from '../services/prisma.service';
import { ListingPublishedUpdate } from '../dtos/listings/listing-published-update.dto';
import { FeatureFlagEnum } from '../enums/feature-flags/feature-flags-enum';
// import { ValidationMetadataArgs } from 'class-validator/types/metadata/ValidationMetadataArgs';
import { group } from 'console';

export function IsOptionalIf(
  condition: (object: any, value: any) => boolean,
  validationOptions?: ValidationOptions,
) {
  console.log('HERE!!!!');
  return ValidateIf(condition, {
    ...validationOptions,
    message: buildMessage(
      (eachPrefix) =>
        eachPrefix + '$property is required when the condition is met',
      validationOptions?.context,
    ),
  });
}
