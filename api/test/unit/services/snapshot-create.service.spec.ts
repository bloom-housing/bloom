import { LanguagesEnum } from '@prisma/client';
import { PrismaService } from '../../../src/services/prisma.service';
import { randomUUID } from 'crypto';
import { SnapshotCreateService } from '../../../src/services/snapshot-create.service';
import { Test, TestingModule } from '@nestjs/testing';

describe('Testing snapshot create service', () => {
  let service: SnapshotCreateService;
  let prisma: PrismaService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      providers: [PrismaService, SnapshotCreateService],
    }).compile();

    service = module.get<SnapshotCreateService>(SnapshotCreateService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('testing createUserSnapshot', () => {
    it('should create snapshot for user with no ancilliary data', async () => {
      const id = randomUUID();
      const createdAt = new Date();
      const updatedAt = new Date();

      prisma.userAccounts.findUnique = jest.fn().mockResolvedValue({
        id,
        createdAt,
        updatedAt,

        additionalPhoneExtension: 'example additionalPhoneExtension',
        additionalPhoneNumber: 'example additionalPhoneNumber',
        additionalPhoneNumberType: 'example additionalPhoneNumberType',
        agreedToTermsOfService: true,
        confirmedAt: new Date(),
        dob: new Date(),
        email: 'example email',
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
      });
      prisma.userAccountSnapshot.create = jest.fn().mockResolvedValue({ id });

      await service.createUserSnapshot(id);

      expect(prisma.userAccounts.findUnique).toHaveBeenCalledWith({
        where: {
          id,
        },
        select: {
          id: true,
          createdAt: true,
          updatedAt: true,
          additionalPhoneExtension: true,
          additionalPhoneNumber: true,
          additionalPhoneNumberType: true,
          agreedToTermsOfService: true,
          confirmedAt: true,
          dob: true,
          email: true,
          firstName: true,
          hitConfirmationUrl: true,
          isAdvocate: true,
          isApproved: true,
          language: true,
          lastLoginAt: true,
          lastName: true,
          mfaEnabled: true,
          middleName: true,
          passwordHash: true,
          passwordUpdatedAt: true,
          passwordValidForDays: true,
          phoneExtension: true,
          phoneNumber: true,
          phoneNumberVerified: true,
          phoneType: true,
          title: true,
          wasWarnedOfDeletion: true,

          address: {
            select: {
              id: true,
              createdAt: true,
              updatedAt: true,
              city: true,
              county: true,
              latitude: true,
              longitude: true,
              placeName: true,
              state: true,
              street: true,
              street2: true,
              zipCode: true,
            },
          },
          agency: {
            select: {
              id: true,
            },
          },
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
          userRoles: {
            select: {
              isAdmin: true,
              isJurisdictionalAdmin: true,
              isLimitedJurisdictionalAdmin: true,
              isPartner: true,
              isSuperAdmin: true,
              isSupportAdmin: true,
            },
          },
        },
      });
      expect(prisma.userAccountSnapshot.create).toHaveBeenCalledWith({
        data: {
          originalId: id,
          originalCreatedAt: createdAt,
          updatedAt,

          additionalPhoneExtension: 'example additionalPhoneExtension',
          additionalPhoneNumber: 'example additionalPhoneNumber',
          additionalPhoneNumberType: 'example additionalPhoneNumberType',
          agreedToTermsOfService: true,
          confirmedAt: expect.anything(),
          dob: expect.anything(),
          email: 'example email',
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
        },
      });
    });
    it('should create snapshot for user with full ancilliary data', async () => {
      const id = randomUUID();
      const createdAt = new Date();
      const updatedAt = new Date();

      const addressId = randomUUID();
      const agencyId = randomUUID();

      const listingAId = randomUUID();
      const listingBId = randomUUID();

      const jurisdictionAId = randomUUID();
      const jurisdictionBId = randomUUID();

      prisma.userAccounts.findUnique = jest.fn().mockResolvedValue({
        id,
        createdAt,
        updatedAt,

        additionalPhoneExtension: 'example additionalPhoneExtension',
        additionalPhoneNumber: 'example additionalPhoneNumber',
        additionalPhoneNumberType: 'example additionalPhoneNumberType',
        agreedToTermsOfService: true,
        confirmedAt: new Date(),
        dob: new Date(),
        email: 'example email',
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
          id: addressId,
          createdAt,
          updatedAt,

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
        agency: {
          id: agencyId,
        },
        jurisdictions: [
          {
            id: jurisdictionAId,
          },
          {
            id: jurisdictionBId,
          },
        ],
        listings: [
          {
            id: listingAId,
          },
          {
            id: listingBId,
          },
        ],
        userRoles: {
          isAdmin: false,
          isJurisdictionalAdmin: false,
          isLimitedJurisdictionalAdmin: false,
          isPartner: false,
          isSuperAdmin: true,
          isSupportAdmin: false,
        },
      });
      prisma.userAccountSnapshot.create = jest.fn().mockResolvedValue({ id });

      await service.createUserSnapshot(id);

      expect(prisma.userAccounts.findUnique).toHaveBeenCalledWith({
        where: {
          id,
        },
        select: {
          id: true,
          createdAt: true,
          updatedAt: true,
          additionalPhoneExtension: true,
          additionalPhoneNumber: true,
          additionalPhoneNumberType: true,
          agreedToTermsOfService: true,
          confirmedAt: true,
          dob: true,
          email: true,
          firstName: true,
          hitConfirmationUrl: true,
          isAdvocate: true,
          isApproved: true,
          language: true,
          lastLoginAt: true,
          lastName: true,
          mfaEnabled: true,
          middleName: true,
          passwordHash: true,
          passwordUpdatedAt: true,
          passwordValidForDays: true,
          phoneExtension: true,
          phoneNumber: true,
          phoneNumberVerified: true,
          phoneType: true,
          title: true,
          wasWarnedOfDeletion: true,

          address: {
            select: {
              id: true,
              createdAt: true,
              updatedAt: true,
              city: true,
              county: true,
              latitude: true,
              longitude: true,
              placeName: true,
              state: true,
              street: true,
              street2: true,
              zipCode: true,
            },
          },
          agency: {
            select: {
              id: true,
            },
          },
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
          userRoles: {
            select: {
              isAdmin: true,
              isJurisdictionalAdmin: true,
              isLimitedJurisdictionalAdmin: true,
              isPartner: true,
              isSuperAdmin: true,
              isSupportAdmin: true,
            },
          },
        },
      });
      expect(prisma.userAccountSnapshot.create).toHaveBeenCalledWith({
        data: {
          originalId: id,
          originalCreatedAt: createdAt,
          updatedAt,

          additionalPhoneExtension: 'example additionalPhoneExtension',
          additionalPhoneNumber: 'example additionalPhoneNumber',
          additionalPhoneNumberType: 'example additionalPhoneNumberType',
          agreedToTermsOfService: true,
          confirmedAt: expect.anything(),
          dob: expect.anything(),
          email: 'example email',
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

          address: {
            create: {
              originalId: addressId,
              originalCreatedAt: createdAt,
              updatedAt,

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
          agency: {
            connect: {
              id: agencyId,
            },
          },
          jurisdiction: {
            connect: [
              {
                id: jurisdictionAId,
              },
              {
                id: jurisdictionBId,
              },
            ],
          },
          listing: {
            connect: [
              {
                id: listingAId,
              },
              {
                id: listingBId,
              },
            ],
          },
          userRole: {
            create: {
              isAdmin: false,
              isJurisdictionalAdmin: false,
              isLimitedJurisdictionalAdmin: false,
              isPartner: false,
              isSuperAdmin: true,
              isSupportAdmin: false,
            },
          },
        },
      });
    });
    it('should error when trying to create snapshot against user id that does not exist', async () => {
      const id = randomUUID();

      prisma.userAccounts.findUnique = jest.fn().mockResolvedValue(null);
      prisma.userAccountSnapshot.create = jest.fn().mockResolvedValue({ id });

      await expect(
        async () => await service.createUserSnapshot(id),
      ).rejects.toThrowError(
        `Snapshot was requested for user id: ${id}, but that id does not exist`,
      );

      expect(prisma.userAccounts.findUnique).toHaveBeenCalledWith({
        where: {
          id,
        },
        select: {
          id: true,
          createdAt: true,
          updatedAt: true,
          additionalPhoneExtension: true,
          additionalPhoneNumber: true,
          additionalPhoneNumberType: true,
          agreedToTermsOfService: true,
          confirmedAt: true,
          dob: true,
          email: true,
          firstName: true,
          hitConfirmationUrl: true,
          isAdvocate: true,
          isApproved: true,
          language: true,
          lastLoginAt: true,
          lastName: true,
          mfaEnabled: true,
          middleName: true,
          passwordHash: true,
          passwordUpdatedAt: true,
          passwordValidForDays: true,
          phoneExtension: true,
          phoneNumber: true,
          phoneNumberVerified: true,
          phoneType: true,
          title: true,
          wasWarnedOfDeletion: true,

          address: {
            select: {
              id: true,
              createdAt: true,
              updatedAt: true,
              city: true,
              county: true,
              latitude: true,
              longitude: true,
              placeName: true,
              state: true,
              street: true,
              street2: true,
              zipCode: true,
            },
          },
          agency: {
            select: {
              id: true,
            },
          },
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
          userRoles: {
            select: {
              isAdmin: true,
              isJurisdictionalAdmin: true,
              isLimitedJurisdictionalAdmin: true,
              isPartner: true,
              isSuperAdmin: true,
              isSupportAdmin: true,
            },
          },
        },
      });
      expect(prisma.userAccountSnapshot.create).not.toHaveBeenCalled();
    });
  });
});
