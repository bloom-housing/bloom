import { Test, TestingModule } from '@nestjs/testing';
import { randomUUID } from 'crypto';
import { GeocodingService } from '../../../src/services/geocoding.service';
import { PrismaService } from '../../../src/services/prisma.service';
import { Address } from '../../../src/dtos/addresses/address.dto';
import { ValidationMethod } from '../../../src/enums/multiselect-questions/validation-method-enum';
import { InputType } from '../../../src/enums/shared/input-type-enum';
import Listing from '../../../src/dtos/listings/listing.dto';
import { simplifiedDCMap } from '../../../prisma/seed-helpers/map-layer-factory';
import { FeatureCollection } from '@turf/helpers';
import { ApplicationMultiselectQuestion } from '../../../src/dtos/applications/application-multiselect-question.dto';
import { Application } from '../../../src/dtos/applications/application.dto';

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
    });
    it("should return 'false' if address is within layer", () => {
      expect(
        service.verifyLayers(
          { ...address, latitude: 39.284205, longitude: -76.621698 },
          featureCollection,
        ),
      ).toBe(false);
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
});
