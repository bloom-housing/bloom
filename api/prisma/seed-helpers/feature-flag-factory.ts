import { Prisma } from '@prisma/client';
import { randomBoolean } from './boolean-generator';
import { randomAdjective, randomName } from './word-generator';

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
