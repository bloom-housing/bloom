import { Prisma } from '@prisma/client';
import { randomInt } from 'crypto';
import { randomAdjective, randomNoun } from './word-generator';
import { AlternateContactRelationship } from '../../src/enums/applications/alternate-contact-relationship-enum';
import { addressFactory } from './address-factory';

export const alternateContactFactory =
  (): Prisma.AlternateContactCreateWithoutApplicationsInput => {
    const relationshipKeys = Object.values(AlternateContactRelationship);
    const firstName = randomNoun();
    const lastName = randomNoun();
    const relationshipType =
      relationshipKeys[randomInt(relationshipKeys.length)];

    if (relationshipType === AlternateContactRelationship.noContact) {
      return {
        firstName: undefined,
        lastName: undefined,
        type: relationshipType,
        otherType: undefined,
        phoneNumber: undefined,
        emailAddress: undefined,
        address: undefined,
        agency: undefined,
      };
    }
    return {
      firstName: firstName,
      lastName: lastName,
      type: relationshipType,
      otherType:
        relationshipType === AlternateContactRelationship.other
          ? randomAdjective()
          : undefined,
      phoneNumber: '(123) 123-1231',
      emailAddress: `${firstName}.${lastName}@example.com`,
      address: { create: addressFactory() },
      agency:
        relationshipType === AlternateContactRelationship.caseManager
          ? randomAdjective()
          : undefined,
    };
  };
