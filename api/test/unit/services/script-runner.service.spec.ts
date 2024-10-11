import { Test, TestingModule } from '@nestjs/testing';
import {
  LanguagesEnum,
  MultiselectQuestionsApplicationSectionEnum,
  PrismaClient,
  ReviewOrderTypeEnum,
} from '@prisma/client';
import { randomUUID } from 'crypto';
import { Request as ExpressRequest } from 'express';
import { mockDeep } from 'jest-mock-extended';
import { ScriptRunnerService } from '../../../src/services/script-runner.service';
import { PrismaService } from '../../../src/services/prisma.service';
import { User } from '../../../src/dtos/users/user.dto';
import { AmiChartService } from '../../../src/services/ami-chart.service';

const externalPrismaClient = mockDeep<PrismaClient>();

describe('Testing script runner service', () => {
  let service: ScriptRunnerService;
  let prisma: PrismaService;
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ScriptRunnerService, PrismaService, AmiChartService],
    }).compile();

    service = module.get<ScriptRunnerService>(ScriptRunnerService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  describe('transferJurisdictionData', () => {
    it('should not transfer jurisdiction data if jurisdiction does not exist', async () => {
      prisma.scriptRuns.findUnique = jest.fn().mockResolvedValue(null);
      prisma.scriptRuns.create = jest.fn().mockResolvedValue(null);
      prisma.scriptRuns.update = jest.fn().mockResolvedValue(null);
      prisma.jurisdictions.findFirst = jest.fn().mockResolvedValue(null);
      const id = randomUUID();
      await expect(
        service.transferJurisdictionData(
          {
            user: {
              id,
            } as unknown as User,
          } as unknown as ExpressRequest,
          {
            connectionString: 'sample',
            jurisdiction: 'Sample jurisdiction',
          },
          externalPrismaClient,
        ),
      ).rejects.toThrowError(
        "Sample jurisdiction county doesn't exist in Doorway database",
      );

      prisma.jurisdictions.findFirst = jest
        .fn()
        .mockResolvedValue([{ name: 'sample jurisdiction', id: randomUUID() }]);
      await expect(
        service.transferJurisdictionData(
          {
            user: {
              id,
            } as unknown as User,
          } as unknown as ExpressRequest,
          {
            connectionString: 'sample',
            jurisdiction: 'Sample jurisdiction',
          },
          externalPrismaClient,
        ),
      ).rejects.toThrowError(
        "Sample jurisdiction county doesn't exist in foreign database",
      );
    });

    it('should transfer ami and multiselect questions', async () => {
      prisma.scriptRuns.findUnique = jest.fn().mockResolvedValue(null);
      prisma.scriptRuns.create = jest.fn().mockResolvedValue(null);
      prisma.scriptRuns.update = jest.fn().mockResolvedValue(null);
      prisma.jurisdictions.findFirst = jest.fn().mockResolvedValue(null);
      const jurisdictionId = randomUUID();
      prisma.jurisdictions.findFirst = jest
        .fn()
        .mockResolvedValue({ name: 'sample jurisdiction', id: jurisdictionId });
      externalPrismaClient.$queryRaw.mockResolvedValueOnce([
        { name: 'sample jurisdiction', id: randomUUID() },
      ]);
      externalPrismaClient.$queryRawUnsafe
        .mockResolvedValueOnce([
          {
            id: randomUUID(),
            items: [],
            name: 'sample jurisdiction AMI CHART 1',
          },
        ])
        .mockResolvedValueOnce([
          {
            id: randomUUID(),
            text: 'multiselect question',
            sub_text: 'sub text',
            description: 'multiselect question description',
            options: [{ text: 'multiselect question option', ordinal: 1 }],
            hide_from_listing: false,
            application_section:
              MultiselectQuestionsApplicationSectionEnum.preferences,
            opt_out_text: "I don't want to be considered",
          },
        ]);
      const mockAMIChartCalls = jest.fn().mockResolvedValue(null);
      prisma.amiChart.createMany = mockAMIChartCalls;
      const mockMultiselectQuestionCalls = jest.fn().mockResolvedValue(null);
      prisma.multiselectQuestions.create = mockMultiselectQuestionCalls;
      const userId = randomUUID();
      const res = await service.transferJurisdictionData(
        {
          user: {
            id: userId,
          } as unknown as User,
        } as unknown as ExpressRequest,
        {
          connectionString: 'sample',
          jurisdiction: 'Sample jurisdiction',
        },
        externalPrismaClient,
      );
      expect(mockAMIChartCalls).toBeCalledTimes(1);
      expect(mockAMIChartCalls).toBeCalledWith({
        data: [
          {
            id: expect.anything(),
            items: [],
            jurisdictionId: jurisdictionId,
            name: 'sample jurisdiction AMI CHART 1',
          },
        ],
      });
      expect(mockMultiselectQuestionCalls).toBeCalledTimes(1);
      expect(mockMultiselectQuestionCalls).toBeCalledWith({
        data: {
          id: expect.anything(),
          applicationSection: 'preferences',
          jurisdictions: {
            connect: { id: jurisdictionId },
          },
          links: undefined,
          optOutText: "I don't want to be considered",
          description: 'multiselect question description',
          hideFromListing: false,
          subText: 'sub text',
          text: 'multiselect question',
          options: [{ ordinal: 1, text: 'multiselect question option' }],
        },
      });

      expect(res.success).toBe(true);
      const scriptName = 'data transfer Sample jurisdiction';

      expect(prisma.scriptRuns.findUnique).toHaveBeenCalledWith({
        where: {
          scriptName,
        },
      });
      expect(prisma.scriptRuns.create).toHaveBeenCalledWith({
        data: {
          scriptName,
          triggeringUser: userId,
        },
      });
      expect(prisma.scriptRuns.update).toHaveBeenCalledWith({
        data: {
          didScriptRun: true,
          triggeringUser: userId,
        },
        where: {
          scriptName,
        },
      });
    });
  });

  const createAddress = (name: string) => {
    return {
      place_name: name,
      city: `${name} city`,
      state: `${name} state`,
      street: `${name} street`,
      street2: `${name} street2`,
      zipCode: `12345`,
    };
  };

  it('should add lottery translations', async () => {
    prisma.scriptRuns.findUnique = jest.fn().mockResolvedValue(null);
    prisma.scriptRuns.create = jest.fn().mockResolvedValue(null);
    prisma.scriptRuns.update = jest.fn().mockResolvedValue(null);
    prisma.translations.findFirst = jest
      .fn()
      .mockResolvedValue({ id: randomUUID(), translations: {} });
    prisma.translations.update = jest.fn().mockResolvedValue(null);

    const id = randomUUID();
    const scriptName = 'add lottery translations';

    const res = await service.addLotteryTranslations({
      user: {
        id,
      } as unknown as User,
    } as unknown as ExpressRequest);

    expect(res.success).toBe(true);

    expect(prisma.scriptRuns.findUnique).toHaveBeenCalledWith({
      where: {
        scriptName,
      },
    });
    expect(prisma.scriptRuns.create).toHaveBeenCalledWith({
      data: {
        scriptName,
        triggeringUser: id,
      },
    });
    expect(prisma.scriptRuns.update).toHaveBeenCalledWith({
      data: {
        didScriptRun: true,
        triggeringUser: id,
      },
      where: {
        scriptName,
      },
    });
  });

  it('should add duplicates lottery info translations', async () => {
    prisma.scriptRuns.findUnique = jest.fn().mockResolvedValue(null);
    prisma.scriptRuns.create = jest.fn().mockResolvedValue(null);
    prisma.scriptRuns.update = jest.fn().mockResolvedValue(null);
    prisma.translations.findFirst = jest
      .fn()
      .mockResolvedValue({ id: randomUUID(), translations: {} });
    prisma.translations.update = jest.fn().mockResolvedValue(null);

    const id = randomUUID();
    const scriptName = 'add duplicates information to lottery email';

    const res = await service.addDuplicatesInformationToLotteryEmail({
      user: {
        id,
      } as unknown as User,
    } as unknown as ExpressRequest);

    expect(res.success).toBe(true);

    expect(prisma.scriptRuns.findUnique).toHaveBeenCalledWith({
      where: {
        scriptName,
      },
    });
    expect(prisma.scriptRuns.create).toHaveBeenCalledWith({
      data: {
        scriptName,
        triggeringUser: id,
      },
    });
    expect(prisma.scriptRuns.update).toHaveBeenCalledWith({
      data: {
        didScriptRun: true,
        triggeringUser: id,
      },
      where: {
        scriptName,
      },
    });
  });

  it('should add lottery translations and create if empty', async () => {
    prisma.scriptRuns.findUnique = jest.fn().mockResolvedValue(null);
    prisma.scriptRuns.create = jest.fn().mockResolvedValue(null);
    prisma.scriptRuns.update = jest.fn().mockResolvedValue(null);
    prisma.translations.findFirst = jest.fn().mockResolvedValue(undefined);
    prisma.translations.update = jest.fn().mockResolvedValue(null);
    prisma.translations.create = jest.fn().mockReturnValue({
      language: LanguagesEnum.en,
      translations: {},
      jurisdictions: undefined,
    });

    const id = randomUUID();
    const scriptName = 'add lottery translations create if empty';

    const res = await service.addLotteryTranslationsCreateIfEmpty({
      user: {
        id,
      } as unknown as User,
    } as unknown as ExpressRequest);

    expect(res.success).toBe(true);

    expect(prisma.scriptRuns.findUnique).toHaveBeenCalledWith({
      where: {
        scriptName,
      },
    });
    expect(prisma.scriptRuns.create).toHaveBeenCalledWith({
      data: {
        scriptName,
        triggeringUser: id,
      },
    });
    expect(prisma.scriptRuns.update).toHaveBeenCalledWith({
      data: {
        didScriptRun: true,
        triggeringUser: id,
      },
      where: {
        scriptName,
      },
    });

    expect(prisma.translations.create).toHaveBeenCalled();
  });

  describe('transferJurisdictionListingData', () => {
    it('should transfer listings', async () => {
      prisma.scriptRuns.findUnique = jest.fn().mockResolvedValue(null);
      prisma.scriptRuns.create = jest.fn().mockResolvedValue(null);
      prisma.scriptRuns.update = jest.fn().mockResolvedValue(null);
      prisma.unitAccessibilityPriorityTypes.findMany = jest
        .fn()
        .mockResolvedValue([]);
      prisma.unitRentTypes.findMany = jest.fn().mockResolvedValue([]);

      const jurisdictionId = randomUUID();
      prisma.jurisdictions.findFirst = jest.fn().mockResolvedValue({
        name: 'sample jurisdiction',
        id: jurisdictionId,
      });
      externalPrismaClient.$queryRaw.mockResolvedValueOnce([
        { name: 'sample jurisdiction', id: randomUUID() },
      ]);
      const listingId = randomUUID();
      externalPrismaClient.$queryRawUnsafe
        .mockResolvedValueOnce([
          {
            id: listingId,
            name: 'sample listing',
            created_at: new Date(),
            digital_application: true,
            common_digital_application: true,
            paper_application: false,
            referral_opportunity: false,
            assets: [],
            accessibility: 'accessibility',
            amenities: 'amenities',
            developer: 'developer',
            household_size_max: 2,
            household_size_min: 1,
            display_waitlist_size: false,
            status: 'active',
            building_address_id: randomUUID(),
            leasing_agent_address_id: randomUUID(),
            application_pick_up_address_id: randomUUID(),
            application_drop_off_address_id: randomUUID(),
          },
        ])
        .mockResolvedValueOnce([createAddress('building')])
        .mockResolvedValueOnce([createAddress('leasing agent')])
        .mockResolvedValueOnce([createAddress('application pick up')])
        .mockResolvedValueOnce([createAddress('application drop up')])
        .mockResolvedValueOnce([{ type: 'Internal' }]) // application methods
        .mockResolvedValueOnce([]); // units
      const createdListingId = randomUUID();
      const mockListingSave = jest
        .fn()
        .mockResolvedValueOnce({ id: createdListingId });
      prisma.listings.create = mockListingSave;

      const id = randomUUID();
      const scriptName = 'data transfer listings Sample jurisdiction';

      const res = await service.transferJurisdictionListingData(
        {
          user: {
            id,
          } as unknown as User,
        } as unknown as ExpressRequest,
        {
          connectionString: 'Sample',
          jurisdiction: 'Sample jurisdiction',
        },
        externalPrismaClient,
      );

      expect(prisma.listings.create).toBeCalledTimes(1);
      expect(mockListingSave).toBeCalledWith({
        data: {
          id: listingId,
          accessibility: 'accessibility',
          additionalApplicationSubmissionNotes: undefined,
          afsLastRunAt: undefined,
          amenities: 'amenities',
          amiPercentageMax: undefined,
          amiPercentageMin: undefined,
          applicationDropOffAddressOfficeHours: undefined,
          applicationDropOffAddressType: undefined,
          applicationDueDate: undefined,
          applicationFee: undefined,
          applicationMailingAddressType: undefined,
          applicationMethods: {
            createMany: {
              data: [
                {
                  acceptsPostmarkedApplications: undefined,
                  label: undefined,
                  phoneNumber: undefined,
                  type: 'Internal',
                },
              ],
            },
          },
          applicationOpenDate: undefined,
          applicationOrganization: undefined,
          applicationPickUpAddressOfficeHours: undefined,
          applicationPickUpAddressType: undefined,
          assets: [],
          buildingSelectionCriteria: undefined,
          buildingTotalUnits: undefined,
          closedAt: undefined,
          commonDigitalApplication: true,
          contentUpdatedAt: undefined,
          costsNotIncluded: undefined,
          createdAt: expect.anything(),
          creditHistory: undefined,
          criminalBackground: undefined,
          customMapPin: undefined,
          depositHelperText: undefined,
          depositMax: undefined,
          depositMin: undefined,
          developer: 'developer',
          digitalApplication: true,
          disableUnitsAccordion: undefined,
          displayWaitlistSize: false,
          homeType: undefined,
          householdSizeMax: 2,
          householdSizeMin: 1,
          hrdId: undefined,
          isVerified: undefined,
          isWaitlistOpen: undefined,
          jurisdictions: {
            connect: {
              id: jurisdictionId,
            },
          },
          lastApplicationUpdateAt: undefined,
          leasingAgentEmail: undefined,
          leasingAgentName: undefined,
          leasingAgentOfficeHours: undefined,
          leasingAgentPhone: undefined,
          leasingAgentTitle: undefined,
          listingsApplicationDropOffAddress: {
            create: {
              city: 'application drop up city',
              county: undefined,
              createdAt: undefined,
              latitude: undefined,
              longitude: undefined,
              placeName: 'application drop up',
              state: 'application drop up state',
              street: 'application drop up street',
              street2: 'application drop up street2',
              zipCode: undefined,
            },
          },
          listingsApplicationMailingAddress: undefined,
          listingsApplicationPickUpAddress: {
            create: {
              city: 'application pick up city',
              county: undefined,
              createdAt: undefined,
              latitude: undefined,
              longitude: undefined,
              placeName: 'application pick up',
              state: 'application pick up state',
              street: 'application pick up street',
              street2: 'application pick up street2',
              zipCode: undefined,
            },
          },
          listingsBuildingAddress: {
            create: {
              city: 'building city',
              county: 'Sample jurisdiction',
              createdAt: undefined,
              latitude: undefined,
              longitude: undefined,
              placeName: 'building',
              state: 'building state',
              street: 'building street',
              street2: 'building street2',
              zipCode: undefined,
            },
          },
          listingsLeasingAgentAddress: {
            create: {
              city: 'leasing agent city',
              county: undefined,
              createdAt: undefined,
              latitude: undefined,
              longitude: undefined,
              placeName: 'leasing agent',
              state: 'leasing agent state',
              street: 'leasing agent street',
              street2: 'leasing agent street2',
              zipCode: undefined,
            },
          },
          managementCompany: undefined,
          managementWebsite: undefined,
          marketingType: undefined,
          name: 'sample listing',
          neighborhood: undefined,
          ownerCompany: undefined,
          paperApplication: false,
          petPolicy: undefined,
          phoneNumber: undefined,
          postmarkedApplicationsReceivedByDate: undefined,
          programRules: undefined,
          publishedAt: undefined,
          referralOpportunity: false,
          rentalAssistance: undefined,
          rentalHistory: undefined,
          requestedChanges: undefined,
          requestedChangesDate: undefined,
          requiredDocuments: undefined,
          reservedCommunityDescription: undefined,
          reservedCommunityMinAge: undefined,
          reservedCommunityTypes: undefined,
          resultLink: undefined,
          reviewOrderType: undefined,
          servicesOffered: undefined,
          smokingPolicy: undefined,
          specialNotes: undefined,
          status: 'active',
          unitAmenities: undefined,
          unitsAvailable: undefined,
          waitlistCurrentSize: undefined,
          waitlistMaxSize: undefined,
          waitlistOpenSpots: undefined,
          whatToExpect: undefined,
          yearBuilt: undefined,
        },
      });

      expect(res.success).toBe(true);

      expect(prisma.scriptRuns.findUnique).toHaveBeenCalledWith({
        where: {
          scriptName,
        },
      });
      expect(prisma.scriptRuns.create).toHaveBeenCalledWith({
        data: {
          scriptName,
          triggeringUser: id,
        },
      });
      expect(prisma.scriptRuns.update).toHaveBeenCalledWith({
        data: {
          didScriptRun: true,
          triggeringUser: id,
        },
        where: {
          scriptName,
        },
      });
    });

    it('should transfer listings with RCD', async () => {
      prisma.scriptRuns.findUnique = jest.fn().mockResolvedValue(null);
      prisma.scriptRuns.create = jest.fn().mockResolvedValue(null);
      prisma.scriptRuns.update = jest.fn().mockResolvedValue(null);
      prisma.unitAccessibilityPriorityTypes.findMany = jest
        .fn()
        .mockResolvedValue([]);
      prisma.unitRentTypes.findMany = jest.fn().mockResolvedValue([]);

      const jurisdictionId = randomUUID();
      prisma.jurisdictions.findFirst = jest.fn().mockResolvedValue({
        name: 'sample jurisdiction',
        id: jurisdictionId,
      });
      externalPrismaClient.$queryRaw.mockResolvedValueOnce([
        { name: 'sample jurisdiction', id: randomUUID() },
      ]);
      const doorwayReservedCommunityTypeID = randomUUID();
      const listingId = randomUUID();
      externalPrismaClient.$queryRawUnsafe
        .mockResolvedValueOnce([
          {
            id: listingId,
            name: 'sample listing',
            created_at: new Date(),
            digital_application: false,
            common_digital_application: false,
            paper_application: false,
            referral_opportunity: false,
            assets: [],
            household_size_max: 2,
            household_size_min: 1,
            display_waitlist_size: false,
            status: 'closed',
            reserved_community_type_id: randomUUID(),
          },
        ])
        .mockResolvedValueOnce([{ name: 'senior' }])
        .mockResolvedValueOnce([]) // application methods
        .mockResolvedValueOnce([]); // units
      prisma.reservedCommunityTypes.findMany = jest.fn().mockResolvedValueOnce([
        { name: 'sample reserved type', id: randomUUID() },
        { name: 'senior55', id: doorwayReservedCommunityTypeID },
      ]);

      const createdListingId = randomUUID();
      const mockListingSave = jest
        .fn()
        .mockResolvedValueOnce({ id: createdListingId });
      prisma.listings.create = mockListingSave;

      const id = randomUUID();

      await service.transferJurisdictionListingData(
        {
          user: {
            id,
          } as unknown as User,
        } as unknown as ExpressRequest,
        {
          connectionString: 'Sample',
          jurisdiction: 'Sample jurisdiction',
        },
        externalPrismaClient,
      );

      expect(mockListingSave).toBeCalledWith({
        data: {
          id: listingId,
          accessibility: undefined,
          additionalApplicationSubmissionNotes: undefined,
          afsLastRunAt: undefined,
          amenities: undefined,
          amiPercentageMax: undefined,
          amiPercentageMin: undefined,
          applicationDropOffAddressOfficeHours: undefined,
          applicationDropOffAddressType: undefined,
          applicationDueDate: undefined,
          applicationFee: undefined,
          applicationMailingAddressType: undefined,
          applicationOpenDate: undefined,
          applicationOrganization: undefined,
          applicationPickUpAddressOfficeHours: undefined,
          applicationPickUpAddressType: undefined,
          assets: [],
          buildingSelectionCriteria: undefined,
          buildingTotalUnits: undefined,
          closedAt: undefined,
          commonDigitalApplication: false,
          contentUpdatedAt: undefined,
          costsNotIncluded: undefined,
          createdAt: expect.anything(),
          creditHistory: undefined,
          criminalBackground: undefined,
          customMapPin: undefined,
          depositHelperText: undefined,
          depositMax: undefined,
          depositMin: undefined,
          developer: undefined,
          digitalApplication: false,
          disableUnitsAccordion: undefined,
          displayWaitlistSize: false,
          homeType: undefined,
          householdSizeMax: 2,
          householdSizeMin: 1,
          hrdId: undefined,
          isVerified: undefined,
          isWaitlistOpen: undefined,
          jurisdictions: {
            connect: {
              id: jurisdictionId,
            },
          },
          lastApplicationUpdateAt: undefined,
          leasingAgentEmail: undefined,
          leasingAgentName: undefined,
          leasingAgentOfficeHours: undefined,
          leasingAgentPhone: undefined,
          leasingAgentTitle: undefined,
          listingsApplicationDropOffAddress: undefined,
          listingsApplicationMailingAddress: undefined,
          listingsApplicationPickUpAddress: undefined,
          listingsBuildingAddress: undefined,
          listingsLeasingAgentAddress: undefined,
          managementCompany: undefined,
          managementWebsite: undefined,
          marketingType: undefined,
          name: 'sample listing',
          neighborhood: undefined,
          ownerCompany: undefined,
          paperApplication: false,
          petPolicy: undefined,
          phoneNumber: undefined,
          postmarkedApplicationsReceivedByDate: undefined,
          programRules: undefined,
          publishedAt: undefined,
          referralOpportunity: false,
          rentalAssistance: undefined,
          rentalHistory: undefined,
          requestedChanges: undefined,
          requestedChangesDate: undefined,
          requiredDocuments: undefined,
          reservedCommunityDescription: undefined,
          reservedCommunityMinAge: undefined,
          reservedCommunityTypes: {
            connect: {
              id: doorwayReservedCommunityTypeID,
            },
          },
          resultLink: undefined,
          reviewOrderType: undefined,
          servicesOffered: undefined,
          smokingPolicy: undefined,
          specialNotes: undefined,
          status: 'closed',
          unitAmenities: undefined,
          unitsAvailable: undefined,
          waitlistCurrentSize: undefined,
          waitlistMaxSize: undefined,
          waitlistOpenSpots: undefined,
          whatToExpect: undefined,
          yearBuilt: undefined,
        },
      });
    });

    it('should transfer units for listings', async () => {
      console.log = jest.fn();
      prisma.scriptRuns.findUnique = jest.fn().mockResolvedValue(null);
      prisma.scriptRuns.create = jest.fn().mockResolvedValue(null);
      prisma.scriptRuns.update = jest.fn().mockResolvedValue(null);
      const doorwayPriorityTypeId = randomUUID();
      const priorityTypeId = randomUUID();
      prisma.unitAccessibilityPriorityTypes.findMany = jest
        .fn()
        .mockResolvedValue([
          { name: 'sample priority type', id: doorwayPriorityTypeId },
        ]);
      const doorwayRentTypeId = randomUUID();
      const rentTypeId = randomUUID();
      prisma.unitRentTypes.findMany = jest.fn().mockResolvedValue([
        { name: 'fixed', id: doorwayRentTypeId },
        { name: 'percentageOfIncome', id: randomUUID() },
      ]);

      const jurisdictionId = randomUUID();
      const amiChartId = randomUUID();
      const anotherAmiChartId = randomUUID();
      prisma.jurisdictions.findFirst = jest.fn().mockResolvedValue({
        name: 'sample jurisdiction',
        id: jurisdictionId,
      });
      externalPrismaClient.$queryRaw
        .mockResolvedValueOnce([
          { name: 'sample jurisdiction', id: randomUUID() },
        ])
        .mockResolvedValueOnce([
          { name: 'sample priority type', id: priorityTypeId },
        ])
        .mockResolvedValueOnce([
          { name: 'fixed', id: rentTypeId },
          { name: 'percentageOfIncome', id: randomUUID() },
        ]);
      externalPrismaClient.$queryRawUnsafe
        .mockResolvedValueOnce([
          {
            id: randomUUID(),
            name: 'sample listing',
            created_at: new Date(),
            digital_application: false,
            common_digital_application: false,
            paper_application: false,
            referral_opportunity: false,
            assets: [],
            accessibility: 'accessibility',
            amenities: 'amenities',
            developer: 'developer',
            household_size_max: 2,
            household_size_min: 1,
            display_waitlist_size: false,
            status: 'active',
          },
        ])
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce([
          {
            name: 'oneBdr',
            floor: 1,
            ami_percentage: '30',
            annual_income_min: '1000',
            annual_income_max: '10000',
            max_occupancy: 5,
            min_occupancy: 2,
            num_bathrooms: 1,
            num_bedrooms: 2,
            number: '200',
            sq_feet: '600',
            ami_chart_id: amiChartId,
            priority_type_id: priorityTypeId,
            unit_rent_type_id: rentTypeId,
          },
          {
            name: 'studio',
            floor: 1,
            ami_percentage: '30',
            annual_income_min: '1000',
            annual_income_max: '10000',
            max_occupancy: 5,
            min_occupancy: 2,
            num_bathrooms: 1,
            num_bedrooms: 2,
            number: '200',
            sq_feet: '600',
            ami_chart_id: anotherAmiChartId, //This ami chart should not be found
          },
        ]);
      const unitTypeId = randomUUID();
      prisma.unitTypes.findFirst = jest
        .fn()
        .mockResolvedValueOnce({ id: unitTypeId });
      prisma.amiChart.findFirst = jest
        .fn()
        .mockResolvedValueOnce({ id: amiChartId })
        .mockResolvedValueOnce(null);
      const createdListingId = randomUUID();
      const mockListingSave = jest
        .fn()
        .mockResolvedValueOnce({ id: createdListingId });
      prisma.listings.create = mockListingSave;
      const mockUnitsSave = jest.fn().mockResolvedValueOnce(null);
      prisma.units.create = mockUnitsSave;

      const id = randomUUID();
      const scriptName = 'data transfer listings Sample jurisdiction';

      const res = await service.transferJurisdictionListingData(
        {
          user: {
            id,
          } as unknown as User,
        } as unknown as ExpressRequest,
        {
          connectionString: 'Sample',
          jurisdiction: 'Sample jurisdiction',
        },
        externalPrismaClient,
      );

      expect(console.log).toBeCalledWith(
        `Ami chart not found in Doorway: ${anotherAmiChartId} for listing sample listing`,
      );

      expect(prisma.listings.create).toBeCalledTimes(1);
      expect(prisma.units.create).toBeCalledTimes(2);
      expect(prisma.units.create).toBeCalledWith({
        data: {
          amiChart: {
            connect: {
              id: amiChartId,
            },
          },
          amiPercentage: '30',
          annualIncomeMax: '10000',
          annualIncomeMin: '1000',
          bmrProgramChart: undefined,
          floor: 1,
          listings: {
            connect: {
              id: createdListingId,
            },
          },
          maxOccupancy: 5,
          minOccupancy: 2,
          monthlyIncomeMin: undefined,
          monthlyRent: undefined,
          monthlyRentAsPercentOfIncome: undefined,
          numBathrooms: 1,
          numBedrooms: 2,
          number: '200',
          sqFeet: '600',
          status: undefined,
          unitAccessibilityPriorityTypes: {
            connect: {
              id: doorwayPriorityTypeId,
            },
          },
          unitRentTypes: {
            connect: {
              id: doorwayRentTypeId,
            },
          },
          unitTypes: {
            connect: {
              id: unitTypeId,
            },
          },
        },
      });

      expect(res.success).toBe(true);

      expect(prisma.scriptRuns.findUnique).toHaveBeenCalledWith({
        where: {
          scriptName,
        },
      });
      expect(prisma.scriptRuns.create).toHaveBeenCalledWith({
        data: {
          scriptName,
          triggeringUser: id,
        },
      });
      expect(prisma.scriptRuns.update).toHaveBeenCalledWith({
        data: {
          didScriptRun: true,
          triggeringUser: id,
        },
        where: {
          scriptName,
        },
      });
    });

    it('should transfer listing multiselect questions', async () => {
      console.log = jest.fn();
      prisma.scriptRuns.findUnique = jest.fn().mockResolvedValue(null);
      prisma.scriptRuns.create = jest.fn().mockResolvedValue(null);
      prisma.scriptRuns.update = jest.fn().mockResolvedValue(null);
      prisma.unitAccessibilityPriorityTypes.findMany = jest
        .fn()
        .mockResolvedValue([]);
      prisma.unitRentTypes.findMany = jest.fn().mockResolvedValue([]);
      const jurisdictionId = randomUUID();
      prisma.jurisdictions.findFirst = jest.fn().mockResolvedValue({
        name: 'sample jurisdiction',
        id: jurisdictionId,
      });
      externalPrismaClient.$queryRaw.mockResolvedValueOnce([
        { name: 'sample jurisdiction', id: randomUUID() },
      ]);
      const createdListingId = randomUUID();
      const mockListingSave = jest
        .fn()
        .mockResolvedValueOnce({ id: createdListingId });
      prisma.listings.create = mockListingSave;

      const externalListingId = randomUUID();
      const multiselectQuestionId = randomUUID();
      const differentMultiselectQuestionId = randomUUID();
      externalPrismaClient.$queryRawUnsafe
        .mockResolvedValueOnce([
          {
            id: externalListingId,
            name: 'sample listing',
            created_at: new Date(),
            digital_application: false,
            common_digital_application: false,
            paper_application: false,
            referral_opportunity: false,
            assets: [],
            accessibility: 'accessibility',
            amenities: 'amenities',
            developer: 'developer',
            household_size_max: 2,
            household_size_min: 1,
            display_waitlist_size: false,
            status: 'active',
          },
        ])
        .mockResolvedValueOnce([]) // no application methods for this test
        .mockResolvedValueOnce([]) // no units for this test
        .mockResolvedValueOnce([
          {
            ordinal: 1,
            listingId: externalListingId,
            multiselect_question_id: multiselectQuestionId,
          },
          {
            ordinal: 2,
            listingId: externalListingId,
            multiselect_question_id: differentMultiselectQuestionId, // multiselect question not in doorway
          },
        ]);

      const mockListingMultiselectQuestionCreate = jest
        .fn()
        .mockResolvedValueOnce(null)
        .mockRejectedValueOnce('ERROR!');
      prisma.listingMultiselectQuestions.create =
        mockListingMultiselectQuestionCreate;

      const id = randomUUID();

      await service.transferJurisdictionListingData(
        {
          user: {
            id,
          } as unknown as User,
        } as unknown as ExpressRequest,
        {
          connectionString: 'Sample',
          jurisdiction: 'Sample jurisdiction',
        },
        externalPrismaClient,
      );

      expect(prisma.listingMultiselectQuestions.create).toBeCalledTimes(2);
      expect(prisma.listingMultiselectQuestions.create).toBeCalledWith({
        data: {
          listingId: createdListingId,
          multiselectQuestionId: multiselectQuestionId,
          ordinal: 1,
        },
      });

      expect(console.log).toBeCalledWith(
        `unable to migrate listing multiselect question ${differentMultiselectQuestionId} to listing ${createdListingId}`,
      );
    });

    it('should transfer listing events', async () => {
      prisma.scriptRuns.findUnique = jest.fn().mockResolvedValue(null);
      prisma.scriptRuns.create = jest.fn().mockResolvedValue(null);
      prisma.scriptRuns.update = jest.fn().mockResolvedValue(null);
      prisma.unitAccessibilityPriorityTypes.findMany = jest
        .fn()
        .mockResolvedValue([]);
      prisma.unitRentTypes.findMany = jest.fn().mockResolvedValue([]);
      const jurisdictionId = randomUUID();
      prisma.jurisdictions.findFirst = jest.fn().mockResolvedValue({
        name: 'sample jurisdiction',
        id: jurisdictionId,
      });
      externalPrismaClient.$queryRaw.mockResolvedValueOnce([
        { name: 'sample jurisdiction', id: randomUUID() },
      ]);
      const createdListingId = randomUUID();
      const mockListingSave = jest
        .fn()
        .mockResolvedValueOnce({ id: createdListingId });
      prisma.listings.create = mockListingSave;

      const externalListingId = randomUUID();
      externalPrismaClient.$queryRawUnsafe
        .mockResolvedValueOnce([
          {
            id: externalListingId,
            name: 'sample listing',
            created_at: new Date(),
            digital_application: false,
            common_digital_application: false,
            paper_application: false,
            referral_opportunity: false,
            assets: [],
            accessibility: 'accessibility',
            amenities: 'amenities',
            developer: 'developer',
            household_size_max: 2,
            household_size_min: 1,
            display_waitlist_size: false,
            status: 'active',
          },
        ])
        .mockResolvedValueOnce([]) // no application methods
        .mockResolvedValueOnce([]) // no units for this test
        .mockResolvedValueOnce([]) // no multiselect questions
        .mockResolvedValueOnce([
          {
            type: 'publicLottery',
            url: 'http://example.com',
            note: 'note',
            label: 'label',
            start_time: new Date(),
            end_time: new Date(),
            start_date: new Date(),
          },
        ]);

      prisma.listingEvents.createMany = jest.fn();

      const id = randomUUID();

      await service.transferJurisdictionListingData(
        {
          user: {
            id,
          } as unknown as User,
        } as unknown as ExpressRequest,
        {
          connectionString: 'Sample',
          jurisdiction: 'Sample jurisdiction',
        },
        externalPrismaClient,
      );

      expect(prisma.listingEvents.createMany).toBeCalledTimes(1);
      expect(prisma.listingEvents.createMany).toBeCalledWith({
        data: [
          {
            endTime: expect.anything(),
            label: 'label',
            note: 'note',
            startDate: expect.anything(),
            startTime: expect.anything(),
            type: 'publicLottery',
            url: 'http://example.com',
            listingId: createdListingId,
          },
        ],
      });
    });
  });

  it('should build ami chart import object', async () => {
    const id = randomUUID();
    prisma.scriptRuns.findUnique = jest.fn().mockResolvedValue(null);
    prisma.scriptRuns.create = jest.fn().mockResolvedValue(null);
    prisma.scriptRuns.update = jest.fn().mockResolvedValue(null);
    prisma.amiChart.create = jest.fn().mockResolvedValue(null);

    const name = 'example name';
    const scriptName = `AMI Chart ${name}`;
    const jurisdictionId = 'example jurisdictionId';
    const valueItem =
      '15 18400 21000 23650 26250 28350 30450 32550 34650\n30 39150 44750 50350 55900 60400 64850 69350 73800\n50 65250 74600 83900 93200 100700 108150 115600 123050';
    const res = await service.amiChartImport(
      {
        user: {
          id,
        } as unknown as User,
      } as unknown as ExpressRequest,
      {
        values: valueItem,
        name,
        jurisdictionId,
      },
    );
    expect(res.success).toEqual(true);
    expect(prisma.scriptRuns.findUnique).toHaveBeenCalledWith({
      where: {
        scriptName,
      },
    });
    expect(prisma.scriptRuns.create).toHaveBeenCalledWith({
      data: {
        scriptName,
        triggeringUser: id,
      },
    });
    expect(prisma.scriptRuns.update).toHaveBeenCalledWith({
      data: {
        didScriptRun: true,
        triggeringUser: id,
      },
      where: {
        scriptName,
      },
    });
    expect(prisma.amiChart.create).toHaveBeenCalledWith({
      data: {
        name,
        items: [
          {
            percentOfAmi: 15,
            householdSize: 1,
            income: 18400,
          },
          {
            percentOfAmi: 15,
            householdSize: 2,
            income: 21000,
          },
          {
            percentOfAmi: 15,
            householdSize: 3,
            income: 23650,
          },
          {
            percentOfAmi: 15,
            householdSize: 4,
            income: 26250,
          },
          {
            percentOfAmi: 15,
            householdSize: 5,
            income: 28350,
          },
          {
            percentOfAmi: 15,
            householdSize: 6,
            income: 30450,
          },
          {
            percentOfAmi: 15,
            householdSize: 7,
            income: 32550,
          },
          {
            percentOfAmi: 15,
            householdSize: 8,
            income: 34650,
          },
          {
            percentOfAmi: 30,
            householdSize: 1,
            income: 39150,
          },
          {
            percentOfAmi: 30,
            householdSize: 2,
            income: 44750,
          },
          {
            percentOfAmi: 30,
            householdSize: 3,
            income: 50350,
          },
          {
            percentOfAmi: 30,
            householdSize: 4,
            income: 55900,
          },
          {
            percentOfAmi: 30,
            householdSize: 5,
            income: 60400,
          },
          {
            percentOfAmi: 30,
            householdSize: 6,
            income: 64850,
          },
          {
            percentOfAmi: 30,
            householdSize: 7,
            income: 69350,
          },
          {
            percentOfAmi: 30,
            householdSize: 8,
            income: 73800,
          },
          {
            percentOfAmi: 50,
            householdSize: 1,
            income: 65250,
          },
          {
            percentOfAmi: 50,
            householdSize: 2,
            income: 74600,
          },
          {
            percentOfAmi: 50,
            householdSize: 3,
            income: 83900,
          },
          {
            percentOfAmi: 50,
            householdSize: 4,
            income: 93200,
          },
          {
            percentOfAmi: 50,
            householdSize: 5,
            income: 100700,
          },
          {
            percentOfAmi: 50,
            householdSize: 6,
            income: 108150,
          },
          {
            percentOfAmi: 50,
            householdSize: 7,
            income: 115600,
          },
          {
            percentOfAmi: 50,
            householdSize: 8,
            income: 123050,
          },
        ],
        jurisdictions: {
          connect: {
            id: jurisdictionId,
          },
        },
      },
      include: {
        jurisdictions: true,
      },
    });
  });

  it('should transfer data', async () => {
    prisma.listings.updateMany = jest.fn().mockResolvedValue({ count: 1 });

    const id = randomUUID();
    const res = await service.optOutExistingLotteries({
      user: {
        id,
      } as unknown as User,
    } as unknown as ExpressRequest);

    expect(res.success).toBe(true);

    expect(prisma.listings.updateMany).toHaveBeenCalledWith({
      data: { lotteryOptIn: false },
      where: {
        reviewOrderType: ReviewOrderTypeEnum.lottery,
        lotteryOptIn: null,
      },
    });
  });

  // | ---------- HELPER TESTS BELOW ---------- | //
  it('should mark script run as started if no script run present in db', async () => {
    prisma.scriptRuns.findUnique = jest.fn().mockResolvedValue(null);
    prisma.scriptRuns.create = jest.fn().mockResolvedValue(null);

    const id = randomUUID();
    const scriptName = 'new run attempt';

    await service.markScriptAsRunStart(scriptName, {
      id,
    } as unknown as User);

    expect(prisma.scriptRuns.findUnique).toHaveBeenCalledWith({
      where: {
        scriptName,
      },
    });
    expect(prisma.scriptRuns.create).toHaveBeenCalledWith({
      data: {
        scriptName,
        triggeringUser: id,
      },
    });
  });

  it('should error if script run is in progress or failed', async () => {
    prisma.scriptRuns.findUnique = jest.fn().mockResolvedValue({
      id: randomUUID(),
      didScriptRun: false,
    });
    prisma.scriptRuns.create = jest.fn().mockResolvedValue(null);

    const id = randomUUID();
    const scriptName = 'new run attempt 2';

    await expect(
      async () =>
        await service.markScriptAsRunStart(scriptName, {
          id,
        } as unknown as User),
    ).rejects.toThrowError(
      `${scriptName} has an attempted run and it failed, or is in progress. If it failed, please delete the db entry and try again`,
    );

    expect(prisma.scriptRuns.findUnique).toHaveBeenCalledWith({
      where: {
        scriptName,
      },
    });
    expect(prisma.scriptRuns.create).not.toHaveBeenCalled();
  });

  it('should error if script run already succeeded', async () => {
    prisma.scriptRuns.findUnique = jest.fn().mockResolvedValue({
      id: randomUUID(),
      didScriptRun: true,
    });
    prisma.scriptRuns.create = jest.fn().mockResolvedValue(null);

    const id = randomUUID();
    const scriptName = 'new run attempt 3';

    await expect(
      async () =>
        await service.markScriptAsRunStart(scriptName, {
          id,
        } as unknown as User),
    ).rejects.toThrowError(`${scriptName} has already been run and succeeded`);

    expect(prisma.scriptRuns.findUnique).toHaveBeenCalledWith({
      where: {
        scriptName,
      },
    });
    expect(prisma.scriptRuns.create).not.toHaveBeenCalled();
  });

  it('should mark script run as started if no script run present in db', async () => {
    prisma.scriptRuns.update = jest.fn().mockResolvedValue(null);

    const id = randomUUID();
    const scriptName = 'new run attempt 4';

    await service.markScriptAsComplete(scriptName, {
      id,
    } as unknown as User);

    expect(prisma.scriptRuns.update).toHaveBeenCalledWith({
      data: {
        didScriptRun: true,
        triggeringUser: id,
      },
      where: {
        scriptName,
      },
    });
  });
});
