import { PrismaClient } from '@prisma/client';
import { jurisdictionFactory } from '../seed-helpers/jurisdiction-factory';

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
      featureFlags: [],
      requiredListingFields: ['name'],
    }),
  });
};
