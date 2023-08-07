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
import { randomUUID } from 'crypto';

describe('Testing application service', () => {
  let service: ApplicationService;
  let prisma: PrismaService;

  const mockApplication = (position: number, date: Date) => {
    return {
      id: randomUUID(),
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
      preferences: {
        claimed: true,
        key: 'example key',
        options: null,
      },
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
        emailAddress: `application ${position} emailaddress`,
        noEmail: false,
        phoneNumber: `application ${position} phoneNumber`,
        phoneNumberType: `application ${position} phoneNumberType`,
        noPhone: false,
        workInRegion: YesNoEnum.yes,
        applicantWorkAddress: {
          placeName: `application ${position} applicantWorkAddress placeName`,
          city: `application ${position} applicantWorkAddress city`,
          county: `application ${position} applicantWorkAddress county`,
          state: `application ${position} applicantWorkAddress state`,
          street: `application ${position} applicantWorkAddress street`,
          street2: `application ${position} applicantWorkAddress street2`,
          zipCode: `application ${position} applicantWorkAddress zipCode`,
          latitude: position,
          longitude: position,
        },
        applicantAddress: {
          placeName: `application ${position} applicantAddress placeName`,
          city: `application ${position} applicantAddress city`,
          county: `application ${position} applicantAddress county`,
          state: `application ${position} applicantAddress state`,
          street: `application ${position} applicantAddress street`,
          street2: `application ${position} applicantAddress street2`,
          zipCode: `application ${position} applicantAddress zipCode`,
          latitude: position,
          longitude: position,
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

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ApplicationService, PrismaService],
    }).compile();

    service = module.get<ApplicationService>(ApplicationService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should get applications from list() when applications are available', async () => {
    const date = new Date();
    const mockedValue = mockApplicationSet(3, date);
    prisma.applications.findMany = jest.fn().mockResolvedValue(mockedValue);
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
      items: mockedValue.map((mock) => ({ ...mock, flagged: true })),
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
        id: mockedValue[0].id,
        applicationFlaggedSet: {
          some: {},
        },
      },
    });
    expect(prisma.applications.findFirst).toHaveBeenNthCalledWith(2, {
      select: {
        id: true,
      },
      where: {
        id: mockedValue[1].id,
        applicationFlaggedSet: {
          some: {},
        },
      },
    });
    expect(prisma.applications.findFirst).toHaveBeenNthCalledWith(3, {
      select: {
        id: true,
      },
      where: {
        id: mockedValue[2].id,
        applicationFlaggedSet: {
          some: {},
        },
      },
    });
  });

  it('should get an application when findOne() is called and Id exists', async () => {
    const date = new Date();
    const mockedValue = mockApplication(3, date);
    prisma.applications.findFirst = jest.fn().mockResolvedValue(mockedValue);

    expect(await service.findOne('example Id')).toEqual(mockedValue);

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

  it("should throw error when findOne() is called and Id doens't exists", async () => {
    prisma.applications.findFirst = jest.fn().mockResolvedValue(null);

    await expect(
      async () => await service.findOne('example Id'),
    ).rejects.toThrowError(
      'applicationId example Id was requested but not found',
    );

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

  it('should get record from getDuplicateFlagsForApplication()', async () => {
    prisma.applications.findFirst = jest
      .fn()
      .mockResolvedValue({ id: 'example id' });

    const res = await service.getDuplicateFlagsForApplication('example id');

    expect(prisma.applications.findFirst).toHaveBeenCalledWith({
      select: {
        id: true,
      },
      where: {
        id: 'example id',
        applicationFlaggedSet: {
          some: {},
        },
      },
    });

    expect(res).toEqual({ id: 'example id' });
  });

  it('should return no filters when no params passed to buildWhereClause()', () => {
    const res = service.buildWhereClause({});
    expect(res).toEqual({ AND: [] });
  });

  it('should return userId filter when userId param passed to buildWhereClause()', () => {
    const res = service.buildWhereClause({
      userId: 'example user id',
    });
    expect(res).toEqual({
      AND: [
        {
          userAccounts: {
            id: 'example user id',
          },
        },
      ],
    });
  });

  it('should return listingId filter when listingId param passed to buildWhereClause()', () => {
    const res = service.buildWhereClause({
      listingId: 'example listing id',
    });
    expect(res).toEqual({
      AND: [
        {
          listingId: 'example listing id',
        },
      ],
    });
  });

  it('should return markedAsDuplicate filter when markedAsDuplicate param passed to buildWhereClause()', () => {
    const res = service.buildWhereClause({
      markedAsDuplicate: false,
    });
    expect(res).toEqual({
      AND: [
        {
          markedAsDuplicate: false,
        },
      ],
    });
  });

  it('should return mixed filters when several params passed to buildWhereClause()', () => {
    const res = service.buildWhereClause({
      userId: 'example user id',
      listingId: 'example listing id',
      markedAsDuplicate: false,
    });
    expect(res).toEqual({
      AND: [
        {
          userAccounts: {
            id: 'example user id',
          },
        },
        {
          listingId: 'example listing id',
        },
        {
          markedAsDuplicate: false,
        },
      ],
    });
  });

  it('should return search filter when search param passed to buildWhereClause()', () => {
    const res = service.buildWhereClause({
      search: 'test',
    });
    const searchFilter = { contains: 'test', mode: 'insensitive' };
    expect(res).toEqual({
      AND: [
        {
          OR: [
            {
              confirmationCode: searchFilter,
            },
            {
              applicant: {
                firstName: searchFilter,
              },
            },
            {
              applicant: {
                lastName: searchFilter,
              },
            },
            {
              applicant: {
                emailAddress: searchFilter,
              },
            },
            {
              applicant: {
                phoneNumber: searchFilter,
              },
            },
            {
              alternateContact: {
                firstName: searchFilter,
              },
            },
            {
              alternateContact: {
                lastName: searchFilter,
              },
            },
            {
              alternateContact: {
                emailAddress: searchFilter,
              },
            },
            {
              alternateContact: {
                phoneNumber: searchFilter,
              },
            },
          ],
        },
      ],
    });
  });
});
