import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../../src/services/prisma.service';
import { ApplicationService } from '../../../src/services/application.service';
import {
  IncomePeriodEnum,
  ApplicationStatusEnum,
  ApplicationSubmissionTypeEnum,
  ApplicationReviewStatusEnum,
  YesNoEnum,
} from '@prisma/client';
import { ApplicationQueryParams } from '../../../src/dtos/applications/application-query-params.dto';
import { OrderByEnum } from '../../../src/enums/shared/order-by-enum';
import { ApplicationOrderByKeys } from '../../../src/enums/applications/order-by-enum';

describe('Testing unit rent type service', () => {
  let service: ApplicationService;
  let prisma: PrismaService;

  const mockApplication = (position: number, date: Date) => {
    return {
      id: `application id ${position}`,
      appUrl: `appUrl ${position}`,
      additionalPhone: true,
      additionalPhoneNumber: `additionalPhoneNumber ${position}`,
      additionalPhoneNumberType: `additionalPhoneNumberType ${position}`,
      householdSize: position,
      housingStatus: `housingStatus ${position}`,
      sendMailToMailingAddress: true,
      householdExpectingChanges: true,
      householdStudent: true,
      incomeVouchers: true,
      income: `income ${position}`,
      incomePeriod: IncomePeriodEnum.perMonth,
      preferences: {},
      status: ApplicationStatusEnum.submitted,
      submissionType: ApplicationSubmissionTypeEnum.electronical,
      acceptedTerms: true,
      submissionDate: date,
      markedAsDuplicate: false,
      confirmationCode: `confirmationCode ${position}`,
      reviewStatus: ApplicationReviewStatusEnum.valid,
      applicant: {
        firstName: `application ${position} firstName`,
        middleName: `application ${position} middleName`,
        lastName: `application ${position} lastName`,
        birthMonth: `application ${position} birthMonth`,
        birthDay: `application ${position} birthDay`,
        birthYear: `application ${position} birthYear`,
        emailAddress: `application ${position} emailAddress`,
        noEmail: false,
        phoneNumber: `application ${position} phoneNumber`,
        phoneNumberType: `application ${position} phoneNumberType`,
        noPhone: false,
        workInRegion: YesNoEnum.yes,
        applicantWorkAddress: {
          placeName: `application {i} applicantWorkAddress placeName`,
          city: `application {i} applicantWorkAddress city`,
          county: `application {i} applicantWorkAddress county`,
          state: `application {i} applicantWorkAddress state`,
          street: `application {i} applicantWorkAddress street`,
          street2: `application {i} applicantWorkAddress street2`,
          zipCode: `application {i} applicantWorkAddress zipCode`,
          latitude: `${position}`,
          longitude: `${position}`,
        },
        applicantAddress: {
          placeName: `application {i} applicantAddress placeName`,
          city: `application {i} applicantAddress city`,
          county: `application {i} applicantAddress county`,
          state: `application {i} applicantAddress state`,
          street: `application {i} applicantAddress street`,
          street2: `application {i} applicantAddress street2`,
          zipCode: `application {i} applicantAddress zipCode`,
          latitude: `${position}`,
          longitude: `${position}`,
        },
      },
      createdAt: date,
      updatedAt: date,
    };
  };

  const mockApplicationSet = (numberToCreate: number, date: Date) => {
    const toReturn = [];
    for (let i = 0; i < numberToCreate; i++) {
      toReturn.push(mockApplication(i, date));
    }
    return toReturn;
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ApplicationService, PrismaService],
    }).compile();

    service = module.get<ApplicationService>(ApplicationService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('testing list()', async () => {
    const date = new Date();
    prisma.applications.findMany = jest
      .fn()
      .mockResolvedValue(mockApplicationSet(3, date));
    prisma.applications.count = jest.fn().mockResolvedValue(3);
    prisma.applications.findFirst = jest.fn().mockResolvedValue({
      id: 'example id',
    });

    const params: ApplicationQueryParams = {
      orderBy: ApplicationOrderByKeys.createdAt,
      order: OrderByEnum.ASC,
      listingId: 'example listing id',
      limit: 3,
      page: 1,
    };

    expect(await service.list(params)).toEqual({
      items: [
        {
          id: `application id 0`,
          appUrl: `appUrl 0`,
          additionalPhone: true,
          additionalPhoneNumber: `additionalPhoneNumber 0`,
          additionalPhoneNumberType: `additionalPhoneNumberType 0`,
          householdSize: 0,
          housingStatus: `housingStatus 0`,
          sendMailToMailingAddress: true,
          householdExpectingChanges: true,
          householdStudent: true,
          incomeVouchers: true,
          income: `income 0`,
          incomePeriod: IncomePeriodEnum.perMonth,
          preferences: {
            claimed: undefined,
            key: undefined,
            options: undefined,
          },
          status: ApplicationStatusEnum.submitted,
          submissionType: ApplicationSubmissionTypeEnum.electronical,
          acceptedTerms: true,
          submissionDate: date,
          markedAsDuplicate: false,
          confirmationCode: `confirmationCode 0`,
          reviewStatus: ApplicationReviewStatusEnum.valid,
          applicant: {
            firstName: `application 0 firstName`,
            middleName: `application 0 middleName`,
            lastName: `application 0 lastName`,
            birthMonth: `application 0 birthMonth`,
            birthDay: `application 0 birthDay`,
            birthYear: `application 0 birthYear`,
            emailAddress: `application 0 emailaddress`,
            noEmail: false,
            phoneNumber: `application 0 phoneNumber`,
            phoneNumberType: `application 0 phoneNumberType`,
            noPhone: false,
            workInRegion: YesNoEnum.yes,
            applicantWorkAddress: {
              placeName: `application {i} applicantWorkAddress placeName`,
              city: `application {i} applicantWorkAddress city`,
              county: `application {i} applicantWorkAddress county`,
              state: `application {i} applicantWorkAddress state`,
              street: `application {i} applicantWorkAddress street`,
              street2: `application {i} applicantWorkAddress street2`,
              zipCode: `application {i} applicantWorkAddress zipCode`,
              latitude: 0,
              longitude: 0,
            },
            applicantAddress: {
              placeName: `application {i} applicantAddress placeName`,
              city: `application {i} applicantAddress city`,
              county: `application {i} applicantAddress county`,
              state: `application {i} applicantAddress state`,
              street: `application {i} applicantAddress street`,
              street2: `application {i} applicantAddress street2`,
              zipCode: `application {i} applicantAddress zipCode`,
              latitude: 0,
              longitude: 0,
            },
          },
          createdAt: date,
          updatedAt: date,
          flagged: true,
        },
        {
          id: `application id 1`,
          appUrl: `appUrl 1`,
          additionalPhone: true,
          additionalPhoneNumber: `additionalPhoneNumber 1`,
          additionalPhoneNumberType: `additionalPhoneNumberType 1`,
          householdSize: 1,
          housingStatus: `housingStatus 1`,
          sendMailToMailingAddress: true,
          householdExpectingChanges: true,
          householdStudent: true,
          incomeVouchers: true,
          income: `income 1`,
          incomePeriod: IncomePeriodEnum.perMonth,
          preferences: {
            claimed: undefined,
            key: undefined,
            options: undefined,
          },
          status: ApplicationStatusEnum.submitted,
          submissionType: ApplicationSubmissionTypeEnum.electronical,
          acceptedTerms: true,
          submissionDate: date,
          markedAsDuplicate: false,
          confirmationCode: `confirmationCode 1`,
          reviewStatus: ApplicationReviewStatusEnum.valid,
          applicant: {
            firstName: `application 1 firstName`,
            middleName: `application 1 middleName`,
            lastName: `application 1 lastName`,
            birthMonth: `application 1 birthMonth`,
            birthDay: `application 1 birthDay`,
            birthYear: `application 1 birthYear`,
            emailAddress: `application 1 emailaddress`,
            noEmail: false,
            phoneNumber: `application 1 phoneNumber`,
            phoneNumberType: `application 1 phoneNumberType`,
            noPhone: false,
            workInRegion: YesNoEnum.yes,
            applicantWorkAddress: {
              placeName: `application {i} applicantWorkAddress placeName`,
              city: `application {i} applicantWorkAddress city`,
              county: `application {i} applicantWorkAddress county`,
              state: `application {i} applicantWorkAddress state`,
              street: `application {i} applicantWorkAddress street`,
              street2: `application {i} applicantWorkAddress street2`,
              zipCode: `application {i} applicantWorkAddress zipCode`,
              latitude: 1,
              longitude: 1,
            },
            applicantAddress: {
              placeName: `application {i} applicantAddress placeName`,
              city: `application {i} applicantAddress city`,
              county: `application {i} applicantAddress county`,
              state: `application {i} applicantAddress state`,
              street: `application {i} applicantAddress street`,
              street2: `application {i} applicantAddress street2`,
              zipCode: `application {i} applicantAddress zipCode`,
              latitude: 1,
              longitude: 1,
            },
          },
          createdAt: date,
          updatedAt: date,
          flagged: true,
        },
        {
          id: `application id 2`,
          appUrl: `appUrl 2`,
          additionalPhone: true,
          additionalPhoneNumber: `additionalPhoneNumber 2`,
          additionalPhoneNumberType: `additionalPhoneNumberType 2`,
          householdSize: 2,
          housingStatus: `housingStatus 2`,
          sendMailToMailingAddress: true,
          householdExpectingChanges: true,
          householdStudent: true,
          incomeVouchers: true,
          income: `income 2`,
          incomePeriod: IncomePeriodEnum.perMonth,
          preferences: {
            claimed: undefined,
            key: undefined,
            options: undefined,
          },
          status: ApplicationStatusEnum.submitted,
          submissionType: ApplicationSubmissionTypeEnum.electronical,
          acceptedTerms: true,
          submissionDate: date,
          markedAsDuplicate: false,
          confirmationCode: `confirmationCode 2`,
          reviewStatus: ApplicationReviewStatusEnum.valid,
          applicant: {
            firstName: `application 2 firstName`,
            middleName: `application 2 middleName`,
            lastName: `application 2 lastName`,
            birthMonth: `application 2 birthMonth`,
            birthDay: `application 2 birthDay`,
            birthYear: `application 2 birthYear`,
            emailAddress: `application 2 emailaddress`,
            noEmail: false,
            phoneNumber: `application 2 phoneNumber`,
            phoneNumberType: `application 2 phoneNumberType`,
            noPhone: false,
            workInRegion: YesNoEnum.yes,
            applicantWorkAddress: {
              placeName: `application {i} applicantWorkAddress placeName`,
              city: `application {i} applicantWorkAddress city`,
              county: `application {i} applicantWorkAddress county`,
              state: `application {i} applicantWorkAddress state`,
              street: `application {i} applicantWorkAddress street`,
              street2: `application {i} applicantWorkAddress street2`,
              zipCode: `application {i} applicantWorkAddress zipCode`,
              latitude: 2,
              longitude: 2,
            },
            applicantAddress: {
              placeName: `application {i} applicantAddress placeName`,
              city: `application {i} applicantAddress city`,
              county: `application {i} applicantAddress county`,
              state: `application {i} applicantAddress state`,
              street: `application {i} applicantAddress street`,
              street2: `application {i} applicantAddress street2`,
              zipCode: `application {i} applicantAddress zipCode`,
              latitude: 2,
              longitude: 2,
            },
          },
          createdAt: date,
          updatedAt: date,
          flagged: true,
        },
      ],
      meta: {
        currentPage: 1,
        itemCount: 3,
        itemsPerPage: 3,
        totalItems: 3,
        totalPages: 1,
      },
    });

    expect(prisma.applications.count).toHaveBeenCalledWith({
      where: {
        AND: [
          {
            id: {
              not: null,
            },
          },
          {
            listingId: 'example listing id',
          },
        ],
      },
    });

    expect(prisma.applications.findFirst).toHaveBeenNthCalledWith(1, {
      select: {
        id: true,
      },
      where: {
        id: `application id 0`,
        applicationFlaggedSet: {
          some: {
            id: {
              not: null,
            },
          },
        },
      },
    });
    expect(prisma.applications.findFirst).toHaveBeenNthCalledWith(2, {
      select: {
        id: true,
      },
      where: {
        id: `application id 1`,
        applicationFlaggedSet: {
          some: {
            id: {
              not: null,
            },
          },
        },
      },
    });
    expect(prisma.applications.findFirst).toHaveBeenNthCalledWith(3, {
      select: {
        id: true,
      },
      where: {
        id: `application id 2`,
        applicationFlaggedSet: {
          some: {
            id: {
              not: null,
            },
          },
        },
      },
    });
  });

  it('testing findOne() with id present', async () => {
    const date = new Date();

    prisma.applications.findFirst = jest
      .fn()
      .mockResolvedValue(mockApplication(3, date));

    expect(await service.findOne('example Id')).toEqual({
      id: `application id 3`,
      appUrl: `appUrl 3`,
      additionalPhone: true,
      additionalPhoneNumber: `additionalPhoneNumber 3`,
      additionalPhoneNumberType: `additionalPhoneNumberType 3`,
      householdSize: 3,
      housingStatus: `housingStatus 3`,
      sendMailToMailingAddress: true,
      householdExpectingChanges: true,
      householdStudent: true,
      incomeVouchers: true,
      income: `income 3`,
      incomePeriod: IncomePeriodEnum.perMonth,
      preferences: {},
      status: ApplicationStatusEnum.submitted,
      submissionType: ApplicationSubmissionTypeEnum.electronical,
      acceptedTerms: true,
      submissionDate: date,
      markedAsDuplicate: false,
      confirmationCode: `confirmationCode 3`,
      reviewStatus: ApplicationReviewStatusEnum.valid,
      applicant: {
        firstName: `application 3 firstName`,
        middleName: `application 3 middleName`,
        lastName: `application 3 lastName`,
        birthMonth: `application 3 birthMonth`,
        birthDay: `application 3 birthDay`,
        birthYear: `application 3 birthYear`,
        emailAddress: `application 3 emailaddress`,
        noEmail: false,
        phoneNumber: `application 3 phoneNumber`,
        phoneNumberType: `application 3 phoneNumberType`,
        noPhone: false,
        workInRegion: YesNoEnum.yes,
        applicantWorkAddress: {
          placeName: `application {i} applicantWorkAddress placeName`,
          city: `application {i} applicantWorkAddress city`,
          county: `application {i} applicantWorkAddress county`,
          state: `application {i} applicantWorkAddress state`,
          street: `application {i} applicantWorkAddress street`,
          street2: `application {i} applicantWorkAddress street2`,
          zipCode: `application {i} applicantWorkAddress zipCode`,
          latitude: 3,
          longitude: 3,
        },
        applicantAddress: {
          placeName: `application {i} applicantAddress placeName`,
          city: `application {i} applicantAddress city`,
          county: `application {i} applicantAddress county`,
          state: `application {i} applicantAddress state`,
          street: `application {i} applicantAddress street`,
          street2: `application {i} applicantAddress street2`,
          zipCode: `application {i} applicantAddress zipCode`,
          latitude: 3,
          longitude: 3,
        },
      },
      createdAt: date,
      updatedAt: date,
    });

    expect(prisma.applications.findFirst).toHaveBeenCalledWith({
      where: {
        id: {
          equals: 'example Id',
        },
      },
      include: {
        userAccounts: true,
        applicant: {
          include: {
            applicantAddress: true,
            applicantWorkAddress: true,
          },
        },
        applicationsMailingAddress: true,
        applicationsAlternateAddress: true,
        alternateContact: {
          include: {
            address: true,
          },
        },
        accessibility: true,
        demographics: true,
        householdMember: {
          include: {
            householdMemberAddress: true,
            householdMemberWorkAddress: true,
          },
        },
        preferredUnitTypes: true,
      },
    });
  });

  it('testing findOne() with id not present', async () => {
    prisma.applications.findFirst = jest.fn().mockResolvedValue(null);

    await expect(
      async () => await service.findOne('example Id'),
    ).rejects.toThrowError();

    expect(prisma.applications.findFirst).toHaveBeenCalledWith({
      where: {
        id: {
          equals: 'example Id',
        },
      },
      include: {
        userAccounts: true,
        applicant: {
          include: {
            applicantAddress: true,
            applicantWorkAddress: true,
          },
        },
        applicationsMailingAddress: true,
        applicationsAlternateAddress: true,
        alternateContact: {
          include: {
            address: true,
          },
        },
        accessibility: true,
        demographics: true,
        householdMember: {
          include: {
            householdMemberAddress: true,
            householdMemberWorkAddress: true,
          },
        },
        preferredUnitTypes: true,
      },
    });
  });
});
