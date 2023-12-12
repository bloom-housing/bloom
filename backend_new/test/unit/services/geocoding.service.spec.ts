import { Test, TestingModule } from '@nestjs/testing';
import { GeocodingService } from '../../../src/services/geocoding.service';
import { PrismaService } from '../../../src/services/prisma.service';
import { Address } from '../../../src/dtos/addresses/address.dto';
import { ValidationMethod } from '../../../src/enums/multiselect-questions/validation-method-enum';
import { InputType } from '../../../src/enums/shared/input-type-enum';
import { Application } from '../../../src/dtos/applications/application.dto';
import Listing from '../../../src/dtos/listings/listing.dto';
import { randomUUID } from 'crypto';

describe('GeocodingService', () => {
  let service: GeocodingService;
  let prisma: PrismaService;
  const date = new Date();
  const listingAddress: Address = {
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
            ...listingAddress,
            latitude: null,
            longitude: null,
          },
          5,
          listingAddress,
        ),
      ).toBe(null);
    });
    it("should return 'true' if within radius", () => {
      expect(
        service.verifyRadius(
          {
            ...listingAddress,
            latitude: 38.89485,
            longitude: -77.04251,
          },
          5,
          listingAddress,
        ),
      ).toBe(true);
    });
    it("should return 'false' if not within radius", () => {
      expect(
        service.verifyRadius(
          {
            ...listingAddress,
            latitude: 39.284205,
            longitude: -76.621698,
          },
          5,
          listingAddress,
        ),
      ).toBe(false);
    });
    it("should return 'true' if same lat long", () => {
      expect(
        service.verifyRadius(
          {
            ...listingAddress,
          },
          5,
          listingAddress,
        ),
      ).toBe(true);
    });
  });
  describe('validateRadiusPreferences', () => {
    const listing = {
      listingsBuildingAddress: listingAddress,
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

    const application = (address) => {
      return {
        id: 'applicationId',
        preferences: [
          {
            key: 'Geocoding preference',
            options: [
              {
                key: 'Geocoding option by radius',
                checked: true,
                extraData: [
                  {
                    type: InputType.address,
                    value: address,
                  },
                ],
              },
            ],
          },
        ],
      };
    };

    it('should save the validated value as extraData', async () => {
      const preferenceAddress = {
        ...listingAddress,
        latitude: 38.89485,
        longitude: -77.04251,
      };
      prisma.applications.update = jest
        .fn()
        .mockResolvedValue({ id: randomUUID() });
      await service.validateRadiusPreferences(
        application(preferenceAddress) as unknown as Application,
        listing as unknown as Listing,
      );
      expect(prisma.applications.update).toBeCalledWith({
        where: { id: 'applicationId' },
        data: {
          preferences: expect.arrayContaining([
            expect.objectContaining({
              key: 'Geocoding preference',
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
          ]),
        },
      });
    });

    it('should save unknown as value in extraData', async () => {
      const preferenceAddress = {
        ...listingAddress,
        latitude: null,
        longitude: null,
      };
      prisma.applications.update = jest
        .fn()
        .mockResolvedValue({ id: randomUUID() });
      await service.validateRadiusPreferences(
        application(preferenceAddress) as unknown as Application,
        listing as unknown as Listing,
      );
      expect(prisma.applications.update).toBeCalledWith({
        where: { id: 'applicationId' },
        data: {
          preferences: expect.arrayContaining([
            expect.objectContaining({
              key: 'Geocoding preference',
              options: [
                {
                  checked: true,
                  extraData: [
                    {
                      type: 'address',
                      value: preferenceAddress,
                    },
                    {
                      key: 'geocodingVerified',
                      type: 'text',
                      value: 'unknown',
                    },
                  ],
                  key: 'Geocoding option by radius',
                },
              ],
            }),
          ]),
        },
      });
    });
  });
});
