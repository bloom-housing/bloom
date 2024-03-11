import { Prisma } from '@prisma/client';
import { randomInt } from 'node:crypto';

export const addressFactory =
  (): Prisma.AddressCreateWithoutBuildingAddressInput =>
    [
      whiteHouse,
      yellowstone,
      goldenGateBridge,
      washingtonMonument,
      lincolnMemorial,
    ][randomInt(5)];

export const whiteHouse = {
  placeName: 'White House',
  city: 'Washington',
  county: 'Santa Clara',
  state: 'DC',
  street: '1600 Pennsylvania Avenue',
  street2: null,
  zipCode: '20500',
  latitude: 38.8977,
  longitude: -77.0365,
};

export const yellowstone = {
  placeName: 'Yellowstone National Park',
  city: 'Yellowstone National Park',
  county: 'Marin',
  state: 'WY',
  street: '3200 Old Faithful Inn Rd',
  street2: null,
  zipCode: '82190',
  latitude: 44.459928576661824,
  longitude: -110.83109211487681,
};

export const goldenGateBridge = {
  placeName: 'Golden Gate Bridge',
  city: 'San Francisco',
  county: 'Santa Clara',
  state: 'CA',
  street: 'Golden Gate Brg',
  street2: null,
  zipCode: '94129',
  latitude: 37.820589659186425,
  longitude: -122.47842676136818,
};

export const washingtonMonument = {
  placeName: 'Washington Monument',
  city: 'Washington',
  county: 'Contra Costa',
  state: 'DC',
  street: '2 15th St NW',
  street2: null,
  zipCode: '20024',
  latitude: 38.88983672842871,
  longitude: -77.03522750134796,
};

export const lincolnMemorial = {
  placeName: 'Lincoln Memorial',
  city: 'Washington',
  county: 'Sonoma',
  state: 'DC',
  street: '2 Lincoln Memorial Cir NW',
  street2: null,
  zipCode: '20002',
  latitude: 38.88958323798129,
  longitude: -77.05024900814298,
};
