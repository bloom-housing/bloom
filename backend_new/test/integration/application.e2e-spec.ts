import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import {
  ApplicationReviewStatusEnum,
  ApplicationStatusEnum,
  ApplicationSubmissionTypeEnum,
  IncomePeriodEnum,
  LanguagesEnum,
  UnitTypeEnum,
  YesNoEnum,
} from '@prisma/client';
import { randomUUID } from 'crypto';
import { stringify } from 'qs';
import request from 'supertest';
import { AppModule } from '../../src/modules/app.module';
import { PrismaService } from '../../src/services/prisma.service';
import { applicationFactory } from '../../prisma/seed-helpers/application-factory';
import {
  unitTypeFactoryAll,
  unitTypeFactorySingle,
} from '../../prisma/seed-helpers/unit-type-factory';
import { ApplicationQueryParams } from '../../src/dtos/applications/application-query-params.dto';
import { OrderByEnum } from '../../src/enums/shared/order-by-enum';
import { ApplicationOrderByKeys } from '../../src/enums/applications/order-by-enum';
import { listingFactory } from '../../prisma/seed-helpers/listing-factory';
import { jurisdictionFactory } from '../../prisma/seed-helpers/jurisdiction-factory';
import { ApplicationCreate } from '../../src/dtos/applications/application-create.dto';
import { InputType } from '../../src/enums/shared/input-type-enum';
import { addressFactory } from '../../prisma/seed-helpers/address-factory';
import { AddressCreate } from '../../src/dtos/addresses/address-create.dto';
import { ApplicationUpdate } from '../../src/dtos/applications/application-update.dto';

describe('Application Controller Tests', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    prisma = moduleFixture.get<PrismaService>(PrismaService);
    await app.init();
    await unitTypeFactoryAll(prisma);
  });

  afterAll(async () => {
    await prisma.$disconnect();
    await app.close();
  });

  it('should get no applications when params are sent, and no applications are stored', async () => {
    const queryParams: ApplicationQueryParams = {
      limit: 2,
      page: 1,
      order: OrderByEnum.ASC,
      orderBy: ApplicationOrderByKeys.createdAt,
      listingId: randomUUID(),
    };
    const query = stringify(queryParams as any);

    const res = await request(app.getHttpServer())
      .get(`/applications?${query}`)
      .expect(200);
    expect(res.body.items.length).toBe(0);
  });

  // without clearing the db between tests or test suites this is flakes because of other e2e tests
  it.skip('should get no applications when no params are sent, and no applications are stored', async () => {
    const res = await request(app.getHttpServer())
      .get(`/applications`)
      .expect(200);

    expect(res.body.items.length).toBe(0);
  });

  it('should get stored applications when params are sent', async () => {
    const unitTypeA = await unitTypeFactorySingle(prisma, UnitTypeEnum.oneBdrm);

    const applicationA = await prisma.applications.create({
      data: applicationFactory({ unitTypeId: unitTypeA.id }),
      include: {
        applicant: true,
      },
    });
    const applicationB = await prisma.applications.create({
      data: applicationFactory({ unitTypeId: unitTypeA.id }),
      include: {
        applicant: true,
      },
    });

    const queryParams: ApplicationQueryParams = {
      limit: 2,
      page: 1,
      order: OrderByEnum.ASC,
      orderBy: ApplicationOrderByKeys.createdAt,
    };
    const query = stringify(queryParams as any);

    const res = await request(app.getHttpServer())
      .get(`/applications?${query}`)
      .expect(200);

    expect(res.body.items.length).toBeGreaterThanOrEqual(2);
    const resApplicationA = res.body.items.find(
      (item) => item.applicant.firstName === applicationA.applicant.firstName,
    );
    expect(resApplicationA).not.toBeNull();
    res.body.items.find(
      (item) => item.applicant.firstName === applicationB.applicant.firstName,
    );
    expect(resApplicationA).not.toBeNull();
  });

  it('should get stored applications when no params sent', async () => {
    const unitTypeA = await unitTypeFactorySingle(prisma, UnitTypeEnum.oneBdrm);

    const applicationA = await prisma.applications.create({
      data: applicationFactory({ unitTypeId: unitTypeA.id }),
      include: {
        applicant: true,
      },
    });
    const applicationB = await prisma.applications.create({
      data: applicationFactory({ unitTypeId: unitTypeA.id }),
      include: {
        applicant: true,
      },
    });

    const res = await request(app.getHttpServer())
      .get(`/applications`)
      .expect(200);

    expect(res.body.items.length).toBeGreaterThanOrEqual(2);
    const resApplicationA = res.body.items.find(
      (item) => item.applicant.firstName === applicationA.applicant.firstName,
    );
    expect(resApplicationA).not.toBeNull();
    res.body.items.find(
      (item) => item.applicant.firstName === applicationB.applicant.firstName,
    );
    expect(resApplicationA).not.toBeNull();
  });

  it('should retrieve an application when one exists', async () => {
    const unitTypeA = await unitTypeFactorySingle(prisma, UnitTypeEnum.oneBdrm);

    const applicationA = await prisma.applications.create({
      data: applicationFactory({ unitTypeId: unitTypeA.id }),
      include: {
        applicant: true,
      },
    });

    const res = await request(app.getHttpServer())
      .get(`/applications/${applicationA.id}`)
      .expect(200);

    expect(res.body.applicant.firstName).toEqual(
      applicationA.applicant.firstName,
    );
  });

  it("should throw an error when retrieve is called with an Id that doesn't exist", async () => {
    const id = randomUUID();

    const res = await request(app.getHttpServer())
      .get(`/applications/${id}`)
      .expect(404);

    expect(res.body.message).toEqual(
      `applicationId ${id} was requested but not found`,
    );
  });

  it('should delete an application when one exists', async () => {
    const unitTypeA = await unitTypeFactorySingle(prisma, UnitTypeEnum.oneBdrm);
    const jurisdiction = await prisma.jurisdictions.create({
      data: jurisdictionFactory(),
    });
    const listing1 = await listingFactory(jurisdiction.id, prisma);
    const listing1Created = await prisma.listings.create({
      data: listing1,
    });
    const applicationA = await prisma.applications.create({
      data: applicationFactory({
        unitTypeId: unitTypeA.id,
        listingId: listing1Created.id,
      }),
      include: {
        applicant: true,
      },
    });

    const res = await request(app.getHttpServer())
      .delete(`/applications/`)
      .send({
        id: applicationA.id,
      })
      .expect(200);

    expect(res.body.success).toEqual(true);

    const applicationAfterDelete = await prisma.applications.findUnique({
      where: {
        id: applicationA.id,
      },
    });

    expect(applicationAfterDelete.deletedAt).not.toBeNull();
  });

  it("should throw an error when delete is called with an Id that doesn't exist", async () => {
    const id = randomUUID();

    const res = await request(app.getHttpServer())
      .delete(`/applications/`)
      .send({
        id,
      })
      .expect(404);

    expect(res.body.message).toEqual(
      `applicationId ${id} was requested but not found`,
    );
  });

  it('should create application from public site', async () => {
    const unitTypeA = await unitTypeFactorySingle(prisma, UnitTypeEnum.oneBdrm);
    const jurisdiction = await prisma.jurisdictions.create({
      data: jurisdictionFactory(),
    });
    const listing1 = await listingFactory(jurisdiction.id, prisma);
    const listing1Created = await prisma.listings.create({
      data: listing1,
    });

    const submissionDate = new Date();
    const exampleAddress = addressFactory() as AddressCreate;
    const dto: ApplicationCreate = {
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
        type: 'example type',
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
        id: listing1Created.id,
      },
      demographics: {
        ethnicity: 'example ethnicity',
        gender: 'example gender',
        sexualOrientation: 'example sexual orientation',
        howDidYouHear: ['example how did you hear'],
        race: ['example race'],
      },
      preferredUnitTypes: [
        {
          id: unitTypeA.id,
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
          relationship: 'example relationship',
          workInRegion: YesNoEnum.yes,
          householdMemberWorkAddress: exampleAddress,
          householdMemberAddress: exampleAddress,
        },
      ],
      appUrl: 'http://www.example.com',
      additionalPhone: true,
      additionalPhoneNumber: '111-111-1111',
      additionalPhoneNumberType: 'example type',
      householdSize: 2,
      housingStatus: 'example status',
      sendMailToMailingAddress: true,
      householdExpectingChanges: false,
      householdStudent: false,
      incomeVouchers: false,
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
    };
    const res = await request(app.getHttpServer())
      .post(`/applications/submit`)
      .send(dto)
      .expect(201);

    expect(res.body.id).not.toBeNull();
  });

  it('should create application from partner site', async () => {
    const unitTypeA = await unitTypeFactorySingle(prisma, UnitTypeEnum.oneBdrm);
    const jurisdiction = await prisma.jurisdictions.create({
      data: jurisdictionFactory(),
    });
    const listing1 = await listingFactory(jurisdiction.id, prisma);
    const listing1Created = await prisma.listings.create({
      data: listing1,
    });

    const submissionDate = new Date();
    const exampleAddress = addressFactory() as AddressCreate;
    const dto: ApplicationCreate = {
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
        type: 'example type',
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
        id: listing1Created.id,
      },
      demographics: {
        ethnicity: 'example ethnicity',
        gender: 'example gender',
        sexualOrientation: 'example sexual orientation',
        howDidYouHear: ['example how did you hear'],
        race: ['example race'],
      },
      preferredUnitTypes: [
        {
          id: unitTypeA.id,
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
          relationship: 'example relationship',
          workInRegion: YesNoEnum.yes,
          householdMemberWorkAddress: exampleAddress,
          householdMemberAddress: exampleAddress,
        },
      ],
      appUrl: 'http://www.example.com',
      additionalPhone: true,
      additionalPhoneNumber: '111-111-1111',
      additionalPhoneNumberType: 'example type',
      householdSize: 2,
      housingStatus: 'example status',
      sendMailToMailingAddress: true,
      householdExpectingChanges: false,
      householdStudent: false,
      incomeVouchers: false,
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
    };
    const res = await request(app.getHttpServer())
      .post(`/applications/`)
      .send(dto)
      .expect(201);

    expect(res.body.id).not.toBeNull();
  });

  it('should update an application when one exists', async () => {
    const unitTypeA = await unitTypeFactorySingle(prisma, UnitTypeEnum.oneBdrm);
    const jurisdiction = await prisma.jurisdictions.create({
      data: jurisdictionFactory(),
    });
    const listing1 = await listingFactory(jurisdiction.id, prisma);
    const listing1Created = await prisma.listings.create({
      data: listing1,
    });

    const applicationA = await prisma.applications.create({
      data: applicationFactory({ unitTypeId: unitTypeA.id }),
      include: {
        applicant: true,
      },
    });

    const submissionDate = new Date();
    const exampleAddress = addressFactory() as AddressCreate;
    const dto: ApplicationUpdate = {
      id: applicationA.id,
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
        type: 'example type',
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
        id: listing1Created.id,
      },
      demographics: {
        ethnicity: 'example ethnicity',
        gender: 'example gender',
        sexualOrientation: 'example sexual orientation',
        howDidYouHear: ['example how did you hear'],
        race: ['example race'],
      },
      preferredUnitTypes: [
        {
          id: unitTypeA.id,
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
          relationship: 'example relationship',
          workInRegion: YesNoEnum.yes,
          householdMemberWorkAddress: exampleAddress,
          householdMemberAddress: exampleAddress,
        },
      ],
      appUrl: 'http://www.example.com',
      additionalPhone: true,
      additionalPhoneNumber: '111-111-1111',
      additionalPhoneNumberType: 'example type',
      householdSize: 2,
      housingStatus: 'example status',
      sendMailToMailingAddress: true,
      householdExpectingChanges: false,
      householdStudent: false,
      incomeVouchers: false,
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
    };

    const res = await request(app.getHttpServer())
      .put(`/applications/${applicationA.id}`)
      .send(dto)
      .expect(200);

    expect(res.body.applicant.firstName).toEqual(dto.applicant.firstName);
    expect(res.body.id).toEqual(dto.id);
  });

  it("should throw an error when update is called with an Id that doesn't exist", async () => {
    const id = randomUUID();
    const unitTypeA = await unitTypeFactorySingle(prisma, UnitTypeEnum.oneBdrm);
    const jurisdiction = await prisma.jurisdictions.create({
      data: jurisdictionFactory(),
    });
    const listing1 = await listingFactory(jurisdiction.id, prisma);
    const listing1Created = await prisma.listings.create({
      data: listing1,
    });

    const submissionDate = new Date();
    const exampleAddress = addressFactory() as AddressCreate;
    const dto: ApplicationUpdate = {
      id,
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
        type: 'example type',
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
        id: listing1Created.id,
      },
      demographics: {
        ethnicity: 'example ethnicity',
        gender: 'example gender',
        sexualOrientation: 'example sexual orientation',
        howDidYouHear: ['example how did you hear'],
        race: ['example race'],
      },
      preferredUnitTypes: [
        {
          id: unitTypeA.id,
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
          relationship: 'example relationship',
          workInRegion: YesNoEnum.yes,
          householdMemberWorkAddress: exampleAddress,
          householdMemberAddress: exampleAddress,
        },
      ],
      appUrl: 'http://www.example.com',
      additionalPhone: true,
      additionalPhoneNumber: '111-111-1111',
      additionalPhoneNumberType: 'example type',
      householdSize: 2,
      housingStatus: 'example status',
      sendMailToMailingAddress: true,
      householdExpectingChanges: false,
      householdStudent: false,
      incomeVouchers: false,
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
    };

    const res = await request(app.getHttpServer())
      .put(`/applications/${id}`)
      .send(dto)
      .expect(404);

    expect(res.body.message).toEqual(
      `applicationId ${id} was requested but not found`,
    );
  });

  it('should verify an application', async () => {
    const unitTypeA = await unitTypeFactorySingle(prisma, UnitTypeEnum.oneBdrm);
    const jurisdiction = await prisma.jurisdictions.create({
      data: jurisdictionFactory(),
    });
    const listing1 = await listingFactory(jurisdiction.id, prisma);
    const listing1Created = await prisma.listings.create({
      data: listing1,
    });

    const submissionDate = new Date();
    const exampleAddress = addressFactory() as AddressCreate;
    const dto: ApplicationCreate = {
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
        type: 'example type',
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
        id: listing1Created.id,
      },
      demographics: {
        ethnicity: 'example ethnicity',
        gender: 'example gender',
        sexualOrientation: 'example sexual orientation',
        howDidYouHear: ['example how did you hear'],
        race: ['example race'],
      },
      preferredUnitTypes: [
        {
          id: unitTypeA.id,
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
          relationship: 'example relationship',
          workInRegion: YesNoEnum.yes,
          householdMemberWorkAddress: exampleAddress,
          householdMemberAddress: exampleAddress,
        },
      ],
      appUrl: 'http://www.example.com',
      additionalPhone: true,
      additionalPhoneNumber: '111-111-1111',
      additionalPhoneNumberType: 'example type',
      householdSize: 2,
      housingStatus: 'example status',
      sendMailToMailingAddress: true,
      householdExpectingChanges: false,
      householdStudent: false,
      incomeVouchers: false,
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
    };

    const res = await request(app.getHttpServer())
      .post(`/applications/verify`)
      .send(dto)
      .expect(201);

    expect(res.body.success).toEqual(true);
  });

  it('should throw an error when trying to verify an incomplete application', async () => {
    const dto: ApplicationCreate = {} as unknown as ApplicationCreate;

    const res = await request(app.getHttpServer())
      .post(`/applications/verify`)
      .send(dto)
      .expect(400);

    expect(res.body.error).toEqual('Bad Request');
    expect(res.body.message).toEqual([
      'preferences should not be null or undefined',
    ]);
  });
});
