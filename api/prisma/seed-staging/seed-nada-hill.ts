import { PrismaClient } from '@prisma/client';
import { jurisdictionFactory } from '../seed-helpers/jurisdiction-factory';

export const createNadaHillJurisdiction = async (
  prismaClient: PrismaClient,
  {
    publicSiteBaseURL,
  }: {
    publicSiteBaseURL: string;
  },
) => {
  return await prismaClient.jurisdictions.create({
    data: jurisdictionFactory('Nada Hill', {
      publicSiteBaseURL,
      featureFlags: [],
      requiredListingFields: ['name'],
    }),
  });
};
