import { Prisma } from '@prisma/client';
import { randomAdjective, randomName } from './word-generator';
import { randomInt } from 'crypto';
import { RaceEthnicityConfiguration } from '../../src/dtos/jurisdictions/race-ethnicity-configuration.dto';
import { defaultRaceEthnicityConfiguration } from '../../prisma/seed-staging';

export const demographicsFactory = async (
  raceEthnicityConfiguration?: RaceEthnicityConfiguration,
): Promise<Prisma.DemographicsCreateWithoutApplicationsInput> => {
  const config =
    raceEthnicityConfiguration || defaultRaceEthnicityConfiguration;

  // Take just root keys without other options from the config
  const races: string[] =
    config.options
      .filter((option) => !option.id.includes('other'))
      .map((option) => option.id) || [];

  const randomRace = () => {
    return races[randomInt(races.length - 1)];
  };

  return {
    ethnicity: randomAdjective(),
    howDidYouHear: [randomName()],
    race: [randomRace()],
  };
};
