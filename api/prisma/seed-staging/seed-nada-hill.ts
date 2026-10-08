import { PrismaClient } from '@prisma/client';
import { jurisdictionFactory } from '../seed-helpers/jurisdiction-factory';
import { FeatureFlagEnum } from '../../src/enums/feature-flags/feature-flags-enum';

export const createNadaHillJurisdiction = async (
  prismaClient: PrismaClient,
  {
    publicSiteBaseURL,
    jurisdictionName = 'Nada Hill',
  }: {
    publicSiteBaseURL: string;
    jurisdictionName?: string;
  },
) => {
  return await prismaClient.jurisdictions.create({
    data: jurisdictionFactory(jurisdictionName, {
      publicSiteBaseURL,
      featureFlags: [FeatureFlagEnum.enableV2MSQ],
      requiredListingFields: ['name'],
    }),
  });
};
