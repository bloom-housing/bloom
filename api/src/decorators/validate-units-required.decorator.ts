import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
  ValidationTypes,
} from 'class-validator';
import { PrismaService } from '../services/prisma.service';
import { ListingUpdate } from '../dtos/listings/listing-update.dto';
import { FeatureFlagEnum } from '../enums/feature-flags/feature-flags-enum';
import { ListingsStatusEnum } from '@prisma/client';

/*
  Validates if jurisdiction can handle either unit or unit group and 
  fail if the opposite is sent
*/
export function ValidateOnlyUnitsOrUnitGroups(
  validationOptions?: ValidationOptions,
) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'validateOnlyUnitsOrUnitGroups',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      async: true,
      validator: {
        async validate(value: unknown[], args: ValidationArguments) {
          const object = args.object as ListingUpdate;
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

          // Not valid to have units on unit group jurisdiction
          if (
            propertyName === 'units' &&
            hasUnitGroupsEnabled &&
            value &&
            value.length > 0
          ) {
            return false;
          }

          // Not valid to have unit groups on a units jurisdiction
          if (
            propertyName === 'unitGroups' &&
            !hasUnitGroupsEnabled &&
            value &&
            value.length > 0
          ) {
            return false;
          }

          return true;
        },
        defaultMessage: (args: ValidationArguments) =>
          `${args.property} cannot exist on this jurisdiction`,
      },
    });
  };
}

/*
  Validates if validated value is array with at least 1 element for publishing if in requiredList
  This validation should pass regardless of value for non-publishing listing
*/
export function ValidateAtLeastOneUnit(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: ValidationTypes.IS_DEFINED,
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

          const hasFieldRequired =
            object?.requiredFields?.includes(propertyName);

          return !hasFieldRequired || (value && value.length > 0);
        },
        defaultMessage: (args: ValidationArguments) =>
          `${args.property} must contain at least 1 element`,
      },
    });
  };
}
