import { Prisma } from '@prisma/client';
import { randomAdjective, randomName } from './word-generator';
import { randomInt } from 'crypto';
import { raceMap } from '../../src/utilities/applications-utilities';

const raceKeys = Object.keys(raceMap);

const randomRace = () => {
  return raceKeys[randomInt(raceKeys.length)];
};

export const demographicsFactory =
  async (): Promise<Prisma.DemographicsCreateWithoutApplicationsInput> => ({
    ethnicity: randomAdjective(),
    gender: randomAdjective(),
    sexualOrientation: randomAdjective(),
    howDidYouHear: [randomName()],
    race: [randomRace()],
  });
