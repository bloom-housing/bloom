import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../../src/services/prisma.service';
import { JurisdictionService } from '../../../src/services/jurisdiction.service';
import { JurisdictionCreate } from '../../../src/dtos/jurisdictions/jurisdiction-create.dto';
import { JurisdictionUpdate } from '../../../src/dtos/jurisdictions/jurisdiction-update.dto';
import { LanguagesEnum } from '@prisma/client';
import { randomUUID } from 'crypto';

describe('Testing jurisdiction service', () => {
  let service: JurisdictionService;
  let prisma: PrismaService;

  const mockJurisdiction = (position: number, date: Date) => {
    return {
      id: randomUUID(),
      createdAt: date,
      updatedAt: date,
      name: `jurisdiction ${position}`,
      notificationsSignUpUrl: `notificationsSignUpUrl: ${position}`,
      languages: [LanguagesEnum.en],
      partnerTerms: `partnerTerms: ${position}`,
      publicUrl: `publicUrl: ${position}`,
      emailFromAddress: `emailFromAddress: ${position}`,
      rentalAssistanceDefault: `rentalAssistanceDefault: ${position}`,
      enablePartnerSettings: true,
    };
  };

  const mockJurisdictionSet = (numberToCreate: number, date: Date) => {
    const toReturn = [];
    for (let i = 0; i < numberToCreate; i++) {
      toReturn.push(mockJurisdiction(i, date));
    }
    return toReturn;
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [JurisdictionService, PrismaService],
    }).compile();

    service = module.get<JurisdictionService>(JurisdictionService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('testing list()', async () => {
    const date = new Date();
    const mockedValue = mockJurisdictionSet(3, date);
    prisma.jurisdictions.findMany = jest.fn().mockResolvedValue(mockedValue);

    expect(await service.list()).toEqual(mockedValue);

    expect(prisma.jurisdictions.findMany).toHaveBeenCalledWith({
      include: {
        featureFlags: true,
        multiselectQuestions: true,
      },
    });
  });

  it('testing findOne() with id present', async () => {
    const date = new Date();
    const mockedValue = mockJurisdiction(3, date);
    prisma.jurisdictions.findFirst = jest.fn().mockResolvedValue(mockedValue);

    expect(await service.findOne({ jurisdictionId: 'example Id' })).toEqual(
      mockedValue,
    );

    expect(prisma.jurisdictions.findFirst).toHaveBeenCalledWith({
      where: {
        id: {
          equals: 'example Id',
        },
      },
      include: {
        featureFlags: true,
        multiselectQuestions: true,
      },
    });
  });

  it('testing findOne() with name present', async () => {
    const date = new Date();
    const mockedValue = mockJurisdiction(3, date);
    prisma.jurisdictions.findFirst = jest.fn().mockResolvedValue(mockedValue);

    expect(await service.findOne({ jurisdictionName: 'example Id' })).toEqual(
      mockedValue,
    );

    expect(prisma.jurisdictions.findFirst).toHaveBeenCalledWith({
      where: {
        name: {
          equals: 'example Id',
        },
      },
      include: {
        featureFlags: true,
        multiselectQuestions: true,
      },
    });
  });

  it('testing findOne() with id not present', async () => {
    prisma.jurisdictions.findFirst = jest.fn().mockResolvedValue(null);

    await expect(
      async () => await service.findOne({ jurisdictionId: 'example Id' }),
    ).rejects.toThrowError(
      'jurisdiction example Id was requested but not found',
    );

    expect(prisma.jurisdictions.findFirst).toHaveBeenCalledWith({
      where: {
        id: {
          equals: 'example Id',
        },
      },
      include: {
        featureFlags: true,
        multiselectQuestions: true,
      },
    });
  });

  it('testing create()', async () => {
    const date = new Date();
    const mockedValue = mockJurisdiction(3, date);
    prisma.jurisdictions.create = jest.fn().mockResolvedValue(mockedValue);

    const params: JurisdictionCreate = {
      name: 'jurisdiction 3',
      notificationsSignUpUrl: `notificationsSignUpUrl: 3`,
      languages: [LanguagesEnum.en],
      partnerTerms: `partnerTerms: 3`,
      publicUrl: `publicUrl: 3`,
      emailFromAddress: `emailFromAddress: 3`,
      rentalAssistanceDefault: `rentalAssistanceDefault: 3`,
      enablePartnerSettings: true,
      allowSingleUseCodeLogin: false,
      listingApprovalPermissions: [],
      duplicateListingPermissions: [],
    };

    expect(await service.create(params)).toEqual(mockedValue);

    expect(prisma.jurisdictions.create).toHaveBeenCalledWith({
      data: {
        name: 'jurisdiction 3',
        notificationsSignUpUrl: `notificationsSignUpUrl: 3`,
        languages: [LanguagesEnum.en],
        partnerTerms: `partnerTerms: 3`,
        publicUrl: `publicUrl: 3`,
        emailFromAddress: `emailFromAddress: 3`,
        rentalAssistanceDefault: `rentalAssistanceDefault: 3`,
        enablePartnerSettings: true,
        allowSingleUseCodeLogin: false,
        listingApprovalPermissions: [],
        duplicateListingPermissions: [],
      },
      include: {
        featureFlags: true,
        multiselectQuestions: true,
      },
    });
  });

  it('testing update() existing record found', async () => {
    const date = new Date();

    const mockedJurisdiction = mockJurisdiction(3, date);

    prisma.jurisdictions.findFirst = jest
      .fn()
      .mockResolvedValue(mockedJurisdiction);
    prisma.jurisdictions.update = jest.fn().mockResolvedValue({
      ...mockedJurisdiction,
      name: 'updated jurisdiction 3',
    });

    const params: JurisdictionUpdate = {
      name: 'updated jurisdiction 3',
      id: mockedJurisdiction.id,
      notificationsSignUpUrl: `notificationsSignUpUrl: 3`,
      languages: [LanguagesEnum.en],
      partnerTerms: `partnerTerms: 3`,
      publicUrl: `publicUrl: 3`,
      emailFromAddress: `emailFromAddress: 3`,
      rentalAssistanceDefault: `rentalAssistanceDefault: 3`,
      enablePartnerSettings: true,
      allowSingleUseCodeLogin: false,
      listingApprovalPermissions: [],
      duplicateListingPermissions: [],
    };

    expect(await service.update(params)).toEqual({
      id: mockedJurisdiction.id,
      name: `updated jurisdiction 3`,
      notificationsSignUpUrl: `notificationsSignUpUrl: 3`,
      languages: [LanguagesEnum.en],
      partnerTerms: `partnerTerms: 3`,
      publicUrl: `publicUrl: 3`,
      emailFromAddress: `emailFromAddress: 3`,
      rentalAssistanceDefault: `rentalAssistanceDefault: 3`,
      enablePartnerSettings: true,
      createdAt: date,
      updatedAt: date,
    });

    expect(prisma.jurisdictions.findFirst).toHaveBeenCalledWith({
      where: {
        id: mockedJurisdiction.id,
      },
    });

    expect(prisma.jurisdictions.update).toHaveBeenCalledWith({
      data: {
        name: 'updated jurisdiction 3',
        notificationsSignUpUrl: `notificationsSignUpUrl: 3`,
        languages: [LanguagesEnum.en],
        partnerTerms: `partnerTerms: 3`,
        publicUrl: `publicUrl: 3`,
        emailFromAddress: `emailFromAddress: 3`,
        rentalAssistanceDefault: `rentalAssistanceDefault: 3`,
        enablePartnerSettings: true,
        allowSingleUseCodeLogin: false,
        listingApprovalPermissions: [],
        duplicateListingPermissions: [],
      },
      where: {
        id: mockedJurisdiction.id,
      },
      include: {
        featureFlags: true,
        multiselectQuestions: true,
      },
    });
  });

  it('testing update() existing record not found', async () => {
    prisma.jurisdictions.findFirst = jest.fn().mockResolvedValue(null);
    prisma.jurisdictions.update = jest.fn().mockResolvedValue(null);

    const params: JurisdictionUpdate = {
      name: 'example jurisdiction',
      id: 'example id',
      notificationsSignUpUrl: `notificationsSignUpUrl: 3`,
      languages: [LanguagesEnum.en],
      partnerTerms: `partnerTerms: 3`,
      publicUrl: `publicUrl: 3`,
      emailFromAddress: `emailFromAddress: 3`,
      rentalAssistanceDefault: `rentalAssistanceDefault: 3`,
      enablePartnerSettings: true,
      allowSingleUseCodeLogin: false,
      listingApprovalPermissions: [],
      duplicateListingPermissions: [],
    };

    await expect(async () => await service.update(params)).rejects.toThrowError(
      'jurisdictionId example id was requested but not found',
    );

    expect(prisma.jurisdictions.findFirst).toHaveBeenCalledWith({
      where: {
        id: 'example id',
      },
    });
  });

  it('testing delete()', async () => {
    const date = new Date();
    const mockedValue = mockJurisdiction(3, date);

    prisma.jurisdictions.findFirst = jest.fn().mockResolvedValue(mockedValue);
    prisma.jurisdictions.delete = jest.fn().mockResolvedValue(mockedValue);

    expect(await service.delete('example Id')).toEqual({
      success: true,
    });

    expect(prisma.jurisdictions.delete).toHaveBeenCalledWith({
      where: {
        id: 'example Id',
      },
    });

    expect(prisma.jurisdictions.delete).toHaveBeenCalledWith({
      where: {
        id: 'example Id',
      },
    });
  });
});
