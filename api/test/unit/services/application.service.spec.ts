import { Test, TestingModule } from '@nestjs/testing';
import {
  IncomePeriodEnum,
  ApplicationStatusEnum,
  ApplicationSubmissionTypeEnum,
  ApplicationReviewStatusEnum,
  YesNoEnum,
  LanguagesEnum,
} from '@prisma/client';
import { randomUUID } from 'crypto';
import dayjs from 'dayjs';
import { Request as ExpressRequest } from 'express';
import { PrismaService } from '../../../src/services/prisma.service';
import { ApplicationService } from '../../../src/services/application.service';
import { ApplicationQueryParams } from '../../../src/dtos/applications/application-query-params.dto';
import { OrderByEnum } from '../../../src/enums/shared/order-by-enum';
import { ApplicationOrderByKeys } from '../../../src/enums/applications/order-by-enum';
import { ApplicationViews } from '../../../src/enums/applications/view-enum';
import { ApplicationCreate } from '../../../src/dtos/applications/application-create.dto';
import { addressFactory } from '../../../prisma/seed-helpers/address-factory';
import { AddressCreate } from '../../../src/dtos/addresses/address-create.dto';
import { InputType } from '../../../src/enums/shared/input-type-enum';
import { ApplicationUpdate } from '../../../src/dtos/applications/application-update.dto';
import { EmailService } from '../../../src/services/email.service';
import { PermissionService } from '../../../src/services/permission.service';
import { User } from '../../../src/dtos/users/user.dto';
import { permissionActions } from '../../../src/enums/permissions/permission-actions-enum';
import { GeocodingService } from '../../../src/services/geocoding.service';
import { AlternateContactRelationship } from '../../../src/enums/applications/alternate-contact-relationship-enum';
import { HouseholdMemberRelationship } from '../../../src/enums/applications/household-member-relationship-enum';

export const mockApplication = (
  position: number,
  date: Date,
  numberOfHouseholdMembers?: number,
  includeLotteryPosition?: boolean,
) => {
  let householdMember = undefined;
  if (numberOfHouseholdMembers) {
    householdMember = [];
    for (let i = 0; i < numberOfHouseholdMembers; i++) {
      householdMember.push({
        id: randomUUID(),
      });
    }
  }
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
    preferences: [{ claimed: true, key: 'example key', options: null }],
    programs: [{ claimed: true, key: 'example key', options: null }],
    preferredUnitTypes: [{ name: 'studio' }, { name: 'oneBdrm' }],
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
    demographics: {
      race: ['indigenous'],
      howDidYouHear: ['other'],
    },
    createdAt: date,
    updatedAt: date,
    householdMember: householdMember,
    applicationLotteryPositions: includeLotteryPosition
      ? [
          {
            ordinal: position,
          },
        ]
      : undefined,
  };
};

export const mockApplicationSet = (
  numberToCreate: number,
  date: Date,
  numberOfHouseholdMembers?: number,
  includeLotteryPosition?: boolean,
) => {
  const toReturn = [];
  for (let i = 0; i < numberToCreate; i++) {
    toReturn.push(
      mockApplication(
        i,
        date,
        numberOfHouseholdMembers,
        includeLotteryPosition,
      ),
    );
  }
  return toReturn;
};

export const mockCreateApplicationData = (
  exampleAddress: AddressCreate,
  submissionDate: Date,
): ApplicationCreate => {
  return {
    contactPreferences: ['example contact preference'],
    preferences: [
      {
        key: 'example key',
        claimed: true,
        options: [
          {
            key: 'example key',
            checked: true,
            extraData: [
              {
                type: InputType.boolean,
                key: 'example key',
                value: true,
              },
            ],
          },
        ],
      },
    ],
    status: ApplicationStatusEnum.submitted,
    submissionType: ApplicationSubmissionTypeEnum.electronical,
    applicant: {
      firstName: 'applicant first name',
      middleName: 'applicant middle name',
      lastName: 'applicant last name',
      birthMonth: '12',
      birthDay: '17',
      birthYear: '1993',
      emailAddress: 'example@email.com',
      noEmail: false,
      phoneNumber: '111-111-1111',
      phoneNumberType: 'Cell',
      noPhone: false,
      workInRegion: YesNoEnum.yes,
      applicantWorkAddress: exampleAddress,
      applicantAddress: exampleAddress,
    },
    accessibility: {
      mobility: false,
      vision: false,
      hearing: false,
    },
    alternateContact: {
      type: AlternateContactRelationship.other,
      otherType: 'example other type',
      firstName: 'example first name',
      lastName: 'example last name',
      agency: 'example agency',
      phoneNumber: '111-111-1111',
      emailAddress: 'example@email.com',
      address: exampleAddress,
    },
    applicationsAlternateAddress: exampleAddress,
    applicationsMailingAddress: exampleAddress,
    listings: {
      id: randomUUID(),
    },
    demographics: {
      gender: 'example gender',
      sexualOrientation: 'example sexual orientation',
      howDidYouHear: ['example how did you hear'],
      race: ['example race'],
      spokenLanguage: 'example language',
    },
    preferredUnitTypes: [
      {
        id: randomUUID(),
      },
    ],
    householdMember: [
      {
        orderId: 0,
        firstName: 'example first name',
        middleName: 'example middle name',
        lastName: 'example last name',
        birthMonth: '12',
        birthDay: '17',
        birthYear: '1993',
        sameAddress: YesNoEnum.yes,
        relationship: HouseholdMemberRelationship.other,
        workInRegion: YesNoEnum.yes,
        householdMemberWorkAddress: exampleAddress,
        householdMemberAddress: exampleAddress,
      },
    ],
    appUrl: 'http://www.example.com',
    additionalPhone: true,
    additionalPhoneNumber: '111-111-1111',
    additionalPhoneNumberType: 'example additional phone number type',
    householdSize: 2,
    housingStatus: 'example housing status',
    sendMailToMailingAddress: true,
    householdExpectingChanges: false,
    householdStudent: false,
    incomeVouchers: [],
    income: '36000',
    incomePeriod: IncomePeriodEnum.perYear,
    language: LanguagesEnum.en,
    acceptedTerms: true,
    submissionDate: submissionDate,
    reviewStatus: ApplicationReviewStatusEnum.valid,
    programs: [
      {
        key: 'example key',
        claimed: true,
        options: [
          {
            key: 'example key',
            checked: true,
            extraData: [
              {
                type: InputType.boolean,
                key: 'example key',
                value: true,
              },
            ],
          },
        ],
      },
    ],
  } as ApplicationCreate;
};

const detailView = {
  applicant: {
    select: {
      id: true,
      firstName: true,
      middleName: true,
      lastName: true,
      birthMonth: true,
      birthDay: true,
      birthYear: true,
      emailAddress: true,
      noEmail: true,
      phoneNumber: true,
      phoneNumberType: true,
      noPhone: true,
      workInRegion: true,
      applicantAddress: {
        select: {
          id: true,
          placeName: true,
          city: true,
          county: true,
          state: true,
          street: true,
          street2: true,
          zipCode: true,
          latitude: true,
          longitude: true,
        },
      },
      applicantWorkAddress: {
        select: {
          id: true,
          placeName: true,
          city: true,
          county: true,
          state: true,
          street: true,
          street2: true,
          zipCode: true,
          latitude: true,
          longitude: true,
        },
      },
    },
  },
  accessibility: {
    select: {
      id: true,
      mobility: true,
      vision: true,
      hearing: true,
    },
  },
  applicationsMailingAddress: {
    select: {
      id: true,
      placeName: true,
      city: true,
      county: true,
      state: true,
      street: true,
      street2: true,
      zipCode: true,
      latitude: true,
      longitude: true,
    },
  },
  applicationsAlternateAddress: {
    select: {
      id: true,
      placeName: true,
      city: true,
      county: true,
      state: true,
      street: true,
      street2: true,
      zipCode: true,
      latitude: true,
      longitude: true,
    },
  },
  alternateContact: {
    select: {
      id: true,
      type: true,
      otherType: true,
      firstName: true,
      lastName: true,
      agency: true,
      phoneNumber: true,
      emailAddress: true,
      address: {
        select: {
          id: true,
          placeName: true,
          city: true,
          county: true,
          state: true,
          street: true,
          street2: true,
          zipCode: true,
          latitude: true,
          longitude: true,
        },
      },
    },
  },
  demographics: {
    select: {
      id: true,
      createdAt: true,
      updatedAt: true,
      ethnicity: true,
      gender: true,
      sexualOrientation: true,
      howDidYouHear: true,
      race: true,
      spokenLanguage: true,
    },
  },
  preferredUnitTypes: {
    select: {
      id: true,
      name: true,
      numBedrooms: true,
    },
  },
  listings: {
    select: {
      id: true,
      name: true,
      jurisdictions: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  },
  householdMember: {
    select: {
      id: true,
      orderId: true,
      firstName: true,
      middleName: true,
      lastName: true,
      birthMonth: true,
      birthDay: true,
      birthYear: true,
      sameAddress: true,
      relationship: true,
      workInRegion: true,
      householdMemberAddress: {
        select: {
          id: true,
          placeName: true,
          city: true,
          county: true,
          state: true,
          street: true,
          street2: true,
          zipCode: true,
          latitude: true,
          longitude: true,
        },
      },
      householdMemberWorkAddress: {
        select: {
          id: true,
          placeName: true,
          city: true,
          county: true,
          state: true,
          street: true,
          street2: true,
          zipCode: true,
          latitude: true,
          longitude: true,
        },
      },
    },
  },
  userAccounts: {
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
    },
  },
};

const baseView = {
  applicant: {
    select: {
      id: true,
      firstName: true,
      middleName: true,
      lastName: true,
      birthMonth: true,
      birthDay: true,
      birthYear: true,
      emailAddress: true,
      noEmail: true,
      phoneNumber: true,
      phoneNumberType: true,
      noPhone: true,
      workInRegion: true,
      applicantAddress: {
        select: {
          id: true,
          placeName: true,
          city: true,
          county: true,
          state: true,
          street: true,
          street2: true,
          zipCode: true,
          latitude: true,
          longitude: true,
        },
      },
      applicantWorkAddress: {
        select: {
          id: true,
          placeName: true,
          city: true,
          county: true,
          state: true,
          street: true,
          street2: true,
          zipCode: true,
          latitude: true,
          longitude: true,
        },
      },
    },
  },
  accessibility: {
    select: {
      id: true,
      mobility: true,
      vision: true,
      hearing: true,
    },
  },
  applicationsMailingAddress: {
    select: {
      id: true,
      placeName: true,
      city: true,
      county: true,
      state: true,
      street: true,
      street2: true,
      zipCode: true,
      latitude: true,
      longitude: true,
    },
  },
  applicationsAlternateAddress: {
    select: {
      id: true,
      placeName: true,
      city: true,
      county: true,
      state: true,
      street: true,
      street2: true,
      zipCode: true,
      latitude: true,
      longitude: true,
    },
  },
  alternateContact: {
    select: {
      id: true,
      type: true,
      otherType: true,
      firstName: true,
      lastName: true,
      agency: true,
      phoneNumber: true,
      emailAddress: true,
      address: {
        select: {
          id: true,
          placeName: true,
          city: true,
          county: true,
          state: true,
          street: true,
          street2: true,
          zipCode: true,
          latitude: true,
          longitude: true,
        },
      },
    },
  },
  demographics: {
    select: {
      id: true,
      createdAt: true,
      updatedAt: true,
      ethnicity: true,
      gender: true,
      sexualOrientation: true,
      howDidYouHear: true,
      race: true,
      spokenLanguage: true,
    },
  },
  preferredUnitTypes: {
    select: {
      id: true,
      name: true,
      numBedrooms: true,
    },
  },
  listings: {
    select: {
      id: true,
      name: true,
      jurisdictions: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  },
  householdMember: {
    select: {
      id: true,
      orderId: true,
      firstName: true,
      middleName: true,
      lastName: true,
      birthMonth: true,
      birthDay: true,
      birthYear: true,
      sameAddress: true,
      relationship: true,
      workInRegion: true,
      householdMemberAddress: {
        select: {
          id: true,
          placeName: true,
          city: true,
          county: true,
          state: true,
          street: true,
          street2: true,
          zipCode: true,
          latitude: true,
          longitude: true,
        },
      },
      householdMemberWorkAddress: {
        select: {
          id: true,
          placeName: true,
          city: true,
          county: true,
          state: true,
          street: true,
          street2: true,
          zipCode: true,
          latitude: true,
          longitude: true,
        },
      },
    },
  },
};

describe('Testing application service', () => {
  let service: ApplicationService;
  let prisma: PrismaService;

  const canOrThrowMock = jest.fn();

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ApplicationService,
        PrismaService,
        GeocodingService,
        {
          provide: EmailService,
          useValue: {
            applicationConfirmation: jest.fn(),
          },
        },
        {
          provide: PermissionService,
          useValue: {
            canOrThrow: canOrThrowMock,
          },
        },
      ],
    }).compile();

    service = module.get<ApplicationService>(ApplicationService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should get applications from list() when applications are available', async () => {
    const requestingUser = {
      firstName: 'requesting fName',
      lastName: 'requesting lName',
      email: 'requestingUser@email.com',
      jurisdictions: [{ id: 'juris id' }],
    } as unknown as User;
    const date = new Date();
    const mockedValue = mockApplicationSet(3, date);
    prisma.jurisdictions.findFirst = jest
      .fn()
      .mockResolvedValue({ name: 'jurisdiction', id: 'jurisdictionID' });
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

    expect(
      await service.list(params, {
        user: requestingUser,
      } as unknown as ExpressRequest),
    ).toEqual({
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
          {
            deletedAt: null,
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
    const requestingUser = {
      firstName: 'requesting fName',
      lastName: 'requesting lName',
      email: 'requestingUser@email.com',
      jurisdictions: [{ id: 'juris id' }],
    } as unknown as User;
    const date = new Date();
    const mockedValue = mockApplication(3, date);
    prisma.jurisdictions.findFirst = jest
      .fn()
      .mockResolvedValue({ name: 'jurisdiction', id: 'jurisdictionID' });
    prisma.applications.findUnique = jest.fn().mockResolvedValue(mockedValue);

    expect(
      await service.findOne('example Id', {
        user: requestingUser,
      } as unknown as ExpressRequest),
    ).toEqual(mockedValue);

    expect(prisma.applications.findUnique).toHaveBeenCalledWith({
      where: {
        id: 'example Id',
      },
      include: {
        ...detailView,
      },
    });
  });

  it("should throw error when findOne() is called and Id doens't exists", async () => {
    const requestingUser = {
      firstName: 'requesting fName',
      lastName: 'requesting lName',
      email: 'requestingUser@email.com',
      jurisdictions: [{ id: 'juris id' }],
    } as unknown as User;
    prisma.applications.findUnique = jest.fn().mockResolvedValue(null);

    await expect(
      async () =>
        await service.findOne('example Id', {
          user: requestingUser,
        } as unknown as ExpressRequest),
    ).rejects.toThrowError(
      'applicationId example Id was requested but not found',
    );

    expect(prisma.applications.findUnique).toHaveBeenCalledWith({
      where: {
        id: 'example Id',
      },
      include: {
        ...detailView,
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
    expect(res).toEqual({
      AND: [
        {
          deletedAt: null,
        },
      ],
    });
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
        {
          deletedAt: null,
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
        {
          deletedAt: null,
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
        {
          deletedAt: null,
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
        {
          deletedAt: null,
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
        {
          deletedAt: null,
        },
      ],
    });
  });

  it('should return application with no view when one exists', async () => {
    prisma.applications.findUnique = jest
      .fn()
      .mockResolvedValue({ id: randomUUID() });

    await service.findOrThrow('example Id');
    expect(prisma.applications.findUnique).toHaveBeenCalledWith({
      where: {
        id: 'example Id',
      },
    });
  });

  it('should return application with base view when one exists', async () => {
    prisma.applications.findUnique = jest
      .fn()
      .mockResolvedValue({ id: randomUUID() });

    await service.findOrThrow('example Id', ApplicationViews.base);
    expect(prisma.applications.findUnique).toHaveBeenCalledWith({
      where: {
        id: 'example Id',
      },
      include: {
        ...baseView,
      },
    });
  });

  it("should throw error when asking for application that doesen't exist", async () => {
    prisma.applications.findUnique = jest.fn().mockResolvedValue(null);

    await expect(
      async () => await service.findOrThrow('example Id'),
    ).rejects.toThrowError(
      'applicationId example Id was requested but not found',
    );

    expect(prisma.applications.findUnique).toHaveBeenCalledWith({
      where: {
        id: 'example Id',
      },
    });
  });

  it('should update listing application edit timestamp', async () => {
    prisma.listings.update = jest.fn().mockResolvedValue({ id: randomUUID() });
    await service.updateListingApplicationEditTimestamp(randomUUID());

    expect(prisma.listings.update).toHaveBeenCalledWith({
      where: {
        id: expect.anything(),
      },
      data: {
        lastApplicationUpdateAt: expect.anything(),
      },
    });
  });

  it('should generate random confirmation code', () => {
    const res = service.generateConfirmationCode();
    expect(res.length).toEqual(8);
  });

  it('should delete application when one exists', async () => {
    prisma.applications.findUnique = jest
      .fn()
      .mockResolvedValue({ id: randomUUID(), listingId: randomUUID() });
    prisma.listings.update = jest.fn().mockResolvedValue({ id: randomUUID() });
    prisma.applications.update = jest
      .fn()
      .mockResolvedValue({ id: randomUUID() });

    prisma.jurisdictions.findFirst = jest
      .fn()
      .mockResolvedValue({ id: randomUUID() });

    await service.delete('example Id', {
      id: 'requestingUser id',
      userRoles: { isAdmin: true },
    } as unknown as User);

    expect(prisma.applications.findUnique).toHaveBeenCalledWith({
      where: {
        id: 'example Id',
      },
    });
    expect(prisma.listings.update).toHaveBeenCalledWith({
      where: {
        id: expect.anything(),
      },
      data: {
        lastApplicationUpdateAt: expect.anything(),
      },
    });
    expect(prisma.applications.update).toHaveBeenCalledWith({
      where: {
        id: 'example Id',
      },
      data: {
        deletedAt: expect.anything(),
      },
    });

    expect(canOrThrowMock).toHaveBeenCalledWith(
      {
        id: 'requestingUser id',
        userRoles: { isAdmin: true },
      } as unknown as User,
      'application',
      permissionActions.delete,
      expect.anything(),
    );
  });

  it("should throw error when trying to delete application that doesen't exist", async () => {
    prisma.applications.findUnique = jest.fn().mockResolvedValue(null);

    await expect(
      async () =>
        await service.delete('example Id', {
          id: 'requestingUser id',
          userRoles: { isAdmin: true },
        } as unknown as User),
    ).rejects.toThrowError(
      'applicationId example Id was requested but not found',
    );

    expect(prisma.applications.findUnique).toHaveBeenCalledWith({
      where: {
        id: 'example Id',
      },
    });

    expect(canOrThrowMock).not.toHaveBeenCalled();
  });

  it('should create an application from public site', async () => {
    prisma.listings.findUnique = jest.fn().mockResolvedValue({
      id: randomUUID(),
      applicationDueDate: dayjs(new Date()).add(5, 'days').toDate(),
      digitalApplication: true,
      commonDigitalApplication: true,
    });

    prisma.applications.create = jest.fn().mockResolvedValue({
      id: randomUUID(),
    });

    const exampleAddress = addressFactory() as AddressCreate;
    const dto = mockCreateApplicationData(exampleAddress, new Date());

    prisma.jurisdictions.findFirst = jest
      .fn()
      .mockResolvedValue({ id: randomUUID() });

    await service.create(dto, true, {
      id: 'requestingUser id',
      userRoles: { isAdmin: true },
    } as unknown as User);

    expect(prisma.listings.findUnique).toHaveBeenCalledWith({
      where: {
        id: expect.anything(),
      },
      include: {
        jurisdictions: true,
        listingsBuildingAddress: true,
        listingMultiselectQuestions: {
          include: {
            multiselectQuestions: true,
          },
        },
      },
    });

    expect(prisma.applications.create).toHaveBeenCalledWith({
      include: { ...detailView },
      data: {
        contactPreferences: ['example contact preference'],
        status: ApplicationStatusEnum.submitted,
        submissionType: ApplicationSubmissionTypeEnum.electronical,
        appUrl: 'http://www.example.com',
        additionalPhone: true,
        additionalPhoneNumber: '111-111-1111',
        additionalPhoneNumberType: 'example additional phone number type',
        householdSize: 2,
        housingStatus: 'example housing status',
        sendMailToMailingAddress: true,
        householdExpectingChanges: false,
        householdStudent: false,
        incomeVouchers: [],
        income: '36000',
        incomePeriod: IncomePeriodEnum.perYear,
        language: LanguagesEnum.en,
        acceptedTerms: true,
        // Submission date is the moment it was created
        submissionDate: expect.any(Date),
        reviewStatus: ApplicationReviewStatusEnum.valid,
        confirmationCode: expect.anything(),
        applicant: {
          create: {
            firstName: 'applicant first name',
            middleName: 'applicant middle name',
            lastName: 'applicant last name',
            birthMonth: 12,
            birthDay: 17,
            birthYear: 1993,
            emailAddress: 'example@email.com',
            noEmail: false,
            phoneNumber: '111-111-1111',
            phoneNumberType: 'Cell',
            noPhone: false,
            workInRegion: YesNoEnum.yes,
            applicantAddress: {
              create: {
                ...exampleAddress,
              },
            },
            applicantWorkAddress: {
              create: {
                ...exampleAddress,
              },
            },
          },
        },
        accessibility: {
          create: {
            mobility: false,
            vision: false,
            hearing: false,
          },
        },
        alternateContact: {
          create: {
            type: AlternateContactRelationship.other,
            otherType: 'example other type',
            firstName: 'example first name',
            lastName: 'example last name',
            agency: 'example agency',
            phoneNumber: '111-111-1111',
            emailAddress: 'example@email.com',
            address: {
              create: {
                ...exampleAddress,
              },
            },
          },
        },
        applicationsAlternateAddress: {
          create: {
            ...exampleAddress,
          },
        },
        applicationsMailingAddress: {
          create: {
            ...exampleAddress,
          },
        },
        listings: {
          connect: {
            id: dto.listings.id,
          },
        },
        demographics: {
          create: {
            gender: 'example gender',
            sexualOrientation: 'example sexual orientation',
            howDidYouHear: ['example how did you hear'],
            race: ['example race'],
            spokenLanguage: 'example language',
          },
        },
        preferredUnitTypes: {
          connect: [
            {
              id: expect.anything(),
            },
          ],
        },
        householdMember: {
          create: [
            {
              orderId: 0,
              firstName: 'example first name',
              middleName: 'example middle name',
              lastName: 'example last name',
              birthMonth: 12,
              birthDay: 17,
              birthYear: 1993,
              sameAddress: YesNoEnum.yes,
              relationship: HouseholdMemberRelationship.other,
              workInRegion: YesNoEnum.yes,
              householdMemberAddress: {
                create: {
                  ...exampleAddress,
                },
              },
              householdMemberWorkAddress: {
                create: {
                  ...exampleAddress,
                },
              },
            },
          ],
        },
        programs: [
          {
            key: 'example key',
            claimed: true,
            options: [
              {
                key: 'example key',
                checked: true,
                extraData: [
                  {
                    type: InputType.boolean,
                    key: 'example key',
                    value: true,
                  },
                ],
              },
            ],
          },
        ],
        preferences: [
          {
            key: 'example key',
            claimed: true,
            options: [
              {
                key: 'example key',
                checked: true,
                extraData: [
                  {
                    type: InputType.boolean,
                    key: 'example key',
                    value: true,
                  },
                ],
              },
            ],
          },
        ],
        userAccounts: {
          connect: {
            id: 'requestingUser id',
          },
        },
      },
    });

    expect(canOrThrowMock).not.toHaveBeenCalled();
  });

  it('should error while creating an application from public site because submissions are closed', async () => {
    prisma.listings.findUnique = jest.fn().mockResolvedValue({
      id: randomUUID(),
      applicationDueDate: new Date(0),
      digitalApplication: true,
      commonDigitalApplication: true,
    });

    prisma.applications.create = jest.fn().mockResolvedValue({
      id: randomUUID(),
    });

    const exampleAddress = addressFactory() as AddressCreate;
    const dto = mockCreateApplicationData(exampleAddress, new Date());

    prisma.jurisdictions.findFirst = jest
      .fn()
      .mockResolvedValue({ id: randomUUID() });

    await expect(
      async () =>
        await service.create(dto, true, {
          id: 'requestingUser id',
          userRoles: { isAdmin: true },
        } as unknown as User),
    ).rejects.toThrowError('Listing is not open for application submission');

    expect(prisma.listings.findUnique).toHaveBeenCalledWith({
      where: {
        id: expect.anything(),
      },
      include: {
        jurisdictions: true,
        listingsBuildingAddress: true,
        listingMultiselectQuestions: {
          include: {
            multiselectQuestions: true,
          },
        },
      },
    });

    expect(prisma.applications.create).not.toHaveBeenCalled();

    expect(canOrThrowMock).not.toHaveBeenCalled();
  });

  it('should error while creating an application from public site on a listing without common app', async () => {
    prisma.listings.findUnique = jest.fn().mockResolvedValue({
      id: randomUUID(),
      applicationDueDate: new Date(0),
      digitalApplication: false,
      commonDigitalApplication: false,
    });

    prisma.applications.create = jest.fn().mockResolvedValue({
      id: randomUUID(),
    });

    const exampleAddress = addressFactory() as AddressCreate;
    const dto = mockCreateApplicationData(exampleAddress, new Date());

    prisma.jurisdictions.findFirst = jest
      .fn()
      .mockResolvedValue({ id: randomUUID() });

    await expect(
      async () =>
        await service.create(dto, true, {
          id: 'requestingUser id',
          userRoles: { isAdmin: true },
        } as unknown as User),
    ).rejects.toThrowError('Listing is not open for application submission');

    expect(prisma.listings.findUnique).toHaveBeenCalledWith({
      where: {
        id: expect.anything(),
      },
      include: {
        jurisdictions: true,
        listingsBuildingAddress: true,
        listingMultiselectQuestions: {
          include: {
            multiselectQuestions: true,
          },
        },
      },
    });

    expect(prisma.applications.create).not.toHaveBeenCalled();

    expect(canOrThrowMock).not.toHaveBeenCalled();
  });

  it('should error while creating an application as a non-admin user for a closed listing', async () => {
    prisma.listings.findUnique = jest.fn().mockResolvedValue({
      id: randomUUID(),
      status: 'closed',
      digitalApplication: true,
      commonDigitalApplication: true,
    });

    prisma.applications.create = jest.fn().mockResolvedValue({
      id: randomUUID(),
    });

    const exampleAddress = addressFactory() as AddressCreate;
    const dto = mockCreateApplicationData(exampleAddress, new Date());

    prisma.jurisdictions.findFirst = jest
      .fn()
      .mockResolvedValue({ id: randomUUID() });

    await expect(
      async () =>
        await service.create(dto, true, {
          id: 'requestingUser id',
          userRoles: { isAdmin: false },
        } as unknown as User),
    ).rejects.toThrowError(
      'Non-administrators cannot submit applications to closed listings',
    );

    expect(prisma.listings.findUnique).toHaveBeenCalledWith({
      where: {
        id: expect.anything(),
      },
      include: {
        jurisdictions: true,
        listingsBuildingAddress: true,
        listingMultiselectQuestions: {
          include: {
            multiselectQuestions: true,
          },
        },
      },
    });

    expect(prisma.applications.create).not.toHaveBeenCalled();

    expect(canOrThrowMock).not.toHaveBeenCalled();
  });

  it('should create an application from partner site', async () => {
    prisma.listings.findUnique = jest.fn().mockResolvedValue({
      id: randomUUID(),
    });

    prisma.applications.create = jest.fn().mockResolvedValue({
      id: randomUUID(),
    });

    prisma.jurisdictions.findFirst = jest
      .fn()
      .mockResolvedValue({ id: randomUUID() });

    const exampleAddress = addressFactory() as AddressCreate;
    const dto = mockCreateApplicationData(exampleAddress, new Date());
    dto.receivedAt = new Date();
    dto.receivedBy = 'example received by';

    await service.create(dto, false, {
      id: 'requestingUser id',
      userRoles: { isAdmin: true },
    } as unknown as User);

    expect(prisma.listings.findUnique).toHaveBeenCalledWith({
      where: {
        id: expect.anything(),
      },
      include: {
        jurisdictions: true,
        listingsBuildingAddress: true,
        listingMultiselectQuestions: {
          include: {
            multiselectQuestions: true,
          },
        },
      },
    });

    expect(prisma.applications.create).toHaveBeenCalledWith({
      include: {
        ...detailView,
      },
      data: {
        contactPreferences: ['example contact preference'],
        status: ApplicationStatusEnum.submitted,
        submissionType: ApplicationSubmissionTypeEnum.electronical,
        appUrl: 'http://www.example.com',
        additionalPhone: true,
        additionalPhoneNumber: '111-111-1111',
        additionalPhoneNumberType: 'example additional phone number type',
        householdSize: 2,
        housingStatus: 'example housing status',
        sendMailToMailingAddress: true,
        householdExpectingChanges: false,
        householdStudent: false,
        incomeVouchers: [],
        income: '36000',
        incomePeriod: IncomePeriodEnum.perYear,
        language: LanguagesEnum.en,
        acceptedTerms: true,
        submissionDate: expect.anything(),
        receivedAt: expect.anything(),
        receivedBy: 'example received by',
        reviewStatus: ApplicationReviewStatusEnum.valid,
        confirmationCode: expect.anything(),
        applicant: {
          create: {
            firstName: 'applicant first name',
            middleName: 'applicant middle name',
            lastName: 'applicant last name',
            birthMonth: 12,
            birthDay: 17,
            birthYear: 1993,
            emailAddress: 'example@email.com',
            noEmail: false,
            phoneNumber: '111-111-1111',
            phoneNumberType: 'Cell',
            noPhone: false,
            workInRegion: YesNoEnum.yes,
            applicantAddress: {
              create: {
                ...exampleAddress,
              },
            },
            applicantWorkAddress: {
              create: {
                ...exampleAddress,
              },
            },
          },
        },
        accessibility: {
          create: {
            mobility: false,
            vision: false,
            hearing: false,
          },
        },
        alternateContact: {
          create: {
            type: AlternateContactRelationship.other,
            otherType: 'example other type',
            firstName: 'example first name',
            lastName: 'example last name',
            agency: 'example agency',
            phoneNumber: '111-111-1111',
            emailAddress: 'example@email.com',
            address: {
              create: {
                ...exampleAddress,
              },
            },
          },
        },
        applicationsAlternateAddress: {
          create: {
            ...exampleAddress,
          },
        },
        applicationsMailingAddress: {
          create: {
            ...exampleAddress,
          },
        },
        listings: {
          connect: {
            id: dto.listings.id,
          },
        },
        demographics: {
          create: {
            gender: 'example gender',
            sexualOrientation: 'example sexual orientation',
            howDidYouHear: ['example how did you hear'],
            race: ['example race'],
            spokenLanguage: 'example language',
          },
        },
        preferredUnitTypes: {
          connect: [
            {
              id: expect.anything(),
            },
          ],
        },
        householdMember: {
          create: [
            {
              orderId: 0,
              firstName: 'example first name',
              middleName: 'example middle name',
              lastName: 'example last name',
              birthMonth: 12,
              birthDay: 17,
              birthYear: 1993,
              sameAddress: YesNoEnum.yes,
              relationship: HouseholdMemberRelationship.other,
              workInRegion: YesNoEnum.yes,
              householdMemberAddress: {
                create: {
                  ...exampleAddress,
                },
              },
              householdMemberWorkAddress: {
                create: {
                  ...exampleAddress,
                },
              },
            },
          ],
        },
        programs: [
          {
            key: 'example key',
            claimed: true,
            options: [
              {
                key: 'example key',
                checked: true,
                extraData: [
                  {
                    type: InputType.boolean,
                    key: 'example key',
                    value: true,
                  },
                ],
              },
            ],
          },
        ],
        preferences: [
          {
            key: 'example key',
            claimed: true,
            options: [
              {
                key: 'example key',
                checked: true,
                extraData: [
                  {
                    type: InputType.boolean,
                    key: 'example key',
                    value: true,
                  },
                ],
              },
            ],
          },
        ],
        userAccounts: {
          connect: {
            id: 'requestingUser id',
          },
        },
      },
    });

    expect(canOrThrowMock).toHaveBeenCalledWith(
      {
        id: 'requestingUser id',
        userRoles: { isAdmin: true },
      } as unknown as User,
      'application',
      permissionActions.create,
      {
        listingId: dto.listings.id,
        jurisdictionId: expect.anything(),
      },
    );
  });

  it('should update an application when one exists', async () => {
    prisma.applications.findUnique = jest
      .fn()
      .mockResolvedValue({ id: randomUUID() });

    prisma.listings.update = jest.fn().mockResolvedValue({
      id: randomUUID(),
    });

    prisma.applications.update = jest.fn().mockResolvedValue({
      id: randomUUID(),
      listingId: randomUUID(),
    });

    prisma.householdMember.deleteMany = jest.fn().mockResolvedValue(null);
    prisma.listings.findFirst = jest.fn().mockResolvedValue(null);

    const exampleAddress = addressFactory() as AddressCreate;
    const submissionDate = new Date();

    const dto: ApplicationUpdate = {
      ...mockCreateApplicationData(exampleAddress, submissionDate),
      id: randomUUID(),
    };

    prisma.jurisdictions.findFirst = jest
      .fn()
      .mockResolvedValue({ id: randomUUID() });

    await service.update(dto, {
      id: 'requestingUser id',
      userRoles: { isAdmin: true },
    } as unknown as User);

    expect(prisma.applications.findUnique).toHaveBeenCalledWith({
      where: {
        id: expect.anything(),
      },
    });

    expect(prisma.applications.update).toHaveBeenCalledWith({
      include: {
        ...detailView,
      },
      data: {
        contactPreferences: ['example contact preference'],
        status: ApplicationStatusEnum.submitted,
        submissionType: ApplicationSubmissionTypeEnum.electronical,
        appUrl: 'http://www.example.com',
        additionalPhone: true,
        additionalPhoneNumber: '111-111-1111',
        additionalPhoneNumberType: 'example additional phone number type',
        householdSize: 2,
        housingStatus: 'example housing status',
        sendMailToMailingAddress: true,
        householdExpectingChanges: false,
        householdStudent: false,
        incomeVouchers: [],
        income: '36000',
        incomePeriod: IncomePeriodEnum.perYear,
        language: LanguagesEnum.en,
        acceptedTerms: true,
        submissionDate: submissionDate,
        reviewStatus: ApplicationReviewStatusEnum.valid,
        applicant: {
          create: {
            firstName: 'applicant first name',
            middleName: 'applicant middle name',
            lastName: 'applicant last name',
            birthMonth: 12,
            birthDay: 17,
            birthYear: 1993,
            emailAddress: 'example@email.com',
            noEmail: false,
            phoneNumber: '111-111-1111',
            phoneNumberType: 'Cell',
            noPhone: false,
            workInRegion: YesNoEnum.yes,
            applicantAddress: {
              create: {
                ...exampleAddress,
              },
            },
            applicantWorkAddress: {
              create: {
                ...exampleAddress,
              },
            },
          },
        },
        accessibility: {
          create: {
            mobility: false,
            vision: false,
            hearing: false,
          },
        },
        alternateContact: {
          create: {
            type: AlternateContactRelationship.other,
            otherType: 'example other type',
            firstName: 'example first name',
            lastName: 'example last name',
            agency: 'example agency',
            phoneNumber: '111-111-1111',
            emailAddress: 'example@email.com',
            address: {
              create: {
                ...exampleAddress,
              },
            },
          },
        },
        applicationsAlternateAddress: {
          create: {
            ...exampleAddress,
          },
        },
        applicationsMailingAddress: {
          create: {
            ...exampleAddress,
          },
        },
        listings: {
          connect: {
            id: dto.listings.id,
          },
        },
        demographics: {
          create: {
            gender: 'example gender',
            sexualOrientation: 'example sexual orientation',
            howDidYouHear: ['example how did you hear'],
            race: ['example race'],
            spokenLanguage: 'example language',
          },
        },
        preferredUnitTypes: {
          connect: [
            {
              id: expect.anything(),
            },
          ],
        },
        householdMember: {
          create: [
            {
              orderId: 0,
              firstName: 'example first name',
              middleName: 'example middle name',
              lastName: 'example last name',
              birthMonth: 12,
              birthDay: 17,
              birthYear: 1993,
              sameAddress: YesNoEnum.yes,
              relationship: HouseholdMemberRelationship.other,
              workInRegion: YesNoEnum.yes,
              householdMemberAddress: {
                create: {
                  ...exampleAddress,
                },
              },
              householdMemberWorkAddress: {
                create: {
                  ...exampleAddress,
                },
              },
            },
          ],
        },
        programs: [
          {
            key: 'example key',
            claimed: true,
            options: [
              {
                key: 'example key',
                checked: true,
                extraData: [
                  {
                    type: InputType.boolean,
                    key: 'example key',
                    value: true,
                  },
                ],
              },
            ],
          },
        ],
        preferences: [
          {
            key: 'example key',
            claimed: true,
            options: [
              {
                key: 'example key',
                checked: true,
                extraData: [
                  {
                    type: InputType.boolean,
                    key: 'example key',
                    value: true,
                  },
                ],
              },
            ],
          },
        ],
      },
      where: {
        id: expect.anything(),
      },
    });

    expect(prisma.listings.update).toHaveBeenCalledWith({
      where: {
        id: expect.anything(),
      },
      data: {
        lastApplicationUpdateAt: expect.anything(),
      },
    });

    expect(canOrThrowMock).toHaveBeenCalledWith(
      {
        id: 'requestingUser id',
        userRoles: { isAdmin: true },
      } as unknown as User,
      'application',
      permissionActions.update,
      expect.anything(),
    );
  });

  it("should error trying to update an application when one doesn't exists", async () => {
    prisma.applications.findUnique = jest.fn().mockResolvedValue(null);

    prisma.listings.update = jest.fn().mockResolvedValue({
      id: randomUUID(),
    });

    prisma.applications.update = jest.fn().mockResolvedValue({
      id: randomUUID(),
      listingId: randomUUID(),
    });

    const exampleAddress = addressFactory() as AddressCreate;
    const submissionDate = new Date();

    const dto: ApplicationUpdate = {
      ...mockCreateApplicationData(exampleAddress, submissionDate),
      id: randomUUID(),
    };

    prisma.jurisdictions.findFirst = jest
      .fn()
      .mockResolvedValue({ id: randomUUID() });

    await expect(
      async () =>
        await service.update(dto, {
          id: 'requestingUser id',
          userRoles: { isAdmin: true },
        } as unknown as User),
    ).rejects.toThrowError(expect.anything());

    expect(prisma.applications.findUnique).toHaveBeenCalledWith({
      where: {
        id: expect.anything(),
      },
    });

    expect(prisma.applications.update).not.toHaveBeenCalled();

    expect(prisma.listings.update).not.toHaveBeenCalled();

    expect(canOrThrowMock).not.toHaveBeenCalled();
  });

  it('should get most recent application for a user', async () => {
    const requestingUser = {
      firstName: 'requesting fName',
      lastName: 'requesting lName',
      email: 'requestingUser@email.com',
      jurisdictions: [{ id: 'juris id' }],
    } as unknown as User;
    const date = new Date();
    const mockedValue = mockApplication(3, date);
    prisma.applications.findUnique = jest.fn().mockResolvedValue(mockedValue);
    prisma.applications.findFirst = jest
      .fn()
      .mockResolvedValue({ id: mockedValue.id });

    expect(
      await service.mostRecentlyCreated({ userId: 'example Id' }, {
        user: requestingUser,
      } as unknown as ExpressRequest),
    ).toEqual(mockedValue);
    expect(prisma.applications.findFirst).toHaveBeenCalledWith({
      select: {
        id: true,
      },
      orderBy: { createdAt: 'desc' },
      where: {
        userId: 'example Id',
      },
    });
    expect(prisma.applications.findUnique).toHaveBeenCalledWith({
      where: {
        id: mockedValue.id,
      },
      include: {
        applicant: {
          select: {
            id: true,
            firstName: true,
            middleName: true,
            lastName: true,
            birthMonth: true,
            birthDay: true,
            birthYear: true,
            emailAddress: true,
            noEmail: true,
            phoneNumber: true,
            phoneNumberType: true,
            noPhone: true,
            workInRegion: true,
            applicantAddress: {
              select: {
                id: true,
                placeName: true,
                city: true,
                county: true,
                state: true,
                street: true,
                street2: true,
                zipCode: true,
                latitude: true,
                longitude: true,
              },
            },
            applicantWorkAddress: {
              select: {
                id: true,
                placeName: true,
                city: true,
                county: true,
                state: true,
                street: true,
                street2: true,
                zipCode: true,
                latitude: true,
                longitude: true,
              },
            },
          },
        },
        accessibility: {
          select: {
            id: true,
            mobility: true,
            vision: true,
            hearing: true,
          },
        },
        applicationsMailingAddress: {
          select: {
            id: true,
            placeName: true,
            city: true,
            county: true,
            state: true,
            street: true,
            street2: true,
            zipCode: true,
            latitude: true,
            longitude: true,
          },
        },
        applicationsAlternateAddress: {
          select: {
            id: true,
            placeName: true,
            city: true,
            county: true,
            state: true,
            street: true,
            street2: true,
            zipCode: true,
            latitude: true,
            longitude: true,
          },
        },
        alternateContact: {
          select: {
            id: true,
            type: true,
            otherType: true,
            firstName: true,
            lastName: true,
            agency: true,
            phoneNumber: true,
            emailAddress: true,
            address: {
              select: {
                id: true,
                placeName: true,
                city: true,
                county: true,
                state: true,
                street: true,
                street2: true,
                zipCode: true,
                latitude: true,
                longitude: true,
              },
            },
          },
        },
        demographics: {
          select: {
            id: true,
            createdAt: true,
            updatedAt: true,
            ethnicity: true,
            gender: true,
            sexualOrientation: true,
            howDidYouHear: true,
            race: true,
            spokenLanguage: true,
          },
        },
        preferredUnitTypes: {
          select: {
            id: true,
            name: true,
            numBedrooms: true,
          },
        },
        listings: {
          select: {
            id: true,
            name: true,
            jurisdictions: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        householdMember: {
          select: {
            id: true,
            orderId: true,
            firstName: true,
            middleName: true,
            lastName: true,
            birthMonth: true,
            birthDay: true,
            birthYear: true,
            sameAddress: true,
            relationship: true,
            workInRegion: true,
            householdMemberAddress: {
              select: {
                id: true,
                placeName: true,
                city: true,
                county: true,
                state: true,
                street: true,
                street2: true,
                zipCode: true,
                latitude: true,
                longitude: true,
              },
            },
            householdMemberWorkAddress: {
              select: {
                id: true,
                placeName: true,
                city: true,
                county: true,
                state: true,
                street: true,
                street2: true,
                zipCode: true,
                latitude: true,
                longitude: true,
              },
            },
          },
        },
        userAccounts: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });
  });
});
