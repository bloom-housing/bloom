import { Prisma } from '@prisma/client';
import { randomAdjective, randomName } from './word-generator';
import { randomInt } from 'crypto';

const race = [
  'americanIndianAlaskanNative',
  'asian',
  'asian-asianIndian',
  'asian-otherAsian',
  'blackAfricanAmerican',
  'asian-chinese',
  'declineToRespond',
  'asian-filipino',
  'nativeHawaiianOtherPacificIslander-guamanianOrChamorro',
  'asian-japanese',
  'asian-korean',
  'nativeHawaiianOtherPacificIslander-nativeHawaiian',
  'nativeHawaiianOtherPacificIslander',
  'nativeHawaiianOtherPacificIslander:Fijian',
  'otherMultiracial: Black African American and white',
  'nativeHawaiianOtherPacificIslander-otherPacificIslander',
  'nativeHawaiianOtherPacificIslander-samoan',
  'asian-vietnamese',
  'white',
];

const randomRace = () => {
  return race[randomInt(race.length - 1)];
};

export const demographicsFactory =
  async (): Promise<Prisma.DemographicsCreateWithoutApplicationsInput> => ({
    ethnicity: randomAdjective(),
    howDidYouHear: [randomName()],
    race: [randomRace()],
  });
