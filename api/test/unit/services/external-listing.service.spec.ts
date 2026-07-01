import { AxiosResponse } from 'axios';
import { randomUUID } from 'crypto';
import dayjs from 'dayjs';
import { Observable, of } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { HttpException, Logger } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ListingsStatusEnum } from '@prisma/client';
import { randomNoun } from '../../../prisma/seed-helpers/word-generator';
import { ExternalListingService } from '../../../src/services/external-listing.service';
import { PrismaService } from '../../../src/services/prisma.service';

describe('Testing external listing service', () => {
  let httpService: HttpService;
  let prisma: PrismaService;
  let service: ExternalListingService;
  const externalURL = 'example.com';

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ExternalListingService,
        Logger,
        PrismaService,
        {
          provide: HttpService,
          useValue: {
            get: jest.fn(),
            pipe: jest.fn(),
          },
        },
      ],
    }).compile();

    httpService = module.get<HttpService>(HttpService);
    prisma = module.get<PrismaService>(PrismaService);
    service = module.get<ExternalListingService>(ExternalListingService);
  });

  afterEach(() => {
    jest.resetAllMocks();
    jest.clearAllMocks();
  });

  describe('Test externalize function', () => {
    it('should return object with lists of needed info', async () => {
      const jurisdictions = [
        { id: randomUUID(), name: randomNoun() },
        { id: randomUUID(), name: randomNoun() },
      ];
      const listings = [
        {
          id: randomUUID(),
          contentUpdatedAt: new Date(),
          jurisdictionId: randomUUID(),
        },
        {
          id: randomUUID(),
          contentUpdatedAt: new Date(),
          jurisdictionId: randomUUID(),
        },
      ];
      const reservedCommunityTypes = [
        { id: randomUUID(), name: randomNoun() },
        { id: randomUUID(), name: randomNoun() },
      ];
      const unitRentTypes = [
        { id: randomUUID(), name: randomNoun() },
        { id: randomUUID(), name: randomNoun() },
      ];
      const unitTypes = [
        { id: randomUUID(), name: randomNoun() },
        { id: randomUUID(), name: randomNoun() },
      ];

      prisma.jurisdictions.findMany = jest
        .fn()
        .mockResolvedValue(jurisdictions);
      prisma.listings.findMany = jest.fn().mockResolvedValue(listings);
      prisma.reservedCommunityTypes.findMany = jest
        .fn()
        .mockResolvedValue(reservedCommunityTypes);
      prisma.unitRentTypes.findMany = jest
        .fn()
        .mockResolvedValue(unitRentTypes);
      prisma.unitTypes.findMany = jest.fn().mockResolvedValue(unitTypes);

      const response = await service.externalize();

      expect(response).toStrictEqual({
        jurisdictions,
        listings,
        reservedCommunityTypes,
        unitRentTypes,
        unitTypes,
      });

      expect(prisma.jurisdictions.findMany).toHaveBeenCalledExactlyOnceWith({
        select: { id: true, name: true },
      });
      expect(prisma.listings.findMany).toHaveBeenCalledExactlyOnceWith({
        select: { id: true, contentUpdatedAt: true, jurisdictionId: true },
        where: { externalListingId: null, status: ListingsStatusEnum.active },
      });
      expect(
        prisma.reservedCommunityTypes.findMany,
      ).toHaveBeenCalledExactlyOnceWith({
        select: { id: true, name: true },
      });
      expect(prisma.unitRentTypes.findMany).toHaveBeenCalledExactlyOnceWith({
        select: { id: true, name: true },
      });
      expect(prisma.unitTypes.findMany).toHaveBeenCalledExactlyOnceWith({
        select: { id: true, name: true },
      });
    });
  });

  describe('Test ingest function', () => {
    it('should error if external call fails', async () => {
      const externalResponseFailure = { response: 'resp', status: '500' };

      // Create a spy on the `get` method of `httpService` and mock the implementation
      jest
        .spyOn(httpService, 'get')
        .mockImplementationOnce(
          () =>
            new Observable((subscriber) =>
              subscriber.error(externalResponseFailure),
            ),
        );

      await expect(
        service.ingest({ externalURL: '', jurisdictionId: '', targetName: '' }),
      ).rejects.toThrow(HttpException);
    });

    it('should error if jurisdiction cannot be matched', async () => {
      // Create a spy on the `get` method of `httpService` and mock the implementation
      const mockExternalDetailsResponse: AxiosResponse = {
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {
          headers: undefined,
        },
        data: {
          jurisdictions: [
            { id: randomUUID(), name: randomNoun() },
            { id: randomUUID(), name: randomNoun() },
          ],
          listings: [],
          reservedCommunityTypes: [],
          unitRentTypes: [],
          unitTypes: [],
        },
      };

      jest
        .spyOn(httpService, 'get')
        .mockImplementationOnce(() => of(mockExternalDetailsResponse));

      await expect(
        service.ingest({
          externalURL: 'example.com',
          jurisdictionId: randomUUID(),
          targetName: 'mismatch',
        }),
      ).rejects.toThrow(HttpException);
    });

    it('should call createExternalListing if external listing does not exist in the system', async () => {
      const externalJurisdictionId = randomUUID();
      const externalListingDate = new Date();
      const externalListingId = randomUUID();
      const externalRCTId = randomUUID();
      const externalURL = 'example.com';
      const externalURTId = randomUUID();
      const externalUTId = randomUUID();

      const mockExternalDetailsResponse: AxiosResponse = {
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {
          headers: undefined,
        },
        data: {
          jurisdictions: [
            { id: externalJurisdictionId, name: 'targetJurisdiction' },
          ],
          listings: [
            {
              id: externalListingId,
              contentUpdateAt: externalListingDate,
              jurisdictionId: externalJurisdictionId,
            },
          ],
          reservedCommunityTypes: [
            { id: externalRCTId, name: 'targetReservedCommunityType' },
          ],
          unitRentTypes: [{ id: externalURTId, name: 'targetUnitRentType' }],
          unitTypes: [{ id: externalUTId, name: 'targetUnitType' }],
        },
      };
      const mockExternalListingResponse: AxiosResponse = {
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {
          headers: undefined,
        },
        data: {
          id: externalListingId,
          assets: [],
          contentUpdatedAt: externalListingDate,
          displayWaitlistSize: false,
          isVerified: true,
          jurisdictions: [],
          name: 'example listing name',
          reservedCommunityTypes: {
            id: externalRCTId,
            name: 'targetReservedCommunityType',
          },
          status: ListingsStatusEnum.active,
          units: [],
        },
      };

      jest
        .spyOn(httpService, 'get')
        .mockImplementationOnce(() => of(mockExternalDetailsResponse))
        .mockImplementationOnce(() => of(mockExternalListingResponse));

      const internalJurisdictionId = randomUUID();
      const internalRCTId = randomUUID();
      const internalURTId = randomUUID();
      const internalUTId = randomUUID();

      prisma.listings.create = jest.fn().mockResolvedValue({});
      prisma.listings.findMany = jest.fn().mockResolvedValue([]);
      prisma.reservedCommunityTypes.findMany = jest
        .fn()
        .mockResolvedValue([
          { id: internalRCTId, name: 'targetReservedCommunityType' },
        ]);
      prisma.unitRentTypes.findMany = jest
        .fn()
        .mockResolvedValue([{ id: internalURTId, name: 'targetUnitRentType' }]);
      prisma.unitTypes.findMany = jest
        .fn()
        .mockResolvedValue([{ id: internalUTId, name: 'targetUnitType' }]);

      const response = await service.ingest({
        externalURL: externalURL,
        jurisdictionId: internalJurisdictionId,
        targetName: 'targetJurisdiction',
      });

      expect(response.success).toEqual(true);

      expect(prisma.listings.create).toHaveBeenCalledOnce();
    });

    it('should delete and recreate a listing if external listing has been updated', async () => {
      const externalJurisdictionId = randomUUID();
      const externalListingDate = new Date();
      const externalListingId = randomUUID();
      const externalRCTId = randomUUID();
      const externalURTId = randomUUID();
      const externalUTId = randomUUID();

      const mockExternalDetailsResponse: AxiosResponse = {
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {
          headers: undefined,
        },
        data: {
          jurisdictions: [
            { id: externalJurisdictionId, name: 'targetJurisdiction' },
          ],
          listings: [
            {
              id: externalListingId,
              contentUpdateAt: externalListingDate,
              jurisdictionId: externalJurisdictionId,
            },
          ],
          reservedCommunityTypes: [
            { id: externalRCTId, name: 'targetReservedCommunityType' },
          ],
          unitRentTypes: [{ id: externalURTId, name: 'targetUnitRentType' }],
          unitTypes: [{ id: externalUTId, name: 'targetUnitType' }],
        },
      };
      const mockExternalListingResponse: AxiosResponse = {
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {
          headers: undefined,
        },
        data: {
          id: externalListingId,
          assets: [],
          contentUpdatedAt: externalListingDate,
          displayWaitlistSize: false,
          isVerified: true,
          jurisdictions: [],
          name: 'example listing name',
          reservedCommunityTypes: {
            id: externalRCTId,
            name: 'targetReservedCommunityType',
          },
          status: ListingsStatusEnum.active,
          units: [],
        },
      };

      jest
        .spyOn(httpService, 'get')
        .mockImplementationOnce(() => of(mockExternalDetailsResponse))
        .mockImplementationOnce(() => of(mockExternalListingResponse));

      const internalJurisdictionId = randomUUID();
      const internalListingDate = dayjs(new Date())
        .subtract(1, 'days')
        .toDate();
      const internalListingId = randomUUID();
      const internalRCTId = randomUUID();
      const internalURTId = randomUUID();
      const internalUTId = randomUUID();

      prisma.listings.create = jest.fn().mockResolvedValue({});
      prisma.listings.delete = jest.fn().mockResolvedValue(undefined);
      prisma.listings.findMany = jest.fn().mockResolvedValue([
        {
          id: internalListingId,
          contentUpdatedAt: internalListingDate,
          externalListingId,
        },
      ]);
      prisma.reservedCommunityTypes.findMany = jest
        .fn()
        .mockResolvedValue([
          { id: internalRCTId, name: 'targetReservedCommunityType' },
        ]);
      prisma.unitRentTypes.findMany = jest
        .fn()
        .mockResolvedValue([{ id: internalURTId, name: 'targetUnitRentType' }]);
      prisma.unitTypes.findMany = jest
        .fn()
        .mockResolvedValue([{ id: internalUTId, name: 'targetUnitType' }]);

      const response = await service.ingest({
        externalURL: externalURL,
        jurisdictionId: internalJurisdictionId,
        targetName: 'targetJurisdiction',
      });

      expect(response.success).toEqual(true);

      expect(prisma.listings.delete).toHaveBeenCalledWith({
        where: { id: internalListingId },
      });
      expect(prisma.listings.create).toHaveBeenCalledOnce();
    });

    it('should do nothing if external listing has not been updated', async () => {
      const externalJurisdictionId = randomUUID();
      const externalListingDate = new Date();
      const externalListingId = randomUUID();
      const externalRCTId = randomUUID();
      const externalURL = 'example.com';
      const externalURTId = randomUUID();
      const externalUTId = randomUUID();

      const mockExternalDetailsResponse: AxiosResponse = {
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {
          headers: undefined,
        },
        data: {
          jurisdictions: [
            { id: externalJurisdictionId, name: 'targetJurisdiction' },
          ],
          listings: [
            {
              id: externalListingId,
              contentUpdateAt: externalListingDate,
              jurisdictionId: externalJurisdictionId,
            },
          ],
          reservedCommunityTypes: [
            { id: externalRCTId, name: 'targetReservedCommunityType' },
          ],
          unitRentTypes: [{ id: externalURTId, name: 'targetUnitRentType' }],
          unitTypes: [{ id: externalUTId, name: 'targetUnitType' }],
        },
      };

      jest
        .spyOn(httpService, 'get')
        .mockImplementationOnce(() => of(mockExternalDetailsResponse));

      const internalJurisdictionId = randomUUID();
      const internalListingId = randomUUID();
      const internalRCTId = randomUUID();
      const internalURTId = randomUUID();
      const internalUTId = randomUUID();

      prisma.listings.delete = jest.fn().mockResolvedValue(undefined);
      prisma.listings.findMany = jest.fn().mockResolvedValue([
        {
          id: internalListingId,
          contentUpdatedAt: externalListingDate,
          externalListingId,
        },
      ]);
      prisma.reservedCommunityTypes.findMany = jest
        .fn()
        .mockResolvedValue([
          { id: internalRCTId, name: 'targetReservedCommunityType' },
        ]);
      prisma.unitRentTypes.findMany = jest
        .fn()
        .mockResolvedValue([{ id: internalURTId, name: 'targetUnitRentType' }]);
      prisma.unitTypes.findMany = jest
        .fn()
        .mockResolvedValue([{ id: internalUTId, name: 'targetUnitType' }]);

      const response = await service.ingest({
        externalURL: externalURL,
        jurisdictionId: internalJurisdictionId,
        targetName: 'targetJurisdiction',
      });

      expect(response.success).toEqual(true);

      expect(prisma.listings.findMany).toHaveBeenCalledExactlyOnceWith({
        select: { id: true, contentUpdatedAt: true, externalListingId: true },
        where: { externalJurisdictionId: externalJurisdictionId },
      });
      expect(
        prisma.reservedCommunityTypes.findMany,
      ).toHaveBeenCalledExactlyOnceWith({
        select: { id: true, name: true },
      });
      expect(prisma.unitRentTypes.findMany).toHaveBeenCalledExactlyOnceWith({
        select: { id: true, name: true },
      });
      expect(prisma.unitTypes.findMany).toHaveBeenCalledExactlyOnceWith({
        select: { id: true, name: true },
      });
      expect(prisma.listings.delete).not.toHaveBeenCalled();
    });

    it('should delete a listing if no longer returned from external system', async () => {
      const externalJurisdictionId = randomUUID();
      const externalRCTId = randomUUID();
      const externalURL = 'example.com';
      const externalURTId = randomUUID();
      const externalUTId = randomUUID();

      const mockExternalDetailsResponse: AxiosResponse = {
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {
          headers: undefined,
        },
        data: {
          jurisdictions: [
            { id: externalJurisdictionId, name: 'targetJurisdiction' },
          ],
          listings: [],
          reservedCommunityTypes: [
            { id: externalRCTId, name: 'targetReservedCommunityType' },
          ],
          unitRentTypes: [{ id: externalURTId, name: 'targetUnitRentType' }],
          unitTypes: [{ id: externalUTId, name: 'targetUnitType' }],
        },
      };

      jest
        .spyOn(httpService, 'get')
        .mockImplementationOnce(() => of(mockExternalDetailsResponse));

      const internalJurisdictionId = randomUUID();
      const internalListingId = randomUUID();

      prisma.listings.deleteMany = jest.fn().mockResolvedValue(undefined);
      prisma.listings.findMany = jest.fn().mockResolvedValue([
        {
          id: internalListingId,
          contentUpdatedAt: new Date(),
          externalListingId: randomUUID(),
        },
      ]);
      prisma.reservedCommunityTypes.findMany = jest.fn();
      prisma.unitRentTypes.findMany = jest.fn();
      prisma.unitTypes.findMany = jest.fn();

      const response = await service.ingest({
        externalURL: externalURL,
        jurisdictionId: internalJurisdictionId,
        targetName: 'targetJurisdiction',
      });

      expect(response.success).toEqual(true);

      expect(prisma.reservedCommunityTypes.findMany).not.toHaveBeenCalled();
      expect(prisma.unitRentTypes.findMany).not.toHaveBeenCalled();
      expect(prisma.unitTypes.findMany).not.toHaveBeenCalled();

      expect(prisma.listings.deleteMany).toHaveBeenCalledWith({
        where: { id: { in: [internalListingId] } },
      });
    });
  });

  describe('Test createExternalListing function', () => {
    it('should error if external listing call fails', async () => {
      const externalResponseFailure = { response: 'resp', status: '500' };

      // Create a spy on the `get` method of `httpService` and mock the implementation
      jest
        .spyOn(httpService, 'get')
        .mockImplementationOnce(
          () =>
            new Observable((subscriber) =>
              subscriber.error(externalResponseFailure),
            ),
        );

      await expect(
        service.createExternalListing(
          [],
          [],
          [],
          { id: randomUUID(), name: 'targetJurisdiction' },
          { id: randomUUID() },
          '',
          randomUUID(),
        ),
      ).rejects.toThrow(HttpException);
    });

    it('should return early if reserved community type is not matched', async () => {
      const externalJurisdictionId = randomUUID();
      const externalListingId = randomUUID();
      const externalRCTId = randomUUID();
      const externalURTId = randomUUID();
      const externalUTId = randomUUID();

      const mockExternalListingResponse: AxiosResponse = {
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {
          headers: undefined,
        },
        data: {
          id: externalListingId,
          assets: [
            {
              fileId: randomUUID(),
              label: 'example asset',
            },
          ],
          contentUpdatedAt: new Date(),
          displayWaitlistSize: false,
          isVerified: true,
          jurisdictions: [
            { id: externalJurisdictionId, name: 'targetJurisdiction' },
          ],
          name: 'example listing name',
          reservedCommunityTypes: {
            id: externalRCTId,
            name: 'targetReservedCommunityType',
          },
          status: ListingsStatusEnum.active,
          units: [
            {
              amiPercentage: '1',
              annualIncomeMin: '2',
              monthlyIncomeMin: '3',
              floor: 4,
              annualIncomeMax: '5',
              maxOccupancy: 6,
              minOccupancy: 7,
              monthlyRent: '8',
              numBathrooms: 9,
              numBedrooms: 10,
              number: '11',
              sqFeet: '12',
              monthlyRentAsPercentOfIncome: '13',
              bmrProgramChart: true,
              unitRentTypes: { id: externalURTId, name: 'targetUnitRentType' },
              unitTypes: { id: externalUTId, name: 'targetUnitType' },
            },
          ],
        },
      };

      jest
        .spyOn(httpService, 'get')
        .mockImplementationOnce(() => of(mockExternalListingResponse));

      prisma.listings.create = jest.fn();

      await service.createExternalListing(
        [],
        [],
        [],
        { id: externalJurisdictionId, name: 'targetJurisdiction' },
        { id: externalListingId },
        externalURL,
        randomUUID(),
      );

      expect(prisma.listings.create).not.toHaveBeenCalled();
    });

    it('should create new listing based on external listing data', async () => {
      const externalJurisdictionId = randomUUID();
      const externalListingId = randomUUID();
      const externalRCTId = randomUUID();
      const externalURTId = randomUUID();
      const externalUTId = randomUUID();

      const mockExternalListingResponse: AxiosResponse = {
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {
          headers: undefined,
        },
        data: {
          id: externalListingId,
          assets: [
            {
              fileId: randomUUID(),
              label: 'example asset',
            },
          ],
          contentUpdatedAt: new Date(),
          displayWaitlistSize: false,
          isVerified: true,
          jurisdictions: [
            { id: externalJurisdictionId, name: 'targetJurisdiction' },
          ],
          name: 'example listing name',
          reservedCommunityTypes: {
            id: externalRCTId,
            name: 'targetReservedCommunityType',
          },
          status: ListingsStatusEnum.active,
          units: [
            {
              amiPercentage: '1',
              annualIncomeMin: '2',
              monthlyIncomeMin: '3',
              floor: 4,
              annualIncomeMax: '5',
              maxOccupancy: 6,
              minOccupancy: 7,
              monthlyRent: '8',
              numBathrooms: 9,
              numBedrooms: 10,
              number: '11',
              sqFeet: '12',
              monthlyRentAsPercentOfIncome: '13',
              bmrProgramChart: true,
              unitRentTypes: { id: externalURTId, name: 'targetUnitRentType' },
              unitTypes: { id: externalUTId, name: 'targetUnitType' },
            },
          ],
        },
      };

      jest
        .spyOn(httpService, 'get')
        .mockImplementationOnce(() => of(mockExternalListingResponse));

      const internalJurisdictionId = randomUUID();
      const internalRCTId = randomUUID();
      const internalURTId = randomUUID();
      const internalUTId = randomUUID();

      prisma.listings.create = jest.fn().mockReturnValue({});

      await service.createExternalListing(
        [{ internalId: internalRCTId, externalId: externalRCTId }],
        [{ internalId: internalURTId, externalId: externalURTId }],
        [{ internalId: internalUTId, externalId: externalUTId }],
        { id: externalJurisdictionId, name: 'targetJurisdiction' },
        { id: externalListingId },
        externalURL,
        internalJurisdictionId,
      );

      expect(prisma.listings.create).toHaveBeenCalledWith({
        data: {
          accessibility: undefined,
          additionalApplicationSubmissionNotes: undefined,
          allowsCats: undefined,
          allowsDogs: undefined,
          amenities: undefined,
          applicationDueDate: undefined,
          applicationFee: undefined,
          applicationOpenDate: undefined,
          applicationOrganization: undefined,
          buildingTotalUnits: undefined,
          cocInfo: undefined,
          commonDigitalApplication: undefined,
          communityDisclaimerDescription: undefined,
          communityDisclaimerTitle: undefined,
          configurableRegion: undefined,
          contentUpdatedAt: expect.anything(),
          costsNotIncluded: undefined,
          creditHistory: undefined,
          creditScreeningFee: undefined,
          criminalBackground: undefined,
          customMapPin: undefined,
          depositHelperText: undefined,
          depositMax: undefined,
          depositMin: undefined,
          depositType: undefined,
          depositValue: undefined,
          developer: undefined,
          digitalApplication: undefined,
          disableUnitsAccordion: undefined,
          displayWaitlistSize: false,
          externalJurisdictionId: externalJurisdictionId,
          externalListingId: externalListingId,
          externalURL: externalURL,
          hasHudEbllClearance: undefined,
          homeType: undefined,
          householdSizeMax: undefined,
          householdSizeMin: undefined,
          includeCommunityDisclaimer: undefined,
          isVerified: true,
          isWaitlistOpen: undefined,
          leasingAgentEmail: undefined,
          leasingAgentName: undefined,
          leasingAgentOfficeHours: undefined,
          leasingAgentPhone: undefined,
          leasingAgentTitle: undefined,
          listingFileNumber: undefined,
          listingType: undefined,
          lotteryOptIn: undefined,
          managementWebsite: undefined,
          marketingMonth: undefined,
          marketingSeason: undefined,
          marketingType: undefined,
          marketingYear: undefined,
          name: 'example listing name',
          neighborhood: undefined,
          paperApplication: undefined,
          parkingFee: undefined,
          petPolicy: undefined,
          postmarkedApplicationsReceivedByDate: undefined,
          programRules: undefined,
          publishedAt: undefined,
          referralOpportunity: undefined,
          rentalAssistance: undefined,
          rentalHistory: undefined,
          reservedCommunityDescription: undefined,
          reservedCommunityMinAge: undefined,
          reviewOrderType: undefined,
          scheduledPublishAt: undefined,
          scheduledApplicationOpenAt: undefined,
          section8Acceptance: undefined,
          servicesOffered: undefined,
          smokingPolicy: undefined,
          specialNotes: undefined,
          status: ListingsStatusEnum.active,
          unitAmenities: undefined,
          unitsAvailable: undefined,
          waitlistCurrentSize: undefined,
          waitlistMaxSize: undefined,
          waitlistOpenSpots: undefined,
          whatToExpect: undefined,
          whatToExpectAdditionalText: undefined,
          yearBuilt: undefined,

          assets: {
            create: [
              {
                fileId: expect.anything(),
                label: 'example asset',
              },
            ],
          },
          jurisdictions: {
            connect: {
              id: internalJurisdictionId,
            },
          },
          listingImages: undefined,
          listingsBuildingAddress: undefined,
          reservedCommunityTypes: {
            connect: {
              id: internalRCTId,
            },
          },
          unitGroups: undefined,
          units: {
            create: [
              {
                accessibilityPriorityType: undefined,
                amiPercentage: '1',
                annualIncomeMax: '5',
                annualIncomeMin: '2',
                bmrProgramChart: true,
                floor: 4,
                maxOccupancy: 6,
                minOccupancy: 7,
                monthlyIncomeMin: '3',
                monthlyRent: '8',
                monthlyRentAsPercentOfIncome: '13',
                numBathrooms: 9,
                numBedrooms: 10,
                number: '11',
                sqFeet: '12',

                amiChart: undefined,
                unitAmiChartOverrides: undefined,
                unitRentTypes: {
                  connect: {
                    id: internalURTId,
                  },
                },
                unitTypes: {
                  connect: {
                    id: internalUTId,
                  },
                },
              },
            ],
          },
        },
      });
    });
  });
});
