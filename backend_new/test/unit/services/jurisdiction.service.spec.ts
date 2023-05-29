import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../../src/services/prisma.service';
import { JurisdictionService } from '../../../src/services/jurisdiction.service';
import { JurisdictionCreate } from '../../../src/dtos/jurisdictions/jurisdiction-create.dto';
import { JurisdictionUpdate } from '../../../src/dtos/jurisdictions/jurisdiction-update.dto';
import { LanguagesEnum } from '@prisma/client';

describe('Testing jurisdiction service', () => {
  let service: JurisdictionService;
  let prisma: PrismaService;

  const mockJurisdiction = (position: number, date: Date) => {
    return {
      id: `jurisdiction id ${position}`,
      createdAt: date,
      updatedAt: date,
      name: `name: ${position}`,
      notificationsSignUpUrl: `notificationsSignUpUrl: ${position}`,
      languages: [LanguagesEnum.en],
      partnerTerms: `partnerTerms: ${position}`,
      publicUrl: `publicUrl: ${position}`,
      emailFromAddress: `emailFromAddress: ${position}`,
      rentalAssistanceDefault: `rentalAssistanceDefault: ${position}`,
      enablePartnerSettings: true,
      enableAccessibilityFeatures: true,
      enableUtilitiesIncluded: true,
    };
  };

  const mockJurisdictionSet = (numberToCreate: number, date: Date) => {
    const toReturn = [];
    for (let i = 0; i < numberToCreate; i++) {
      toReturn.push(mockJurisdiction(i, date));
    }
    return toReturn;
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [JurisdictionService, PrismaService],
    }).compile();

    service = module.get<JurisdictionService>(JurisdictionService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('testing list()', async () => {
    const date = new Date();
    prisma.jurisdictions.findMany = jest
      .fn()
      .mockResolvedValue(mockJurisdictionSet(3, date));

    expect(await service.list()).toEqual([
      {
        id: `jurisdiction id 0`,
        createdAt: date,
        updatedAt: date,
        name: `name: 0`,
        notificationsSignUpUrl: `notificationsSignUpUrl: 0`,
        languages: [LanguagesEnum.en],
        partnerTerms: `partnerTerms: 0`,
        publicUrl: `publicUrl: 0`,
        emailFromAddress: `emailFromAddress: 0`,
        rentalAssistanceDefault: `rentalAssistanceDefault: 0`,
        enablePartnerSettings: true,
        enableAccessibilityFeatures: true,
        enableUtilitiesIncluded: true,
      },
      {
        id: `jurisdiction id 1`,
        createdAt: date,
        updatedAt: date,
        name: `name: 1`,
        notificationsSignUpUrl: `notificationsSignUpUrl: 1`,
        languages: [LanguagesEnum.en],
        partnerTerms: `partnerTerms: 1`,
        publicUrl: `publicUrl: 1`,
        emailFromAddress: `emailFromAddress: 1`,
        rentalAssistanceDefault: `rentalAssistanceDefault: 1`,
        enablePartnerSettings: true,
        enableAccessibilityFeatures: true,
        enableUtilitiesIncluded: true,
      },
      {
        id: `jurisdiction id 2`,
        createdAt: date,
        updatedAt: date,
        name: `name: 2`,
        notificationsSignUpUrl: `notificationsSignUpUrl: 2`,
        languages: [LanguagesEnum.en],
        partnerTerms: `partnerTerms: 2`,
        publicUrl: `publicUrl: 2`,
        emailFromAddress: `emailFromAddress: 2`,
        rentalAssistanceDefault: `rentalAssistanceDefault: 2`,
        enablePartnerSettings: true,
        enableAccessibilityFeatures: true,
        enableUtilitiesIncluded: true,
      },
    ]);

    expect(prisma.jurisdictions.findMany).toHaveBeenCalledWith({
      include: {
        multiselectQuestions: true,
      },
    });
  });

  it('testing findOne() with id present', async () => {
    const date = new Date();

    prisma.jurisdictions.findFirst = jest
      .fn()
      .mockResolvedValue(mockJurisdiction(3, date));

    expect(await service.findOne({ jurisdictionId: 'example Id' })).toEqual({
      id: `jurisdiction id 3`,
      createdAt: date,
      updatedAt: date,
      name: `name: 3`,
      notificationsSignUpUrl: `notificationsSignUpUrl: 3`,
      languages: [LanguagesEnum.en],
      partnerTerms: `partnerTerms: 3`,
      publicUrl: `publicUrl: 3`,
      emailFromAddress: `emailFromAddress: 3`,
      rentalAssistanceDefault: `rentalAssistanceDefault: 3`,
      enablePartnerSettings: true,
      enableAccessibilityFeatures: true,
      enableUtilitiesIncluded: true,
    });

    expect(prisma.jurisdictions.findFirst).toHaveBeenCalledWith({
      where: {
        id: {
          equals: 'example Id',
        },
      },
      include: {
        multiselectQuestions: true,
      },
    });
  });

  it('testing findOne() with name present', async () => {
    const date = new Date();

    prisma.jurisdictions.findFirst = jest
      .fn()
      .mockResolvedValue(mockJurisdiction(3, date));

    expect(await service.findOne({ jurisdictionName: 'example Id' })).toEqual({
      id: `jurisdiction id 3`,
      createdAt: date,
      updatedAt: date,
      name: `name: 3`,
      notificationsSignUpUrl: `notificationsSignUpUrl: 3`,
      languages: [LanguagesEnum.en],
      partnerTerms: `partnerTerms: 3`,
      publicUrl: `publicUrl: 3`,
      emailFromAddress: `emailFromAddress: 3`,
      rentalAssistanceDefault: `rentalAssistanceDefault: 3`,
      enablePartnerSettings: true,
      enableAccessibilityFeatures: true,
      enableUtilitiesIncluded: true,
    });

    expect(prisma.jurisdictions.findFirst).toHaveBeenCalledWith({
      where: {
        name: {
          equals: 'example Id',
        },
      },
      include: {
        multiselectQuestions: true,
      },
    });
  });

  it('testing findOne() with id not present', async () => {
    prisma.jurisdictions.findFirst = jest.fn().mockResolvedValue(null);

    await expect(
      async () => await service.findOne({ jurisdictionId: 'example Id' }),
    ).rejects.toThrowError();

    expect(prisma.jurisdictions.findFirst).toHaveBeenCalledWith({
      where: {
        id: {
          equals: 'example Id',
        },
      },
      include: {
        multiselectQuestions: true,
      },
    });
  });

  it('testing create()', async () => {
    const date = new Date();

    prisma.jurisdictions.create = jest
      .fn()
      .mockResolvedValue(mockJurisdiction(3, date));

    const params: JurisdictionCreate = {
      name: 'jurisdiction name 3',
      notificationsSignUpUrl: `notificationsSignUpUrl: 3`,
      languages: [LanguagesEnum.en],
      partnerTerms: `partnerTerms: 3`,
      publicUrl: `publicUrl: 3`,
      emailFromAddress: `emailFromAddress: 3`,
      rentalAssistanceDefault: `rentalAssistanceDefault: 3`,
      enablePartnerSettings: true,
      enableAccessibilityFeatures: true,
      enableUtilitiesIncluded: true,
    };

    expect(await service.create(params)).toEqual({
      id: `jurisdiction id 3`,
      createdAt: date,
      updatedAt: date,
      name: `name: 3`,
      notificationsSignUpUrl: `notificationsSignUpUrl: 3`,
      languages: [LanguagesEnum.en],
      partnerTerms: `partnerTerms: 3`,
      publicUrl: `publicUrl: 3`,
      emailFromAddress: `emailFromAddress: 3`,
      rentalAssistanceDefault: `rentalAssistanceDefault: 3`,
      enablePartnerSettings: true,
      enableAccessibilityFeatures: true,
      enableUtilitiesIncluded: true,
    });

    expect(prisma.jurisdictions.create).toHaveBeenCalledWith({
      data: {
        name: 'jurisdiction name 3',
        notificationsSignUpUrl: `notificationsSignUpUrl: 3`,
        languages: [LanguagesEnum.en],
        partnerTerms: `partnerTerms: 3`,
        publicUrl: `publicUrl: 3`,
        emailFromAddress: `emailFromAddress: 3`,
        rentalAssistanceDefault: `rentalAssistanceDefault: 3`,
        enablePartnerSettings: true,
        enableAccessibilityFeatures: true,
        enableUtilitiesIncluded: true,
      },
      include: {
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
      name: 'jurisdiction name 4',
    });

    const params: JurisdictionUpdate = {
      name: 'jurisdiction name 4',
      id: 'jurisdiction id 3',
      notificationsSignUpUrl: `notificationsSignUpUrl: 3`,
      languages: [LanguagesEnum.en],
      partnerTerms: `partnerTerms: 3`,
      publicUrl: `publicUrl: 3`,
      emailFromAddress: `emailFromAddress: 3`,
      rentalAssistanceDefault: `rentalAssistanceDefault: 3`,
      enablePartnerSettings: true,
      enableAccessibilityFeatures: true,
      enableUtilitiesIncluded: true,
    };

    expect(await service.update(params)).toEqual({
      id: 'jurisdiction id 3',
      name: `jurisdiction name 4`,
      notificationsSignUpUrl: `notificationsSignUpUrl: 3`,
      languages: [LanguagesEnum.en],
      partnerTerms: `partnerTerms: 3`,
      publicUrl: `publicUrl: 3`,
      emailFromAddress: `emailFromAddress: 3`,
      rentalAssistanceDefault: `rentalAssistanceDefault: 3`,
      enablePartnerSettings: true,
      enableAccessibilityFeatures: true,
      enableUtilitiesIncluded: true,
      createdAt: date,
      updatedAt: date,
    });

    expect(prisma.jurisdictions.findFirst).toHaveBeenCalledWith({
      where: {
        id: 'jurisdiction id 3',
      },
    });

    expect(prisma.jurisdictions.update).toHaveBeenCalledWith({
      data: {
        name: 'jurisdiction name 4',
        notificationsSignUpUrl: `notificationsSignUpUrl: 3`,
        languages: [LanguagesEnum.en],
        partnerTerms: `partnerTerms: 3`,
        publicUrl: `publicUrl: 3`,
        emailFromAddress: `emailFromAddress: 3`,
        rentalAssistanceDefault: `rentalAssistanceDefault: 3`,
        enablePartnerSettings: true,
        enableAccessibilityFeatures: true,
        enableUtilitiesIncluded: true,
      },
      where: {
        id: 'jurisdiction id 3',
      },
      include: {
        multiselectQuestions: true,
      },
    });
  });

  it('testing update() existing record not found', async () => {
    prisma.jurisdictions.findFirst = jest.fn().mockResolvedValue(null);
    prisma.jurisdictions.update = jest.fn().mockResolvedValue(null);

    const params: JurisdictionUpdate = {
      name: 'jurisdiction name 4',
      id: 'jurisdiction id 3',
      notificationsSignUpUrl: `notificationsSignUpUrl: 3`,
      languages: [LanguagesEnum.en],
      partnerTerms: `partnerTerms: 3`,
      publicUrl: `publicUrl: 3`,
      emailFromAddress: `emailFromAddress: 3`,
      rentalAssistanceDefault: `rentalAssistanceDefault: 3`,
      enablePartnerSettings: true,
      enableAccessibilityFeatures: true,
      enableUtilitiesIncluded: true,
    };

    await expect(
      async () => await service.update(params),
    ).rejects.toThrowError();

    expect(prisma.jurisdictions.findFirst).toHaveBeenCalledWith({
      where: {
        id: 'jurisdiction id 3',
      },
    });
  });

  it('testing delete()', async () => {
    const date = new Date();
    prisma.jurisdictions.delete = jest
      .fn()
      .mockResolvedValue(mockJurisdiction(3, date));

    expect(await service.delete('example Id')).toEqual({
      success: true,
    });

    expect(prisma.jurisdictions.delete).toHaveBeenCalledWith({
      where: {
        id: 'example Id',
      },
    });
  });
});
