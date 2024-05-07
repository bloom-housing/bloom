import { Prisma } from '@prisma/client';
import { randomAdjective, randomName } from './word-generator';
import { randomInt } from 'crypto';

const race = [
  'asian',
  'asian-southAsian',
  'asian-otherAsian',
  'asian-chinese',
  'black-africanAmerican',
  'asian-filipino',
  'pacificIslander-chamorro',
  'asian-japanese',
  'asian-korean',
  'indigenous',
  'pacificIslander-nativeHawaiian',
  'pacificIslander-otherPacificIslander',
  'pacificIslander-otherPacificIslander:Fijian',
  'pacificIslander-samoan',
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
