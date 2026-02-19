import { AppModule } from '../../src/modules/app.module';
import { IdDTO } from '../../src/dtos/shared/id.dto';
import { INestApplication } from '@nestjs/common';
import { LanguagesEnum } from '@prisma/client';
import { Login } from '../../src/dtos/auth/login.dto';
import { PrismaService } from '../../src/services/prisma.service';
import { randomUUID } from 'crypto';
import { Test, TestingModule } from '@nestjs/testing';
import { userFactory } from '../../prisma/seed-helpers/user-factory';
import cookieParser from 'cookie-parser';
import request from 'supertest';

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
});
