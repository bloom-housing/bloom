import { point } from '@turf/helpers';
import buffer from '@turf/buffer';
import booleanPointInPolygon from '@turf/boolean-point-in-polygon';
import { Prisma } from '@prisma/client';
import { Injectable } from '@nestjs/common';
import { Application } from '../dtos/applications/application.dto';
import Listing from '../dtos/listings/listing.dto';
import { MultiselectOption } from '../dtos/multiselect-questions/multiselect-option.dto';
import { ApplicationMultiselectQuestion } from '../dtos/applications/application-multiselect-question.dto';
import { PrismaService } from './prisma.service';
import { ValidationMethod } from '../enums/multiselect-questions/validation-method-enum';
import { ApplicationMultiselectQuestionOption } from '../dtos/applications/application-multiselect-question-option.dto';
import { Address } from '../dtos/addresses/address.dto';
import { InputType } from '../enums/shared/input-type-enum';

@Injectable()
export class GeocodingService {
  constructor(private prisma: PrismaService) {}

  public async validateGeocodingPreferences(
    application: Application,
    listing: Listing,
  ) {
    await this.validateRadiusPreferences(application, listing);
  }

  verifyRadius(
    preferenceAddress: Address,
    radius: number,
    listingAddress: Address,
  ): boolean | null {
    try {
      if (preferenceAddress.latitude && preferenceAddress.longitude) {
        const preferencePoint = point([
          Number.parseFloat(preferenceAddress.longitude.toString()),
          Number.parseFloat(preferenceAddress.latitude.toString()),
        ]);
        const listingPoint = point([
          Number.parseFloat(listingAddress.longitude.toString()),
          Number.parseFloat(listingAddress.latitude.toString()),
        ]);
        const calculatedBuffer = buffer(listingPoint.geometry, radius, {
          units: 'miles',
        });
        return booleanPointInPolygon(preferencePoint, calculatedBuffer)
          ? true
          : false;
      }
    } catch (e) {
      console.log('e', e);
      console.log('error happened while calculating radius');
    }
    return null;
  }

  public async validateRadiusPreferences(
    application: Application,
    listing: Listing,
  ) {
    // Get all radius preferences from the listing
    const radiusPreferenceOptions: MultiselectOption[] =
      listing.listingMultiselectQuestions?.reduce(
        (options, multiselectQuestion) => {
          const newOptions =
            multiselectQuestion.multiselectQuestions?.options?.filter(
              (option) => option.validationMethod === ValidationMethod.radius,
            );
          return [...options, ...newOptions];
        },
        [],
      );
    // If there are any radius preferences do the calculation and save the new preferences
    if (radiusPreferenceOptions?.length) {
      const preferences: ApplicationMultiselectQuestion[] =
        application.preferences.map((preference) => {
          const newPreferenceOptions: ApplicationMultiselectQuestionOption[] =
            preference.options.map((option) => {
              const addressData = option.extraData.find(
                (data) => data.type === InputType.address,
              );
              if (option.checked && addressData) {
                const foundOption = radiusPreferenceOptions.find(
                  (preferenceOption) => preferenceOption.text === option.key,
                );
                if (foundOption) {
                  const geocodingVerified = this.verifyRadius(
                    addressData.value as Address,
                    foundOption.radiusSize,
                    listing.listingsBuildingAddress,
                  );
                  return {
                    ...option,
                    extraData: [
                      ...option.extraData,
                      {
                        key: 'geocodingVerified',
                        type: InputType.text,
                        value:
                          // If the geocoding value was not able to be verified we need to set it as "unknown"
                          // in order to signify we are unable to automatically verify and manually checking will need to be done
                          geocodingVerified === null
                            ? 'unknown'
                            : geocodingVerified,
                      },
                    ],
                  };
                }
              }
              return option;
            });
          return { ...preference, options: newPreferenceOptions };
        });

      await this.prisma.applications.update({
        where: {
          id: application.id,
        },
        data: {
          preferences: preferences as unknown as Prisma.JsonArray,
        },
      });
    }
  }
}
