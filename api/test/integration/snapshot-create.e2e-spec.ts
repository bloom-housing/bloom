import { AppModule } from '../../src/modules/app.module';
import { IdDTO } from '../../src/dtos/shared/id.dto';
import { INestApplication } from '@nestjs/common';
import {
  ApplicationAddressTypeEnum,
  ApplicationMethodsTypeEnum,
  DepositTypeEnum,
  HomeTypeEnum,
  LanguagesEnum,
  ListingEventsTypeEnum,
  ListingsStatusEnum,
  ListingTypeEnum,
  LotteryStatusEnum,
  MarketingSeasonEnum,
  MarketingTypeEnum,
  MonthEnum,
  MonthlyRentDeterminationTypeEnum,
  MultiselectQuestionsApplicationSectionEnum,
  RegionEnum,
  RentTypeEnum,
  ReviewOrderTypeEnum,
  UnitAccessibilityPriorityTypeEnum,
  UnitsStatusEnum,
  UnitTypeEnum,
} from '@prisma/client';
import { Login } from '../../src/dtos/auth/login.dto';
import { PrismaService } from '../../src/services/prisma.service';
import { randomUUID } from 'crypto';
import { Test, TestingModule } from '@nestjs/testing';
import { userFactory } from '../../prisma/seed-helpers/user-factory';
import cookieParser from 'cookie-parser';
import request from 'supertest';
import {
  unitTypeFactoryAll,
  unitTypeFactorySingle,
} from '../../prisma/seed-helpers/unit-type-factory';
import { unitRentTypeFactory } from '../../prisma/seed-helpers/unit-rent-type-factory';

describe('Snapshot Create Controller Tests', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let cookies = '';

  beforeEach(() => {
    jest.resetAllMocks();
  });

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.use(cookieParser());
    prisma = moduleFixture.get<PrismaService>(PrismaService);

    await app.init();

    const storedUser = await prisma.userAccounts.create({
      data: await userFactory({
        roles: { isAdmin: true },
        mfaEnabled: false,
        confirmedAt: new Date(),
      }),
    });
    const resLogIn = await request(app.getHttpServer())
      .post('/auth/login')
      .set({ passkey: process.env.API_PASS_KEY || '' })
      .send({
        email: storedUser.email,
        password: 'Abcdef12345!',
      } as Login)
      .expect(201);

    cookies = resLogIn.headers['set-cookie'];
  });

  afterAll(async () => {
    await prisma.$disconnect();
    await app.close();
  });

  describe('createUserSnapshot endpoint', () => {
    it('should create snapshot for user without ancilliary data', async () => {
      const userA = await prisma.userAccounts.create({
        data: {
          additionalPhoneExtension: 'example additionalPhoneExtension',
          additionalPhoneNumber: 'example additionalPhoneNumber',
          additionalPhoneNumberType: 'example additionalPhoneNumberType',
          agreedToTermsOfService: true,
          confirmedAt: new Date(),
          dob: new Date(),
          email: 'createUserSnapshot test 1',
          firstName: 'example firstName',
          hitConfirmationUrl: new Date(),
          isAdvocate: true,
          isApproved: true,
          language: LanguagesEnum.en,
          lastLoginAt: new Date(),
          lastName: 'example lastName',
          mfaEnabled: false,
          middleName: 'example middleName',
          passwordHash: 'example passwordHash',
          passwordUpdatedAt: new Date(),
          passwordValidForDays: 30,
          phoneExtension: 'example phoneExtension',
          phoneNumber: 'example phoneNumber',
          phoneNumberVerified: true,
          phoneType: 'example phoneType',
          title: 'example title',
          wasWarnedOfDeletion: false,
        },
        select: {
          id: true,
        },
      });

      const res = await request(app.getHttpServer())
        .put(`/snapshot/createUserSnapshot`)
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .send({
          id: userA.id,
        } as IdDTO)
        .set('Cookie', cookies)
        .expect(200);

      expect(res.body.success).toEqual(true);

      const userASnapshot = await prisma.userAccountSnapshot.findFirst({
        where: {
          originalId: userA.id,
        },
      });
      expect(userASnapshot).toEqual({
        id: expect.anything(),
        createdAt: expect.anything(),

        originalId: userA.id,
        originalCreatedAt: expect.anything(),
        updatedAt: expect.anything(),

        additionalPhoneExtension: 'example additionalPhoneExtension',
        additionalPhoneNumber: 'example additionalPhoneNumber',
        additionalPhoneNumberType: 'example additionalPhoneNumberType',
        agreedToTermsOfService: true,
        confirmedAt: expect.anything(),
        dob: expect.anything(),
        email: 'createUserSnapshot test 1',
        firstName: 'example firstName',
        hitConfirmationUrl: expect.anything(),
        isAdvocate: true,
        isApproved: true,
        language: LanguagesEnum.en,
        lastLoginAt: expect.anything(),
        lastName: 'example lastName',
        mfaEnabled: false,
        middleName: 'example middleName',
        passwordHash: 'example passwordHash',
        passwordUpdatedAt: expect.anything(),
        passwordValidForDays: 30,
        phoneExtension: 'example phoneExtension',
        phoneNumber: 'example phoneNumber',
        phoneNumberVerified: true,
        phoneType: 'example phoneType',
        title: 'example title',
        wasWarnedOfDeletion: false,

        activeAccessToken: null,
        activeRefreshToken: null,
        addressSnapshotId: null,
        agencyId: null,
        confirmationToken: null,
        failedLoginAttemptsCount: 0,
        resetToken: null,
        singleUseCode: null,
        singleUseCodeUpdatedAt: null,
      });
    });

    it('should create snapshot for user with full ancilliary data', async () => {
      const jurisA = await prisma.jurisdictions.create({
        data: {
          name: 'createUserSnapshot juris 1',
          rentalAssistanceDefault: 'example rentalAssistanceDefault',
        },
        select: {
          id: true,
        },
      });
      const jurisB = await prisma.jurisdictions.create({
        data: {
          name: 'createUserSnapshot juris 2',
          rentalAssistanceDefault: 'example rentalAssistanceDefault 2',
        },
        select: {
          id: true,
        },
      });

      const listingA = await prisma.listings.create({
        data: {
          name: 'createUserSnapshot listing 1',
          assets: [],
          displayWaitlistSize: false,
          jurisdictions: {
            connect: {
              id: jurisA.id,
            },
          },
        },
        select: {
          id: true,
        },
      });
      const listingB = await prisma.listings.create({
        data: {
          name: 'createUserSnapshot listing 2',
          assets: [],
          displayWaitlistSize: false,
          jurisdictions: {
            connect: {
              id: jurisA.id,
            },
          },
        },
        select: {
          id: true,
        },
      });

      const userA = await prisma.userAccounts.create({
        data: {
          additionalPhoneExtension: 'example additionalPhoneExtension',
          additionalPhoneNumber: 'example additionalPhoneNumber',
          additionalPhoneNumberType: 'example additionalPhoneNumberType',
          agreedToTermsOfService: true,
          confirmedAt: new Date(),
          dob: new Date(),
          email: 'createUserSnapshot test 2',
          firstName: 'example firstName',
          hitConfirmationUrl: new Date(),
          isAdvocate: true,
          isApproved: true,
          language: LanguagesEnum.en,
          lastLoginAt: new Date(),
          lastName: 'example lastName',
          mfaEnabled: false,
          middleName: 'example middleName',
          passwordHash: 'example passwordHash',
          passwordUpdatedAt: new Date(),
          passwordValidForDays: 30,
          phoneExtension: 'example phoneExtension',
          phoneNumber: 'example phoneNumber',
          phoneNumberVerified: true,
          phoneType: 'example phoneType',
          title: 'example title',
          wasWarnedOfDeletion: false,

          address: {
            create: {
              city: 'example city',
              county: 'example county',
              latitude: 10.1,
              longitude: 1.1,
              placeName: 'example placeName',
              state: 'example state',
              street: 'example street',
              street2: 'example street2',
              zipCode: 'example zipCode',
            },
          },
          userRoles: {
            create: {
              isAdmin: false,
              isJurisdictionalAdmin: false,
              isLimitedJurisdictionalAdmin: false,
              isPartner: false,
              isSuperAdmin: true,
              isSupportAdmin: false,
            },
          },
          jurisdictions: {
            connect: [
              {
                id: jurisA.id,
              },
              {
                id: jurisB.id,
              },
            ],
          },
          listings: {
            connect: [
              {
                id: listingA.id,
              },
              {
                id: listingB.id,
              },
            ],
          },
          agency: {
            create: {
              name: 'createUserSnapshot test agency',
              jurisdictions: {
                connect: {
                  id: jurisA.id,
                },
              },
            },
          },
        },
        select: {
          id: true,
          addressId: true,
          agencyId: true,
          jurisdictions: {
            select: {
              id: true,
            },
          },
          listings: {
            select: {
              id: true,
            },
          },
        },
      });

      const res = await request(app.getHttpServer())
        .put(`/snapshot/createUserSnapshot`)
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .send({
          id: userA.id,
        } as IdDTO)
        .set('Cookie', cookies)
        .expect(200);

      expect(res.body.success).toEqual(true);

      const userASnapshot = await prisma.userAccountSnapshot.findFirst({
        where: {
          originalId: userA.id,
        },
      });
      const addressSnapshot = await prisma.addressSnapshot.findFirst({
        where: {
          id: userASnapshot.addressSnapshotId,
        },
      });
      const userRoleSnapshot = await prisma.userRoleSnapshot.findFirst({
        where: {
          userSnapshotId: userASnapshot.id,
        },
      });
      const snapshotJurisdictions = await prisma.jurisdictions.findMany({
        where: {
          userAccountSnapshot: {
            some: {
              id: userASnapshot.id,
            },
          },
        },
        select: {
          id: true,
        },
      });
      const snapshotlistings = await prisma.listings.findMany({
        where: {
          userAccountSnapshot: {
            some: {
              id: userASnapshot.id,
            },
          },
        },
        select: {
          id: true,
        },
      });
      const snapshotAgency = await prisma.agency.findFirst({
        where: {
          id: userASnapshot.agencyId,
        },
      });

      expect(userASnapshot).toEqual({
        id: expect.anything(),
        createdAt: expect.anything(),

        originalId: userA.id,
        originalCreatedAt: expect.anything(),
        updatedAt: expect.anything(),

        additionalPhoneExtension: 'example additionalPhoneExtension',
        additionalPhoneNumber: 'example additionalPhoneNumber',
        additionalPhoneNumberType: 'example additionalPhoneNumberType',
        agreedToTermsOfService: true,
        confirmedAt: expect.anything(),
        dob: expect.anything(),
        email: 'createUserSnapshot test 2',
        firstName: 'example firstName',
        hitConfirmationUrl: expect.anything(),
        isAdvocate: true,
        isApproved: true,
        language: LanguagesEnum.en,
        lastLoginAt: expect.anything(),
        lastName: 'example lastName',
        mfaEnabled: false,
        middleName: 'example middleName',
        passwordHash: 'example passwordHash',
        passwordUpdatedAt: expect.anything(),
        passwordValidForDays: 30,
        phoneExtension: 'example phoneExtension',
        phoneNumber: 'example phoneNumber',
        phoneNumberVerified: true,
        phoneType: 'example phoneType',
        title: 'example title',
        wasWarnedOfDeletion: false,

        addressSnapshotId: addressSnapshot.id,
        agencyId: snapshotAgency.id,

        activeAccessToken: null,
        activeRefreshToken: null,
        confirmationToken: null,
        failedLoginAttemptsCount: 0,
        resetToken: null,
        singleUseCode: null,
        singleUseCodeUpdatedAt: null,
      });
      expect(addressSnapshot).toEqual({
        id: expect.anything(),
        createdAt: expect.anything(),

        originalId: userA.addressId,
        originalCreatedAt: expect.anything(),
        updatedAt: expect.anything(),

        city: 'example city',
        county: 'example county',
        latitude: expect.anything(),
        longitude: expect.anything(),
        placeName: 'example placeName',
        state: 'example state',
        street: 'example street',
        street2: 'example street2',
        zipCode: 'example zipCode',
      });
      expect(userRoleSnapshot).toEqual({
        id: expect.anything(),
        createdAt: expect.anything(),

        isAdmin: false,
        isJurisdictionalAdmin: false,
        isLimitedJurisdictionalAdmin: false,
        isPartner: false,
        isSuperAdmin: true,
        isSupportAdmin: false,
        userSnapshotId: userASnapshot.id,
      });
      expect(
        snapshotJurisdictions.every((juris) => {
          return userA.jurisdictions.some((elem) => elem.id === juris.id);
        }),
      ).toBe(true);
      expect(
        snapshotlistings.every((listing) => {
          return userA.listings.some((elem) => elem.id === listing.id);
        }),
      ).toBe(true);
      expect(snapshotAgency).toEqual({
        id: expect.anything(),
        createdAt: expect.anything(),
        updatedAt: expect.anything(),

        name: 'createUserSnapshot test agency',
        jurisdictionsId: jurisA.id,
      });
    });

    it('should error if attempting to make a user snapshot against a user id that does not exist', async () => {
      const randomId = randomUUID();
      const res = await request(app.getHttpServer())
        .put(`/snapshot/createUserSnapshot`)
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .send({
          id: randomId,
        } as IdDTO)
        .set('Cookie', cookies)
        .expect(500);

      expect(res.body.message).toEqual(
        `Snapshot was requested for user id: ${randomId}, but that id does not exist`,
      );

      const userASnapshot = await prisma.userAccountSnapshot.findFirst({
        where: {
          originalId: randomId,
        },
      });
      expect(userASnapshot).toEqual(null);
    });
  });

  describe('createListingSnapshot endpoint', () => {
    it('should create snapshot for listing without ancilliary data', async () => {
      const listingA = await prisma.listings.create({
        data: {
          accessibility: 'example accessibility',
          accessibleMarketingFlyer: 'example accessibleMarketingFlyer',
          additionalApplicationSubmissionNotes:
            'example additionalApplicationSubmissionNotes',
          allowsCats: true,
          allowsDogs: true,
          amenities: 'example amenities',
          amiPercentageMax: 1,
          amiPercentageMin: 2,
          applicationDropOffAddressOfficeHours:
            'example applicationDropOffAddressOfficeHours',
          applicationDropOffAddressType:
            ApplicationAddressTypeEnum.leasingAgent,
          applicationDueDate: new Date(),
          applicationFee: 'example applicationFee',
          applicationMailingAddressType:
            ApplicationAddressTypeEnum.leasingAgent,
          applicationOpenDate: new Date(),
          applicationOrganization: 'example applicationOrganization',
          applicationPickUpAddressOfficeHours:
            'example applicationPickUpAddressOfficeHours',
          applicationPickUpAddressType: ApplicationAddressTypeEnum.leasingAgent,
          assets: '[]',
          buildingSelectionCriteria: 'example buildingSelectionCriteria',
          buildingTotalUnits: 10,
          closedAt: new Date(),
          cocInfo: 'example cocInfo',
          commonDigitalApplication: true,
          communityDisclaimerDescription:
            'example communityDisclaimerDescription',
          communityDisclaimerTitle: 'example communityDisclaimerTitle',
          configurableRegion: 'example configurableRegion',
          contentUpdatedAt: new Date(),
          costsNotIncluded: 'example costsNotIncluded',
          creditHistory: 'example creditHistory',
          creditScreeningFee: 'example creditScreeningFee',
          criminalBackground: 'example criminalBackground',
          customMapPin: true,
          depositHelperText: 'example depositHelperText',
          depositMax: 'example depositMax',
          depositMin: 'example depositMin',
          depositType: DepositTypeEnum.fixedDeposit,
          depositValue: 10.01,
          developer: 'example developer',
          digitalApplication: true,
          disableUnitsAccordion: true,
          displayWaitlistSize: true,
          hasHudEbllClearance: true,
          homeType: HomeTypeEnum.apartment,
          householdSizeMax: 5,
          householdSizeMin: 1,
          hrdId: 'example hrdId',
          includeCommunityDisclaimer: true,
          isVerified: true,
          isWaitlistOpen: true,
          leasingAgentEmail: 'example leasingAgentEmail',
          leasingAgentName: 'example leasingAgentName',
          leasingAgentOfficeHours: 'example leasingAgentOfficeHours',
          leasingAgentPhone: 'example leasingAgentPhone',
          leasingAgentTitle: 'example leasingAgentTitle',
          listingFileNumber: 'example listingFileNumber',
          listingType: ListingTypeEnum.regulated,
          lotteryLastPublishedAt: new Date(),
          lotteryLastRunAt: new Date(),
          lotteryOptIn: true,
          lotteryStatus: LotteryStatusEnum.ran,
          managementCompany: 'example managementCompany',
          managementWebsite: 'example managementWebsite',
          marketingFlyer: 'example marketingFlyer',
          marketingMonth: MonthEnum.january,
          marketingSeason: MarketingSeasonEnum.spring,
          marketingType: MarketingTypeEnum.marketing,
          marketingYear: 2026,
          name: 'example name',
          neighborhood: 'example neighborhood',
          ownerCompany: 'example ownerCompany',
          paperApplication: true,
          parkingFee: 'example parkingFee',
          petPolicy: 'example petPolicy',
          phoneNumber: 'example phoneNumber',
          postmarkedApplicationsReceivedByDate: new Date(),
          programRules: 'example programRules',
          publishedAt: new Date(),
          referralOpportunity: true,
          region: RegionEnum.Greater_Downtown,
          rentalAssistance: 'example rentalAssistance',
          rentalHistory: 'example rentalHistory',
          requestedChanges: 'example requestedChanges',
          requestedChangesDate: new Date(),
          requiredDocuments: 'example requiredDocuments',
          reservedCommunityDescription: 'example reservedCommunityDescription',
          reservedCommunityMinAge: 50,
          resultLink: 'example resultLink',
          reviewOrderType: ReviewOrderTypeEnum.lottery,
          section8Acceptance: true,
          servicesOffered: 'example servicesOffered',
          smokingPolicy: 'example smokingPolicy',
          specialNotes: 'example specialNotes',
          status: ListingsStatusEnum.active,
          temporaryListingId: 58,
          unitAmenities: 'example unitAmenities',
          unitsAvailable: 60,
          verifiedAt: new Date(),
          waitlistCurrentSize: 1,
          waitlistMaxSize: 2,
          waitlistOpenSpots: 3,
          wasCreatedExternally: true,
          whatToExpect: 'example whatToExpect',
          whatToExpectAdditionalText: 'example whatToExpectAdditionalText',
          yearBuilt: 2026,
        },
        select: {
          id: true,
        },
      });

      const res = await request(app.getHttpServer())
        .put(`/snapshot/createListingSnapshot`)
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .send({
          id: listingA.id,
        } as IdDTO)
        .set('Cookie', cookies)
        .expect(200);

      expect(res.body.success).toEqual(true);

      const listingASnapshot = await prisma.listingSnapshot.findFirst({
        where: {
          originalId: listingA.id,
        },
        select: {
          id: true,
          originalId: true,
        },
      });
      expect(listingASnapshot).toEqual({
        id: expect.anything(),
        originalId: listingA.id,
      });
    });

    it('should create snapshot for listing with full ancilliary data', async () => {
      const jurisA = await prisma.jurisdictions.create({
        data: {
          name: 'createListingSnapshot juris',
          rentalAssistanceDefault: 'example rentalAssistanceDefault',
        },
        select: {
          id: true,
        },
      });

      const reservedCommunityTypes = await prisma.reservedCommunityTypes.create(
        {
          data: {
            name: 'createListingSnapshot comm type',
            jurisdictions: {
              connect: {
                id: jurisA.id,
              },
            },
          },
          select: {
            id: true,
          },
        },
      );

      const msq1 = await prisma.multiselectQuestions.create({
        select: {
          id: true,
        },
        data: {
          applicationSection:
            MultiselectQuestionsApplicationSectionEnum.preferences,
          isExclusive: false,
          name: 'createListingSnapshot msq 1',
          text: 'createListingSnapshot msq 1',
          jurisdiction: {
            connect: {
              id: jurisA.id,
            },
          },
        },
      });
      const msq2 = await prisma.multiselectQuestions.create({
        select: {
          id: true,
        },
        data: {
          applicationSection:
            MultiselectQuestionsApplicationSectionEnum.preferences,
          isExclusive: false,
          name: 'createListingSnapshot msq 2',
          text: 'createListingSnapshot msq 2',
          jurisdiction: {
            connect: {
              id: jurisA.id,
            },
          },
        },
      });
      const property = await prisma.properties.create({
        select: {
          id: true,
        },
        data: {
          name: 'createListingSnapshot property',
        },
      });
      const amiChart = await prisma.amiChart.create({
        select: {
          id: true,
        },
        data: {
          items: '[]',
          name: 'createListingSnapshot amiChart',
          jurisdictions: {
            connect: {
              id: jurisA.id,
            },
          },
        },
      });
      const rentType = await prisma.unitRentTypes.create({
        data: unitRentTypeFactory(),
      });

      await unitTypeFactoryAll(prisma);
      const unitType1 = await unitTypeFactorySingle(
        prisma,
        UnitTypeEnum.oneBdrm,
      );
      const unitType2 = await unitTypeFactorySingle(
        prisma,
        UnitTypeEnum.twoBdrm,
      );

      const listingA = await prisma.listings.create({
        data: {
          accessibility: 'example accessibility',
          accessibleMarketingFlyer: 'example accessibleMarketingFlyer',
          additionalApplicationSubmissionNotes:
            'example additionalApplicationSubmissionNotes',
          allowsCats: true,
          allowsDogs: true,
          amenities: 'example amenities',
          amiPercentageMax: 1,
          amiPercentageMin: 2,
          applicationDropOffAddressOfficeHours:
            'example applicationDropOffAddressOfficeHours',
          applicationDropOffAddressType:
            ApplicationAddressTypeEnum.leasingAgent,
          applicationDueDate: new Date(),
          applicationFee: 'example applicationFee',
          applicationMailingAddressType:
            ApplicationAddressTypeEnum.leasingAgent,
          applicationOpenDate: new Date(),
          applicationOrganization: 'example applicationOrganization',
          applicationPickUpAddressOfficeHours:
            'example applicationPickUpAddressOfficeHours',
          applicationPickUpAddressType: ApplicationAddressTypeEnum.leasingAgent,
          assets: '[]',
          buildingSelectionCriteria: 'example buildingSelectionCriteria',
          buildingTotalUnits: 10,
          closedAt: new Date(),
          cocInfo: 'example cocInfo',
          commonDigitalApplication: true,
          communityDisclaimerDescription:
            'example communityDisclaimerDescription',
          communityDisclaimerTitle: 'example communityDisclaimerTitle',
          configurableRegion: 'example configurableRegion',
          contentUpdatedAt: new Date(),
          costsNotIncluded: 'example costsNotIncluded',
          creditHistory: 'example creditHistory',
          creditScreeningFee: 'example creditScreeningFee',
          criminalBackground: 'example criminalBackground',
          customMapPin: true,
          depositHelperText: 'example depositHelperText',
          depositMax: 'example depositMax',
          depositMin: 'example depositMin',
          depositType: DepositTypeEnum.fixedDeposit,
          depositValue: 10.01,
          developer: 'example developer',
          digitalApplication: true,
          disableUnitsAccordion: true,
          displayWaitlistSize: true,
          hasHudEbllClearance: true,
          homeType: HomeTypeEnum.apartment,
          householdSizeMax: 5,
          householdSizeMin: 1,
          hrdId: 'example hrdId',
          includeCommunityDisclaimer: true,
          isVerified: true,
          isWaitlistOpen: true,
          leasingAgentEmail: 'example leasingAgentEmail',
          leasingAgentName: 'example leasingAgentName',
          leasingAgentOfficeHours: 'example leasingAgentOfficeHours',
          leasingAgentPhone: 'example leasingAgentPhone',
          leasingAgentTitle: 'example leasingAgentTitle',
          listingFileNumber: 'example listingFileNumber',
          listingType: ListingTypeEnum.regulated,
          lotteryLastPublishedAt: new Date(),
          lotteryLastRunAt: new Date(),
          lotteryOptIn: true,
          lotteryStatus: LotteryStatusEnum.ran,
          managementCompany: 'example managementCompany',
          managementWebsite: 'example managementWebsite',
          marketingFlyer: 'example marketingFlyer',
          marketingMonth: MonthEnum.january,
          marketingSeason: MarketingSeasonEnum.spring,
          marketingType: MarketingTypeEnum.marketing,
          marketingYear: 2026,
          name: 'example name',
          neighborhood: 'example neighborhood',
          ownerCompany: 'example ownerCompany',
          paperApplication: true,
          parkingFee: 'example parkingFee',
          petPolicy: 'example petPolicy',
          phoneNumber: 'example phoneNumber',
          postmarkedApplicationsReceivedByDate: new Date(),
          programRules: 'example programRules',
          publishedAt: new Date(),
          referralOpportunity: true,
          region: RegionEnum.Greater_Downtown,
          rentalAssistance: 'example rentalAssistance',
          rentalHistory: 'example rentalHistory',
          requestedChanges: 'example requestedChanges',
          requestedChangesDate: new Date(),
          requiredDocuments: 'example requiredDocuments',
          reservedCommunityDescription: 'example reservedCommunityDescription',
          reservedCommunityMinAge: 50,
          resultLink: 'example resultLink',
          reviewOrderType: ReviewOrderTypeEnum.lottery,
          section8Acceptance: true,
          servicesOffered: 'example servicesOffered',
          smokingPolicy: 'example smokingPolicy',
          specialNotes: 'example specialNotes',
          status: ListingsStatusEnum.active,
          temporaryListingId: 58,
          unitAmenities: 'example unitAmenities',
          unitsAvailable: 60,
          verifiedAt: new Date(),
          waitlistCurrentSize: 1,
          waitlistMaxSize: 2,
          waitlistOpenSpots: 3,
          wasCreatedExternally: true,
          whatToExpect: 'example whatToExpect',
          whatToExpectAdditionalText: 'example whatToExpectAdditionalText',
          yearBuilt: 2026,

          applicationMethods: {
            create: [
              {
                acceptsPostmarkedApplications: true,
                externalReference: 'example externalReference',
                label: 'example label',
                phoneNumber: 'example phoneNumber',
                type: ApplicationMethodsTypeEnum.ExternalLink,
                paperApplications: {
                  create: [
                    {
                      language: LanguagesEnum.ko,
                      assets: {
                        create: {
                          fileId: 'example fileId',
                          label: 'example label',
                        },
                      },
                    },
                    {
                      language: LanguagesEnum.ko,
                      assets: {
                        create: {
                          fileId: 'example fileId',
                          label: 'example label',
                        },
                      },
                    },
                  ],
                },
              },
              {
                acceptsPostmarkedApplications: true,
                externalReference: 'example externalReference',
                label: 'example label',
                phoneNumber: 'example phoneNumber',
                type: ApplicationMethodsTypeEnum.ExternalLink,
                paperApplications: {
                  create: [
                    {
                      language: LanguagesEnum.ko,
                      assets: {
                        create: {
                          fileId: 'example fileId',
                          label: 'example label',
                        },
                      },
                    },
                    {
                      language: LanguagesEnum.ko,
                      assets: {
                        create: {
                          fileId: 'example fileId',
                          label: 'example label',
                        },
                      },
                    },
                  ],
                },
              },
            ],
          },
          jurisdictions: {
            connect: {
              id: jurisA.id,
            },
          },
          reservedCommunityTypes: {
            connect: {
              id: reservedCommunityTypes.id,
            },
          },
          listingFeatures: {
            create: {
              accessibleHeightToilet: true,
              accessibleParking: true,
              acInUnit: true,
              barrierFreeBathroom: true,
              barrierFreeEntrance: true,
              barrierFreePropertyEntrance: true,
              barrierFreeUnitEntrance: true,
              bathGrabBarsOrReinforcements: true,
              bathroomCounterLowered: true,
              brailleSignageInBuilding: true,
              carbonMonoxideDetectorWithStrobe: true,
              carpetInUnit: true,
              elevator: true,
              extraAudibleCarbonMonoxideDetector: true,
              extraAudibleSmokeDetector: true,
              fireSuppressionSprinklerSystem: true,
              frontControlsDishwasher: true,
              frontControlsStoveCookTop: true,
              grabBars: true,
              hardFlooringInUnit: true,
              hearing: true,
              hearingAndVision: true,
              heatingInUnit: true,
              inUnitWasherDryer: true,
              kitchenCounterLowered: true,
              laundryInBuilding: true,
              leverHandlesOnDoors: true,
              leverHandlesOnFaucets: true,
              loweredCabinets: true,
              loweredLightSwitch: true,
              mobility: true,
              noEntryStairs: true,
              nonDigitalKitchenAppliances: true,
              noStairsToParkingSpots: true,
              noStairsWithinUnit: true,
              parkingOnSite: true,
              refrigeratorWithBottomDoorFreezer: true,
              rollInShower: true,
              serviceAnimalsAllowed: true,
              smokeDetectorWithStrobe: true,
              streetLevelEntrance: true,
              toiletGrabBarsOrReinforcements: true,
              ttyAmplifiedPhone: true,
              turningCircleInBathrooms: true,
              visual: true,
              walkInShower: true,
              wheelchairRamp: true,
              wideDoorways: true,
            },
          },
          listingNeighborhoodAmenities: {
            create: {
              busStops: 'example busStops',
              groceryStores: 'example groceryStores',
              healthCareResources: 'example healthCareResources',
              hospitals: 'example hospitals',
              parksAndCommunityCenters: 'example parksAndCommunityCenters',
              pharmacies: 'example pharmacies',
              playgrounds: 'example playgrounds',
              publicTransportation: 'example publicTransportation',
              recreationalFacilities: 'example recreationalFacilities',
              schools: 'example schools',
              seniorCenters: 'example seniorCenters',
              shoppingVenues: 'example shoppingVenues',
            },
          },
          listingsApplicationDropOffAddress: {
            create: {
              city: 'example city',
              county: 'example county',
              latitude: 1.025,
              longitude: 1.025,
              placeName: 'example placeName',
              state: 'example state',
              street: 'example street',
              street2: 'example street2',
              zipCode: 'example zipCode',
            },
          },
          listingsApplicationMailingAddress: {
            create: {
              city: 'example city',
              county: 'example county',
              latitude: 1.025,
              longitude: 1.025,
              placeName: 'example placeName',
              state: 'example state',
              street: 'example street',
              street2: 'example street2',
              zipCode: 'example zipCode',
            },
          },
          listingsApplicationPickUpAddress: {
            create: {
              city: 'example city',
              county: 'example county',
              latitude: 1.025,
              longitude: 1.025,
              placeName: 'example placeName',
              state: 'example state',
              street: 'example street',
              street2: 'example street2',
              zipCode: 'example zipCode',
            },
          },
          listingsBuildingAddress: {
            create: {
              city: 'example city',
              county: 'example county',
              latitude: 1.025,
              longitude: 1.025,
              placeName: 'example placeName',
              state: 'example state',
              street: 'example street',
              street2: 'example street2',
              zipCode: 'example zipCode',
            },
          },
          listingsLeasingAgentAddress: {
            create: {
              city: 'example city',
              county: 'example county',
              latitude: 1.025,
              longitude: 1.025,
              placeName: 'example placeName',
              state: 'example state',
              street: 'example street',
              street2: 'example street2',
              zipCode: 'example zipCode',
            },
          },
          listingsAccessibleMarketingFlyerFile: {
            create: {
              fileId: 'example fileId',
              label: 'example label',
            },
          },
          listingsBuildingSelectionCriteriaFile: {
            create: {
              fileId: 'example fileId',
              label: 'example label',
            },
          },
          listingsMarketingFlyerFile: {
            create: {
              fileId: 'example fileId',
              label: 'example label',
            },
          },
          listingsResult: {
            create: {
              fileId: 'example fileId',
              label: 'example label',
            },
          },
          listingMultiselectQuestions: {
            create: [
              {
                multiselectQuestions: {
                  connect: {
                    id: msq1.id,
                  },
                },
                ordinal: 18,
              },
              {
                multiselectQuestions: {
                  connect: {
                    id: msq2.id,
                  },
                },
                ordinal: 19,
              },
            ],
          },
          listingUtilities: {
            create: {
              cable: true,
              electricity: true,
              gas: true,
              internet: true,
              phone: true,
              sewer: true,
              trash: true,
              water: true,
            },
          },
          listingImages: {
            create: [
              {
                assets: {
                  create: {
                    fileId: 'example fileId',
                    label: 'example label',
                  },
                },
                description: 'example description 1',
                ordinal: 48,
              },
              {
                assets: {
                  create: {
                    fileId: 'example fileId',
                    label: 'example label',
                  },
                },
                description: 'example description 2',
                ordinal: 1,
              },
            ],
          },
          listingEvents: {
            create: [
              {
                endTime: new Date(),
                label: 'example label',
                note: 'example note',
                startDate: new Date(),
                startTime: new Date(),
                type: ListingEventsTypeEnum.openHouse,
                url: 'example url',
                assets: {
                  create: {
                    fileId: 'example fileId',
                    label: 'example label',
                  },
                },
              },
              {
                endTime: new Date(),
                label: 'example label',
                note: 'example note',
                startDate: new Date(),
                startTime: new Date(),
                type: ListingEventsTypeEnum.openHouse,
                url: 'example url',
                assets: {
                  create: {
                    fileId: 'example fileId',
                    label: 'example label',
                  },
                },
              },
            ],
          },
          property: {
            connect: {
              id: property.id,
            },
          },
          requiredDocumentsList: {
            create: {
              birthCertificate: true,
              currentLandlordReference: true,
              governmentIssuedId: true,
              previousLandlordReference: true,
              proofOfAssets: true,
              proofOfCustody: true,
              proofOfIncome: true,
              residencyDocuments: true,
              socialSecurityCard: true,
            },
          },
          unitGroups: {
            create: [
              {
                bathroomMax: 10.874,
                bathroomMin: 10.874,
                flatRentValueFrom: 10.874,
                flatRentValueTo: 10.874,
                floorMax: 1,
                floorMin: 18,
                maxOccupancy: 9,
                minOccupancy: 12,
                monthlyRent: 1.54,
                openWaitlist: true,
                accessibilityPriorityType:
                  UnitAccessibilityPriorityTypeEnum.mobilityAndHearing,
                rentType: RentTypeEnum.fixedRent,
                sqFeetMax: 874.01,
                sqFeetMin: 984.25,
                totalAvailable: 12,
                totalCount: 15,
                unitGroupAmiLevels: {
                  create: [
                    {
                      amiPercentage: 80,
                      flatRentValue: 65.01,
                      monthlyRentDeterminationType:
                        MonthlyRentDeterminationTypeEnum.percentageOfIncome,
                      percentageOfIncomeValue: 78.4,
                      amiChart: {
                        connect: {
                          id: amiChart.id,
                        },
                      },
                    },
                  ],
                },
                unitTypes: {
                  connect: [
                    {
                      id: unitType1.id,
                    },
                    {
                      id: unitType2.id,
                    },
                  ],
                },
              },
              {
                bathroomMax: 10.874,
                bathroomMin: 10.874,
                flatRentValueFrom: 10.874,
                flatRentValueTo: 10.874,
                floorMax: 1,
                floorMin: 18,
                maxOccupancy: 9,
                minOccupancy: 12,
                monthlyRent: 1.54,
                openWaitlist: true,
                accessibilityPriorityType:
                  UnitAccessibilityPriorityTypeEnum.mobilityAndHearing,
                rentType: RentTypeEnum.fixedRent,
                sqFeetMax: 874.01,
                sqFeetMin: 984.25,
                totalAvailable: 12,
                totalCount: 15,
                unitGroupAmiLevels: {
                  create: [
                    {
                      amiPercentage: 80,
                      flatRentValue: 65.01,
                      monthlyRentDeterminationType:
                        MonthlyRentDeterminationTypeEnum.percentageOfIncome,
                      percentageOfIncomeValue: 78.4,
                      amiChart: {
                        connect: {
                          id: amiChart.id,
                        },
                      },
                    },
                  ],
                },
                unitTypes: {
                  connect: [
                    {
                      id: unitType1.id,
                    },
                    {
                      id: unitType2.id,
                    },
                  ],
                },
              },
            ],
          },
          units: {
            create: [
              {
                amiPercentage: 'example amiPercentage',
                annualIncomeMax: 'example annualIncomeMax',
                annualIncomeMin: 'example annualIncomeMin',
                bmrProgramChart: true,
                floor: 2,
                maxOccupancy: 3,
                minOccupancy: 4,
                monthlyIncomeMin: '5',
                monthlyRent: '6',
                monthlyRentAsPercentOfIncome: 7.05,
                numBathrooms: 8,
                numBedrooms: 9,
                number: 'example number',
                accessibilityPriorityType:
                  UnitAccessibilityPriorityTypeEnum.vision,
                sqFeet: 45.48,
                status: UnitsStatusEnum.unknown,
                amiChart: {
                  connect: {
                    id: amiChart.id,
                  },
                },
                unitAmiChartOverrides: {
                  create: {
                    items: '[]',
                  },
                },
                unitRentTypes: {
                  connect: {
                    id: rentType.id,
                  },
                },
                unitTypes: {
                  connect: {
                    id: unitType1.id,
                  },
                },
              },
              {
                amiPercentage: 'example amiPercentage',
                annualIncomeMax: 'example annualIncomeMax',
                annualIncomeMin: 'example annualIncomeMin',
                bmrProgramChart: true,
                floor: 12,
                maxOccupancy: 13,
                minOccupancy: 14,
                monthlyIncomeMin: '15',
                monthlyRent: '16',
                monthlyRentAsPercentOfIncome: 17.05,
                numBathrooms: 18,
                numBedrooms: 19,
                number: 'example number 2',
                accessibilityPriorityType:
                  UnitAccessibilityPriorityTypeEnum.vision,
                sqFeet: 45.48,
                status: UnitsStatusEnum.unknown,
                amiChart: {
                  connect: {
                    id: amiChart.id,
                  },
                },
                unitAmiChartOverrides: {
                  create: {
                    items: '[]',
                  },
                },
                unitRentTypes: {
                  connect: {
                    id: rentType.id,
                  },
                },
                unitTypes: {
                  connect: {
                    id: unitType1.id,
                  },
                },
              },
            ],
          },
        },
        select: {
          id: true,
        },
      });

      const res = await request(app.getHttpServer())
        .put(`/snapshot/createListingSnapshot`)
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .send({
          id: listingA.id,
        } as IdDTO)
        .set('Cookie', cookies)
        .expect(200);

      expect(res.body.success).toEqual(true);

      const listingASnapshot = await prisma.listingSnapshot.findFirst({
        where: {
          originalId: listingA.id,
        },
        select: {
          id: true,
          originalId: true,

          applicationMethod: {
            select: {
              id: true,
              originalId: true,
            },
          },
          jurisdiction: {
            select: {
              id: true,
            },
          },
          reservedCommunityType: {
            select: {
              id: true,
            },
          },
          listingFeature: {
            select: {
              id: true,
              originalId: true,
            },
          },
          listingNeighborhoodAmenity: {
            select: {
              id: true,
              originalId: true,
            },
          },
          listingsApplicationDropOffAddress: {
            select: {
              id: true,
              originalId: true,
            },
          },
          listingsApplicationMailingAddress: {
            select: {
              id: true,
              originalId: true,
            },
          },
          listingsApplicationPickUpAddress: {
            select: {
              id: true,
              originalId: true,
            },
          },
          listingsBuildingAddress: {
            select: {
              id: true,
              originalId: true,
            },
          },
          listingsLeasingAgentAddress: {
            select: {
              id: true,
              originalId: true,
            },
          },
          listingsAccessibleMarketingFlyerFile: {
            select: {
              id: true,
              originalId: true,
            },
          },
          listingsBuildingSelectionCriteriaFile: {
            select: {
              id: true,
              originalId: true,
            },
          },
          listingsMarketingFlyerFile: {
            select: {
              id: true,
              originalId: true,
            },
          },
          listingsResult: {
            select: {
              id: true,
              originalId: true,
            },
          },
          listingMultiselectQuestion: {
            select: {
              multiselectQuestionId: true,
            },
          },
          listingUtility: {
            select: {
              id: true,
              originalId: true,
            },
          },
          listingImage: {
            select: {
              imageSnapshotId: true,
            },
          },
          listingEvent: {
            select: {
              id: true,
              originalId: true,
            },
          },
          property: {
            select: {
              id: true,
            },
          },
          requiredDocumentsList: {
            select: {
              id: true,
              originalId: true,
            },
          },
          unitGroup: {
            select: {
              id: true,
              originalId: true,
            },
          },
          unit: {
            select: {
              id: true,
              originalId: true,
            },
          },
        },
      });

      expect(listingASnapshot.id).toEqual(expect.anything());
      expect(listingASnapshot.originalId).toEqual(listingA.id);

      expect(listingASnapshot.applicationMethod.length).toEqual(2);

      expect(listingASnapshot.jurisdiction.id).toEqual(jurisA.id);
      expect(listingASnapshot.reservedCommunityType.id).toEqual(
        reservedCommunityTypes.id,
      );
      expect(listingASnapshot.listingFeature).toEqual({
        id: expect.anything(),
        originalId: expect.anything(),
      });
      expect(listingASnapshot.listingNeighborhoodAmenity).toEqual({
        id: expect.anything(),
        originalId: expect.anything(),
      });
      expect(listingASnapshot.listingsApplicationDropOffAddress).toEqual({
        id: expect.anything(),
        originalId: expect.anything(),
      });
      expect(listingASnapshot.listingsApplicationMailingAddress).toEqual({
        id: expect.anything(),
        originalId: expect.anything(),
      });
      expect(listingASnapshot.listingsApplicationPickUpAddress).toEqual({
        id: expect.anything(),
        originalId: expect.anything(),
      });
      expect(listingASnapshot.listingsBuildingAddress).toEqual({
        id: expect.anything(),
        originalId: expect.anything(),
      });
      expect(listingASnapshot.listingsLeasingAgentAddress).toEqual({
        id: expect.anything(),
        originalId: expect.anything(),
      });
      expect(listingASnapshot.listingsAccessibleMarketingFlyerFile).toEqual({
        id: expect.anything(),
        originalId: expect.anything(),
      });
      expect(listingASnapshot.listingsBuildingSelectionCriteriaFile).toEqual({
        id: expect.anything(),
        originalId: expect.anything(),
      });
      expect(listingASnapshot.listingsMarketingFlyerFile).toEqual({
        id: expect.anything(),
        originalId: expect.anything(),
      });
      expect(listingASnapshot.listingsResult).toEqual({
        id: expect.anything(),
        originalId: expect.anything(),
      });
      expect(listingASnapshot.listingMultiselectQuestion.length).toEqual(2);
      expect(listingASnapshot.listingUtility).toEqual({
        id: expect.anything(),
        originalId: expect.anything(),
      });
      expect(listingASnapshot.listingImage.length).toEqual(2);
      expect(listingASnapshot.listingEvent.length).toEqual(2);
      expect(listingASnapshot.property.id).toEqual(property.id);
      expect(listingASnapshot.requiredDocumentsList).toEqual({
        id: expect.anything(),
        originalId: expect.anything(),
      });
      expect(listingASnapshot.unitGroup.length).toEqual(2);
      expect(listingASnapshot.unit.length).toEqual(2);
    });

    it('should error if attempting to make a listing snapshot against a listing id that does not exist', async () => {
      const randomId = randomUUID();
      const res = await request(app.getHttpServer())
        .put(`/snapshot/createListingSnapshot`)
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .send({
          id: randomId,
        } as IdDTO)
        .set('Cookie', cookies)
        .expect(500);

      expect(res.body.message).toEqual(
        `Snapshot was requested for listing id: ${randomId}, but that id does not exist`,
      );

      const listingASnapshot = await prisma.listingSnapshot.findFirst({
        where: {
          originalId: randomId,
        },
      });
      expect(listingASnapshot).toEqual(null);
    });
  });
});
