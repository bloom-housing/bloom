import { Prisma } from '@prisma/client';

export const addressFactory =
  (): Prisma.AddressCreateWithoutBuildingAddressInput => ({
    placeName: 'White House',
    city: 'Washington',
    county: null,
    state: 'DC',
    street: '1600 Pennsylvania Avenue',
    street2: null,
    zipCode: '20500',
    latitude: 38.8977,
    longitude: 77.0365,
  });
