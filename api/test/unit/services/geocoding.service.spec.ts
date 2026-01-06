import { randomUUID } from 'crypto';
import { Test, TestingModule } from '@nestjs/testing';
import { FeatureCollection } from '@turf/helpers';
import {
  redlinedMap,
  simplifiedDCMap,
} from '../../../prisma/seed-helpers/map-layer-factory';
import { Address } from '../../../src/dtos/addresses/address.dto';
import { Application } from '../../../src/dtos/applications/application.dto';
import { ApplicationMultiselectQuestion } from '../../../src/dtos/applications/application-multiselect-question.dto';
import Listing from '../../../src/dtos/listings/listing.dto';
import { InputType } from '../../../src/enums/shared/input-type-enum';
import { ValidationMethod } from '../../../src/enums/multiselect-questions/validation-method-enum';
import { GeocodingService } from '../../../src/services/geocoding.service';
import { PrismaService } from '../../../src/services/prisma.service';

describe('GeocodingService', () => {
  let service: GeocodingService;
  let prisma: PrismaService;
  const date = new Date();
  const address: Address = {
    id: 'id',
    createdAt: date,
    updatedAt: date,
    city: 'Washington',
    county: null,
    state: 'DC',
    street: '1600 Pennsylvania Avenue',
    street2: null,
    zipCode: '20500',
    latitude: 38.8977,
    longitude: -77.0365,
  };
  const featureCollection = simplifiedDCMap as unknown as FeatureCollection;
  const featureCollection2 = redlinedMap as unknown as FeatureCollection;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PrismaService, GeocodingService],
    }).compile();

    service = module.get<GeocodingService>(GeocodingService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  describe('verifyRadius', () => {
    it("should return 'unknown' if lat and long not there", () => {
      expect(
        service.verifyRadius(
          {
            ...address,
            latitude: null,
            longitude: null,
          },
          5,
          address,
        ),
      ).toBe(null);
    });
    it("should return 'true' if within radius", () => {
      expect(
        service.verifyRadius(
          {
            ...address,
            latitude: 38.89485,
            longitude: -77.04251,
          },
          5,
          address,
        ),
      ).toBe(true);
    });
    it("should return 'false' if not within radius", () => {
      expect(
        service.verifyRadius(
          {
            ...address,
            latitude: 39.284205,
            longitude: -76.621698,
          },
          5,
          address,
        ),
      ).toBe(false);
    });
    it("should return 'true' if same lat long", () => {
      expect(
        service.verifyRadius(
          {
            ...address,
          },
          5,
          address,
        ),
      ).toBe(true);
    });
  });

  describe('verifyLayers', () => {
    it('should return null if no lat/long', () => {
      expect(
        service.verifyLayers(
          {
            ...address,
            latitude: null,
            longitude: null,
          },
          featureCollection,
        ),
      ).toBe(null);
    });
    it("should return 'true' if address is within layer", () => {
      expect(service.verifyLayers(address, featureCollection)).toBe(true);
      expect(
        service.verifyLayers(
          {
            ...address,
            latitude: 37.870318963458324,
            longitude: -122.30141799736678,
          },
          featureCollection2,
        ),
      ).toBe(true);
    });
    it("should return 'false' if address is not within layer", () => {
      expect(
        service.verifyLayers(
          { ...address, latitude: 39.284205, longitude: -76.621698 },
          featureCollection,
        ),
      ).toBe(false);
      expect(service.verifyLayers(address, featureCollection2)).toBe(false);
    });
  });

  describe('validateRadiusPreferences', () => {
    const listing = {
      listingsBuildingAddress: address,
      listingMultiselectQuestions: [
        {
          multiselectQuestions: {
            options: [
              {
                text: 'Geocoding option by radius',
                collectAddress: true,
                radiusSize: 5,
                validationMethod: ValidationMethod.radius,
              },
            ],
          },
        },
      ],
    };
    const preferenceAddress = {
      ...address,
      latitude: 38.89485,
      longitude: -77.04251,
    };
    const preferences = [
      {
        key: 'Geocoding preference',
        options: [
          {
            key: 'Geocoding option by radius',
            checked: true,
            extraData: [
              {
                type: InputType.address,
                value: preferenceAddress,
              },
            ],
          },
        ],
      },
    ];

    it('should save the validated value as extraData', async () => {
      const response = service.validateRadiusPreferences(
        preferences as unknown as ApplicationMultiselectQuestion[],
        listing as Listing,
      );
      expect(response).toEqual([
        {
          key: 'Geocoding preference',
          options: [
            {
              key: 'Geocoding option by radius',
              checked: true,
              extraData: [
                {
                  type: InputType.address,
                  value: preferenceAddress,
                },
                {
                  key: 'geocodingVerified',
                  type: InputType.text,
                  value: true,
                },
              ],
            },
          ],
        },
      ]);
    });

    it('should save unknown as value in extraData', async () => {
      const preferences = [
        {
          key: 'Geocoding preference',
          options: [
            {
              key: 'Geocoding option by radius',
              checked: true,
              extraData: [
                {
                  type: InputType.address,
                  value: {
                    ...preferenceAddress,
                    latitude: null,
                    longitude: null,
                  },
                },
              ],
            },
          ],
        },
      ];
      const response = service.validateRadiusPreferences(
        preferences as unknown as ApplicationMultiselectQuestion[],
        listing as Listing,
      );
      expect(response).toEqual([
        {
          key: 'Geocoding preference',
          options: [
            {
              key: 'Geocoding option by radius',
              checked: true,
              extraData: [
                {
                  type: InputType.address,
                  value: {
                    ...preferenceAddress,
                    latitude: null,
                    longitude: null,
                  },
                },
                {
                  key: 'geocodingVerified',
                  type: InputType.text,
                  value: 'unknown',
                },
              ],
            },
          ],
        },
      ]);
    });
  });

  describe('validateGeoLayerPreferences', () => {
    const mapLayer = { id: randomUUID(), featureCollection: simplifiedDCMap };
    const listing = {
      buildingAddress: address,
      listingMultiselectQuestions: [
        {
          multiselectQuestions: {
            options: [
              {
                text: 'Geocoding option by map',
                collectAddress: true,
                mapLayerId: mapLayer.id,
                validationMethod: ValidationMethod.map,
              },
            ],
          },
        },
      ],
    };
    const preferenceAddress = {
      ...address,
      latitude: 38.89485,
      longitude: -77.04251,
    };

    const preference = {
      key: 'Geocoding preference',
      options: [
        {
          key: 'Geocoding option by map',
          checked: true,
          extraData: [
            {
              type: InputType.address,
              value: preferenceAddress,
              key: 'address',
            },
          ],
        },
      ],
    };
    it('should save the validated value as extraData for map layer', async () => {
      prisma.mapLayers.findMany = jest.fn().mockResolvedValue([mapLayer]);
      const response = await service.validateGeoLayerPreferences(
        [preference] as unknown as ApplicationMultiselectQuestion[],
        listing as unknown as Listing,
      );

      expect(response).toEqual([
        {
          key: 'Geocoding preference',
          options: [
            {
              key: 'Geocoding option by map',
              checked: true,
              extraData: [
                {
                  type: InputType.address,
                  value: preferenceAddress,
                  key: 'address',
                },
                {
                  key: 'geocodingVerified',
                  type: InputType.text,
                  value: true,
                },
              ],
            },
          ],
        },
      ]);
    });
  });

  describe('validateGeocodingPreferences', () => {
    const mapLayer = { id: randomUUID(), featureCollection: simplifiedDCMap };
    const listing = {
      listingsBuildingAddress: address,
      listingMultiselectQuestions: [
        {
          multiselectQuestions: {
            options: [
              {
                text: 'Geocoding option by radius',
                collectAddress: true,
                radiusSize: 5,
                validationMethod: ValidationMethod.radius,
              },
            ],
          },
        },
        {
          multiselectQuestions: {
            options: [
              {
                text: 'Geocoding option by map',
                collectAddress: true,
                mapLayerId: mapLayer.id,
                validationMethod: ValidationMethod.map,
              },
            ],
          },
        },
        {
          multiselectQuestions: {
            options: [
              {
                text: 'non-geocoding option',
              },
            ],
          },
        },
      ],
    };

    const preferenceAddress = {
      ...address,
      latitude: 38.89485,
      longitude: -77.04251,
    };
    const preferences = [
      {
        key: 'Geocoding preference by map',
        options: [
          {
            key: 'Geocoding option by map',
            checked: true,
            extraData: [
              {
                type: InputType.address,
                value: preferenceAddress,
              },
            ],
          },
        ],
      },
      {
        key: 'Geocoding preference by radius',
        options: [
          {
            key: 'Geocoding option by radius',
            checked: true,
            extraData: [
              {
                type: InputType.address,
                value: preferenceAddress,
              },
            ],
          },
        ],
      },
      {
        key: 'non-geocoding preference',
        options: [
          {
            key: 'non-geocoding option',
            checked: true,
          },
        ],
      },
    ];

    const application = {
      id: 'applicationId',
      preferences: preferences,
    };

    it('should save all updated preferences', async () => {
      prisma.mapLayers.findMany = jest.fn().mockResolvedValue([mapLayer]);
      prisma.applications.update = jest.fn().mockResolvedValue('');
      await service.validateGeocodingPreferences(
        application as unknown as Application,
        listing as unknown as Listing,
      );

      expect(prisma.applications.update).toBeCalledWith({
        where: { id: 'applicationId' },
        data: {
          preferences: expect.arrayContaining([
            expect.objectContaining({
              key: 'Geocoding preference by map',
              options: [
                {
                  checked: true,
                  extraData: [
                    {
                      type: 'address',
                      value: preferenceAddress,
                    },
                    { key: 'geocodingVerified', type: 'text', value: true },
                  ],
                  key: 'Geocoding option by map',
                },
              ],
            }),
            expect.objectContaining({
              key: 'Geocoding preference by radius',
              options: [
                {
                  checked: true,
                  extraData: [
                    {
                      type: 'address',
                      value: preferenceAddress,
                    },
                    { key: 'geocodingVerified', type: 'text', value: true },
                  ],
                  key: 'Geocoding option by radius',
                },
              ],
            }),
            expect.objectContaining({
              key: 'non-geocoding preference',
              options: [
                {
                  checked: true,
                  key: 'non-geocoding option',
                },
              ],
            }),
          ]),
        },
      });
    });
  });

  describe('validateGeocodingPreferencesV2', () => {
    const mapLayer1 = {
      id: randomUUID(),
      featureCollection: featureCollection,
    };
    const mapLayer2 = {
      id: randomUUID(),
      featureCollection: featureCollection2,
    };
    const mapOptionId1 = randomUUID();
    const mapOptionId2 = randomUUID();
    const radiusOptionId = randomUUID();
    const multiselectOptions = [
      {
        id: mapOptionId1,
        createdAt: date,
        updatedAt: date,
        mapLayerId: mapLayer1.id,
        name: 'Geocoding option by map DC',
        ordinal: 1,
        shouldCollectAddress: true,
        text: 'Geocoding option by map DC',
        validationMethod: ValidationMethod.map,
      },
      {
        id: mapOptionId2,
        createdAt: date,
        updatedAt: date,
        mapLayerId: mapLayer2.id,
        name: 'Geocoding option by map redlined',
        ordinal: 2,
        shouldCollectAddress: true,
        text: 'Geocoding option by map redlined',
        validationMethod: ValidationMethod.map,
      },
      {
        id: radiusOptionId,
        createdAt: date,
        updatedAt: date,
        name: 'Geocoding option by radius',
        ordinal: 3,
        radiusSize: 5,
        shouldCollectAddress: true,
        text: 'Geocoding option by radius',
        validationMethod: ValidationMethod.radius,
      },
      {
        id: randomUUID(),
        createdAt: date,
        updatedAt: date,
        name: 'non-geocoding option',
        ordinal: 4,
        text: 'non-geocoding option',
      },
    ];
    const listingsBuildingAddress = address;

    const selectionAddress = {
      ...address,
      latitude: 38.89485,
      longitude: -77.04251,
    };
    const selectionOptionId1 = randomUUID();
    const selectionOptionId2 = randomUUID();
    const selectionOptionId3 = randomUUID();
    const selectionOptionId4 = randomUUID();

    const applicationSelections = [
      {
        id: randomUUID(),
        createdAt: date,
        updatedAt: date,
        application: { id: randomUUID() },
        multiselectQuestion: { id: randomUUID() },
        selections: [
          {
            id: selectionOptionId1,
            createdAt: date,
            updatedAt: date,
            addressHolderAddress: selectionAddress,
            applicationSelection: { id: randomUUID() },
            multiselectOption: {
              id: mapOptionId1,
            },
          },
          {
            id: selectionOptionId2,
            createdAt: date,
            updatedAt: date,
            addressHolderAddress: selectionAddress,
            applicationSelection: { id: randomUUID() },
            multiselectOption: {
              id: mapOptionId2,
            },
          },
          {
            id: selectionOptionId3,
            createdAt: date,
            updatedAt: date,
            addressHolderAddress: selectionAddress,
            applicationSelection: { id: randomUUID() },
            multiselectOption: {
              id: radiusOptionId,
            },
          },
          {
            id: selectionOptionId4,
            createdAt: date,
            updatedAt: date,
            addressHolderAddress: selectionAddress,
            applicationSelection: { id: randomUUID() },
            multiselectOption: {
              id: randomUUID(),
            },
          },
        ],
      },
    ];

    it('should save all updated preferences', async () => {
      prisma.mapLayers.findMany = jest
        .fn()
        .mockResolvedValue([mapLayer1, mapLayer2]);
      prisma.applicationSelectionOptions.update = jest
        .fn()
        .mockResolvedValue('');
      await service.validateGeocodingPreferencesV2(
        applicationSelections,
        listingsBuildingAddress,
        multiselectOptions,
      );

      expect(prisma.applicationSelectionOptions.update).toHaveBeenCalledTimes(
        3,
      );
      expect(prisma.applicationSelectionOptions.update).toHaveBeenNthCalledWith(
        1,
        {
          data: {
            isGeocodingVerified: true,
          },
          where: { id: selectionOptionId1 },
        },
      );
      expect(prisma.applicationSelectionOptions.update).toHaveBeenNthCalledWith(
        2,
        {
          data: {
            isGeocodingVerified: false,
          },
          where: { id: selectionOptionId2 },
        },
      );
      expect(prisma.applicationSelectionOptions.update).toHaveBeenNthCalledWith(
        3,
        {
          data: {
            isGeocodingVerified: true,
          },
          where: { id: selectionOptionId3 },
        },
      );
    });
  });
});
