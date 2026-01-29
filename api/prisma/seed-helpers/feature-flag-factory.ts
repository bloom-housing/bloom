import { Prisma } from '@prisma/client';
import { randomBoolean } from './boolean-generator';
import { randomAdjective, randomName } from './word-generator';
import { featureFlagMap } from '../../src/enums/feature-flags/feature-flags-enum';
import { PrismaService } from '../../src/services/prisma.service';

export const createAllFeatureFlags = async (prismaClient: PrismaService) => {
  await prismaClient.featureFlags.createMany({
    data: featureFlagMap.map((flag) => {
      return { ...flag, active: true };
    }),
    skipDuplicates: true,
  });
};

export const attachJurisdictionToFlags = async (
  jurisdiction: string,
  featureFlags: string[],
  prismaClient: PrismaService,
) => {
  for (const flag of featureFlags) {
    await prismaClient.featureFlags.update({
      where: {
        name: flag,
      },
      data: {
        jurisdictions: {
          connect: {
            id: jurisdiction,
          },
        },
      },
    });
  }
};

export const featureFlagFactory = (
  name = randomName(),
  active = randomBoolean(),
  description = `${randomAdjective()} feature flag`,
  jurisdictionIds?: string[],
): Prisma.FeatureFlagsCreateInput => ({
  name: name,
  description: description,
  active: active,
  jurisdictions: jurisdictionIds
    ? {
        connect: jurisdictionIds.map((jurisdiction) => {
          return {
            id: jurisdiction,
          };
        }),
      }
    : undefined,
});
