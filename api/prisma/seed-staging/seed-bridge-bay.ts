import { LanguagesEnum, PrismaClient } from '@prisma/client';
import { jurisdictionFactory } from '../seed-helpers/jurisdiction-factory';
import { FeatureFlagEnum } from '../../src/enums/feature-flags/feature-flags-enum';
import {
  defaultListingFeatureConfiguration,
  defaultRaceEthnicityConfiguration,
} from '../seed-staging';

export const createBridgeBayJurisdiction = async (
  prismaClient: PrismaClient,
  {
    publicSiteBaseURL,
    msqV2,
  }: {
    publicSiteBaseURL: string;
    msqV2: boolean;
  },
) => {
  const optionalV2MSQ = msqV2 ? [FeatureFlagEnum.enableV2MSQ] : [];

  return await prismaClient.jurisdictions.create({
    data: jurisdictionFactory('Bridge Bay', {
      publicSiteBaseURL,
      featureFlags: [
        ...optionalV2MSQ,
        FeatureFlagEnum.enableGeocodingPreferences,
        FeatureFlagEnum.enableGeocodingRadiusMethod,
        FeatureFlagEnum.enableLeasingAgentAltText,
        FeatureFlagEnum.enableListingFiltering,
        FeatureFlagEnum.enableListingOpportunity,
        FeatureFlagEnum.enableListingPagination,
        FeatureFlagEnum.enablePartnerDemographics,
        FeatureFlagEnum.enablePartnerSettings,
      ],
      languages: [LanguagesEnum.en, LanguagesEnum.es, LanguagesEnum.vi],
      listingFeaturesConfiguration: defaultListingFeatureConfiguration,
      raceEthnicityConfiguration: defaultRaceEthnicityConfiguration,
    }),
  });
};
