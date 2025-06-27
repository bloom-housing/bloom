import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';
import { PrismaService } from '../services/prisma.service';
import { ListingUpdate } from '../dtos/listings/listing-update.dto';
import { FeatureFlagEnum } from '../enums/feature-flags/feature-flags-enum';
import { ListingsStatusEnum } from '@prisma/client';

/*
  Validates if validated value is array with at least 1 element
  only when the jurisdiction has the feature flag enableUnitGroups enabled.
  (used for units as they should not be required when unitGroups are used)
*/
export function ValidateUnitsRequired(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'validateUnitsRequired',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      async: true,
      validator: {
        async validate(value: unknown[], args: ValidationArguments) {
          const object = args.object as ListingUpdate;
          // At least 1 unit or unit group is only required if publishing the listing
          if (
            !(
              ListingsStatusEnum.active === object.status ||
              ListingsStatusEnum.pendingReview === object.status
            )
          ) {
            return true;
          }
          const jurisdictionId = object.jurisdictions?.id;
          if (!jurisdictionId) return true;

          const prisma = new PrismaService();
          const jurisdiction = await prisma.jurisdictions.findFirst({
            where: { id: jurisdictionId },
            include: { featureFlags: true },
          });

          const hasUnitGroupsEnabled = jurisdiction?.featureFlags?.some(
            (flag) =>
              flag.name === FeatureFlagEnum.enableUnitGroups && flag.active,
          );

          return hasUnitGroupsEnabled || (value && value.length > 0);
        },
        defaultMessage: (args: ValidationArguments) =>
          `${args.property} must contain at least 1 elements`,
      },
    });
  };
}
