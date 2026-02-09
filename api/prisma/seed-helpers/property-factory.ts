import { Prisma } from '@prisma/client';
import { randomName } from './word-generator';

export const propertyFactory = (
  jurisdictionName?: string,
  jurisdictionId?: string,
  name?: string,
  description?: string,
): Prisma.PropertiesCreateInput => ({
  name: `${name || randomName()}${
    jurisdictionName ? ` - ${jurisdictionName}` : ''
  }`,
  description: description || 'A sample property description',
  jurisdictions: {
    connect: {
      id: jurisdictionId,
    },
  },
});
