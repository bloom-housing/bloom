import { Prisma } from '@prisma/client';
import { randomAdjective, randomName } from './word-generator';

export const demographicsFactory =
  async (): Promise<Prisma.DemographicsCreateWithoutApplicationsInput> => ({
    ethnicity: randomAdjective(),
    gender: randomAdjective(),
    sexualOrientation: randomAdjective(),
    howDidYouHear: [randomName()],
    race: [randomAdjective()],
  });
