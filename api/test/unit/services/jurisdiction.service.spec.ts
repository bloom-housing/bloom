import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../../src/services/prisma.service';
import { JurisdictionService } from '../../../src/services/jurisdiction.service';
import { JurisdictionCreate } from '../../../src/dtos/jurisdictions/jurisdiction-create.dto';
import { JurisdictionUpdate } from '../../../src/dtos/jurisdictions/jurisdiction-update.dto';
import { LanguagesEnum, Prisma } from '@prisma/client';
import { randomUUID } from 'crypto';
import { ApplicationAccessibilityFeatureEnum } from '../../../src/enums/applications/application-accessibility-feature-enum';
import { HouseholdMemberRelationship } from '../../../src/enums/applications/household-member-relationship-enum';

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
      referralSummaryDefault: `referralSummaryDefault: ${position}`,
      whatToExpect: `whatToExpect: ${position}`,
      whatToExpectAdditionalText: `whatToExpectAdditionalText: ${position}`,
      whatToExpectUnderConstruction: `whatToExpectUnderConstruction: ${position}`,
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
      select: {
        allowSingleUseCodeLogin: true,
        brand: true,
        brandLogoAssetId: true,
        brandFaviconAssetId: true,
        brandLogo: { select: { fileId: true } },
        brandFavicon: { select: { fileId: true } },
        duplicateListingPermissions: true,
        emailFromAddress: true,
        enabledStopLightRuleKeys: true,
        enableGeocodingPreferences: true,
        enablePartnerDemographics: true,
        enablePartnerSettings: true,
        featureFlags: {
          select: {
            active: true,
            id: true,
            name: true,
          },
        },
        id: true,
        languages: true,
        listingApprovalPermissions: true,
        listingFeaturesConfiguration: true,
        minimumListingPublishImagesRequired: true,
        multiselectQuestions: true,
        name: true,
        notificationsSignUpUrl: true,
        partnerTerms: true,
        publicUrl: true,
        raceEthnicityConfiguration: true,
        referralSummaryDefault: true,
        regions: true,
        rentalAssistanceDefault: true,
        requiredListingFields: true,
        subJurisdictions: {
          select: { id: true, name: true },
        },
        visibleAccessibilityPriorityTypes: true,
        visibleApplicationAccessibilityFeatures: true,
        visibleHouseholdMemberRelationships: true,
        visibleSpokenLanguages: true,
        whatToExpect: true,
        whatToExpectAdditionalText: true,
        whatToExpectUnderConstruction: true,
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
      select: {
        enabledStopLightRuleKeys: true,
        featureFlags: {
          select: {
            active: true,
            id: true,
            name: true,
          },
        },
        id: true,
        languages: true,
        listingFeaturesConfiguration: true,
        brand: true,
        brandLogoAssetId: true,
        brandFaviconAssetId: true,
        brandLogo: { select: { fileId: true } },
        brandFavicon: { select: { fileId: true } },
        notificationsSignUpUrl: true,
        raceEthnicityConfiguration: true,
        name: true,
        regions: true,
        subJurisdictions: {
          select: { id: true, name: true },
        },
        visibleAccessibilityPriorityTypes: true,
        visibleSpokenLanguages: true,
        visibleApplicationAccessibilityFeatures: true,
        visibleHouseholdMemberRelationships: true,
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
      select: {
        enabledStopLightRuleKeys: true,
        featureFlags: {
          select: {
            active: true,
            id: true,
            name: true,
          },
        },
        id: true,
        languages: true,
        listingFeaturesConfiguration: true,
        brand: true,
        brandLogoAssetId: true,
        brandFaviconAssetId: true,
        brandLogo: { select: { fileId: true } },
        brandFavicon: { select: { fileId: true } },
        notificationsSignUpUrl: true,
        raceEthnicityConfiguration: true,
        name: true,
        regions: true,
        subJurisdictions: {
          select: { id: true, name: true },
        },
        visibleAccessibilityPriorityTypes: true,
        visibleSpokenLanguages: true,
        visibleApplicationAccessibilityFeatures: true,
        visibleHouseholdMemberRelationships: true,
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
      select: {
        enabledStopLightRuleKeys: true,
        featureFlags: {
          select: {
            active: true,
            id: true,
            name: true,
          },
        },
        id: true,
        languages: true,
        listingFeaturesConfiguration: true,
        brand: true,
        brandLogoAssetId: true,
        brandFaviconAssetId: true,
        brandLogo: { select: { fileId: true } },
        brandFavicon: { select: { fileId: true } },
        notificationsSignUpUrl: true,
        raceEthnicityConfiguration: true,
        name: true,
        regions: true,
        subJurisdictions: {
          select: { id: true, name: true },
        },
        visibleAccessibilityPriorityTypes: true,
        visibleSpokenLanguages: true,
        visibleApplicationAccessibilityFeatures: true,
        visibleHouseholdMemberRelationships: true,
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
      referralSummaryDefault: `referralSummaryDefault: 3`,
      whatToExpect: `whatToExpect: 3`,
      whatToExpectAdditionalText: `whatToExpectAdditionalText: 3`,
      whatToExpectUnderConstruction: `whatToExpectUnderConstruction: 3`,
      enablePartnerSettings: true,
      allowSingleUseCodeLogin: false,
      listingApprovalPermissions: [],
      duplicateListingPermissions: [],
      regions: [],
      requiredListingFields: [],
      visibleAccessibilityPriorityTypes: [],
      visibleApplicationAccessibilityFeatures: [
        ApplicationAccessibilityFeatureEnum.mobility,
        ApplicationAccessibilityFeatureEnum.hearing,
        ApplicationAccessibilityFeatureEnum.vision,
      ],
      visibleNeighborhoodAmenities: [],
      visibleSpokenLanguages: [],
      visibleHouseholdMemberRelationships: [
        HouseholdMemberRelationship.spouse,
        HouseholdMemberRelationship.child,
        HouseholdMemberRelationship.parent,
        HouseholdMemberRelationship.other,
      ],
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
        referralSummaryDefault: `referralSummaryDefault: 3`,
        whatToExpect: `whatToExpect: 3`,
        whatToExpectAdditionalText: `whatToExpectAdditionalText: 3`,
        whatToExpectUnderConstruction: `whatToExpectUnderConstruction: 3`,
        enablePartnerSettings: true,
        allowSingleUseCodeLogin: false,
        listingApprovalPermissions: [],
        duplicateListingPermissions: [],
        listingFeaturesConfiguration: undefined,
        raceEthnicityConfiguration: undefined,
        regions: [],
        requiredListingFields: [],
        visibleAccessibilityPriorityTypes: [],
        visibleApplicationAccessibilityFeatures: [
          ApplicationAccessibilityFeatureEnum.mobility,
          ApplicationAccessibilityFeatureEnum.hearing,
          ApplicationAccessibilityFeatureEnum.vision,
        ],
        visibleNeighborhoodAmenities: [],
        visibleSpokenLanguages: [],
        visibleHouseholdMemberRelationships: [
          HouseholdMemberRelationship.spouse,
          HouseholdMemberRelationship.child,
          HouseholdMemberRelationship.parent,
          HouseholdMemberRelationship.other,
        ],
      },
      include: {
        featureFlags: true,
        multiselectQuestions: true,
        brandLogo: { select: { fileId: true } },
        brandFavicon: { select: { fileId: true } },
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
      referralSummaryDefault: `referralSummaryDefault: 3`,
      whatToExpect: `whatToExpect: 3`,
      whatToExpectAdditionalText: `whatToExpectAdditionalText: 3`,
      whatToExpectUnderConstruction: `whatToExpectUnderConstruction: 3`,
      enablePartnerSettings: true,
      allowSingleUseCodeLogin: false,
      listingApprovalPermissions: [],
      duplicateListingPermissions: [],
      regions: [],
      requiredListingFields: [],
      visibleAccessibilityPriorityTypes: [],
      visibleApplicationAccessibilityFeatures: [
        ApplicationAccessibilityFeatureEnum.mobility,
        ApplicationAccessibilityFeatureEnum.hearing,
        ApplicationAccessibilityFeatureEnum.vision,
      ],
      visibleSpokenLanguages: [],
      visibleNeighborhoodAmenities: [],
      visibleHouseholdMemberRelationships: [
        HouseholdMemberRelationship.spousePartner,
        HouseholdMemberRelationship.child,
        HouseholdMemberRelationship.parent,
        HouseholdMemberRelationship.liveInAide,
      ],
    };

    expect(await service.update(params)).toEqual({
      id: mockedJurisdiction.id,
      createdAt: date,
      updatedAt: date,
      name: `updated jurisdiction 3`,
      notificationsSignUpUrl: `notificationsSignUpUrl: 3`,
      languages: [LanguagesEnum.en],
      partnerTerms: `partnerTerms: 3`,
      publicUrl: `publicUrl: 3`,
      emailFromAddress: `emailFromAddress: 3`,
      rentalAssistanceDefault: `rentalAssistanceDefault: 3`,
      referralSummaryDefault: `referralSummaryDefault: 3`,
      whatToExpect: `whatToExpect: 3`,
      whatToExpectAdditionalText: `whatToExpectAdditionalText: 3`,
      whatToExpectUnderConstruction: `whatToExpectUnderConstruction: 3`,
      enablePartnerSettings: true,
      multiselectQuestions: undefined,
      minimumListingPublishImagesRequired: undefined,
      enablePartnerDemographics: undefined,
      enableGeocodingPreferences: undefined,
      enableGeocodingRadiusMethod: undefined,
      allowSingleUseCodeLogin: undefined,
      listingApprovalPermissions: undefined,
      duplicateListingPermissions: undefined,
      featureFlags: undefined,
      requiredListingFields: undefined,
      visibleNeighborhoodAmenities: undefined,
      visibleAccessibilityPriorityTypes: undefined,
      visibleApplicationAccessibilityFeatures: undefined,
      visibleSpokenLanguages: undefined,
      visibleHouseholdMemberRelationships: undefined,
      regions: undefined,
      listingFeaturesConfiguration: undefined,
      raceEthnicityConfiguration: undefined,
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
        referralSummaryDefault: `referralSummaryDefault: 3`,
        whatToExpect: `whatToExpect: 3`,
        whatToExpectAdditionalText: `whatToExpectAdditionalText: 3`,
        whatToExpectUnderConstruction: `whatToExpectUnderConstruction: 3`,
        enablePartnerSettings: true,
        allowSingleUseCodeLogin: false,
        listingApprovalPermissions: [],
        duplicateListingPermissions: [],
        listingFeaturesConfiguration: undefined,
        regions: [],
        requiredListingFields: [],
        visibleAccessibilityPriorityTypes: [],
        visibleApplicationAccessibilityFeatures: [
          ApplicationAccessibilityFeatureEnum.mobility,
          ApplicationAccessibilityFeatureEnum.hearing,
          ApplicationAccessibilityFeatureEnum.vision,
        ],
        visibleNeighborhoodAmenities: [],
        visibleSpokenLanguages: [],
        visibleHouseholdMemberRelationships: [
          HouseholdMemberRelationship.spousePartner,
          HouseholdMemberRelationship.child,
          HouseholdMemberRelationship.parent,
          HouseholdMemberRelationship.liveInAide,
        ],
      },
      where: {
        id: mockedJurisdiction.id,
      },
      include: {
        featureFlags: true,
        multiselectQuestions: true,
        brandLogo: { select: { fileId: true } },
        brandFavicon: { select: { fileId: true } },
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
      referralSummaryDefault: `referralSummaryDefault: 3`,
      whatToExpect: `whatToExpect: 3`,
      whatToExpectAdditionalText: `whatToExpectAdditionalText: 3`,
      whatToExpectUnderConstruction: `whatToExpectUnderConstruction: 3`,
      enablePartnerSettings: true,
      allowSingleUseCodeLogin: false,
      listingApprovalPermissions: [],
      duplicateListingPermissions: [],
      regions: [],
      requiredListingFields: [],
      visibleAccessibilityPriorityTypes: [],
      visibleApplicationAccessibilityFeatures: [
        ApplicationAccessibilityFeatureEnum.mobility,
        ApplicationAccessibilityFeatureEnum.hearing,
        ApplicationAccessibilityFeatureEnum.vision,
      ],
      visibleNeighborhoodAmenities: [],
      visibleSpokenLanguages: [],
      visibleHouseholdMemberRelationships: [
        HouseholdMemberRelationship.spouse,
        HouseholdMemberRelationship.child,
      ],
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

  describe('brand', () => {
    const jurisdictionId = randomUUID();
    const row = (extra = {}) => ({
      ...mockJurisdiction(7, new Date()),
      id: jurisdictionId,
      brand: null,
      brandLogo: null,
      brandFavicon: null,
      ...extra,
    });

    beforeEach(() => {
      process.env.CLOUDINARY_CLOUD_NAME = 'exygy';
      delete process.env.USE_S3_FILE_STORAGE;
    });

    it('derives the missing ramp values at read time', async () => {
      prisma.jurisdictions.findFirst = jest
        .fn()
        .mockResolvedValue(row({ brand: { primary: { base: '#773E98' } } }));

      const result = await service.findOne({ jurisdictionId });

      expect(result.brand.primary).toEqual({
        base: '#773E98',
        dark: '#693786',
        darker: '#4C2861',
        light: '#EFE6F5',
        lighter: '#F8F4FB',
      });
      expect(result.brand.secondary).toBeUndefined();
    });

    it('returns explicit ramp values as stored', async () => {
      prisma.jurisdictions.findFirst = jest.fn().mockResolvedValue(
        row({
          brand: {
            primary: { base: '#773E98', dark: '#6E2598' },
            secondary: { base: '#0077DA' },
          },
        }),
      );

      const result = await service.findOne({ jurisdictionId });

      expect(result.brand.primary.dark).toEqual('#6E2598');
      expect(result.brand.primary.darker).toEqual('#4C2861');
      expect(result.brand.secondary.base).toEqual('#0077DA');
      expect(result.brand.secondary.dark).toEqual('#0069C0');
    });

    it('builds the asset urls from the related file ids', async () => {
      prisma.jurisdictions.findFirst = jest.fn().mockResolvedValue(
        row({
          brand: { primary: { base: '#773E98' } },
          brandLogo: { fileId: 'logo-id' },
          brandFavicon: { fileId: 'favicon-id' },
        }),
      );

      const result = await service.findOne({ jurisdictionId });

      expect(result.brand.logoUrl).toEqual(
        'https://res.cloudinary.com/exygy/image/upload/w_400,c_limit,q_90,f_png/logo-id',
      );
      expect(result.brand.faviconUrl).toEqual(
        'https://res.cloudinary.com/exygy/image/upload/w_64,c_limit,q_90,f_png/favicon-id',
      );
    });

    it('builds S3 urls when that backend is configured', async () => {
      process.env.USE_S3_FILE_STORAGE = 'TRUE';
      process.env.S3_PUBLIC_BUCKET = 'bloom-public';
      process.env.S3_REGION = 'us-west-2';
      prisma.jurisdictions.findFirst = jest.fn().mockResolvedValue(
        row({
          brand: { primary: { base: '#773E98' } },
          brandLogo: { fileId: 'logo-key' },
        }),
      );

      const result = await service.findOne({ jurisdictionId });

      expect(result.brand.logoUrl).toEqual(
        'https://bloom-public.s3.us-west-2.amazonaws.com/logo-key',
      );
      expect(result.brand.faviconUrl).toBeUndefined();
    });

    it('carries the urls without colors when only an asset is set', async () => {
      prisma.jurisdictions.findFirst = jest
        .fn()
        .mockResolvedValue(row({ brandLogo: { fileId: 'logo-id' } }));

      const result = await service.findOne({ jurisdictionId });

      expect(result.brand.logoUrl).toContain('logo-id');
      expect(result.brand.primary).toBeUndefined();
    });

    it('returns no brand when nothing is set', async () => {
      prisma.jurisdictions.findFirst = jest.fn().mockResolvedValue(row());

      const result = await service.findOne({ jurisdictionId });

      expect(result.brand).toBeFalsy();
    });

    it('stores the brand without its url fields', async () => {
      prisma.jurisdictions.update = jest.fn().mockResolvedValue(row());
      prisma.jurisdictions.findFirst = jest
        .fn()
        .mockResolvedValue(row())
        .mockResolvedValueOnce({ id: jurisdictionId });
      prisma.assets.findMany = jest.fn().mockResolvedValue([]);

      await service.update({
        id: jurisdictionId,
        name: 'Branded',
        brand: {
          primary: { base: '#773E98' },
          logoUrl: 'https://stale.example/logo.png',
          faviconUrl: 'https://stale.example/favicon.png',
        },
      } as JurisdictionUpdate);

      const written = (prisma.jurisdictions.update as jest.Mock).mock
        .calls[0][0].data;
      expect(written.brand).toEqual({ primary: { base: '#773E98' } });
      expect(written.brandLogo).toBeUndefined();
    });

    it('returns a malformed stored ramp as stored rather than failing the read', async () => {
      prisma.jurisdictions.findFirst = jest.fn().mockResolvedValue(
        row({
          brand: { primary: { dark: '#693786' }, fontFamily: 'Inter' },
        }),
      );

      const result = await service.findOne({ jurisdictionId });

      expect(result.brand.primary).toEqual({ dark: '#693786' });
      expect(result.brand.fontFamily).toEqual('Inter');
    });

    it('clears the stored brand when null is sent', async () => {
      prisma.jurisdictions.update = jest.fn().mockResolvedValue(row());
      prisma.jurisdictions.findFirst = jest
        .fn()
        .mockResolvedValueOnce({ id: jurisdictionId });

      await service.update({
        id: jurisdictionId,
        name: 'Unbranded',
        brand: null,
      } as unknown as JurisdictionUpdate);

      const written = (prisma.jurisdictions.update as jest.Mock).mock
        .calls[0][0].data;
      expect(written.brand).toEqual(Prisma.DbNull);
    });

    it('disconnects an asset when its id is sent as null', async () => {
      prisma.jurisdictions.update = jest.fn().mockResolvedValue(row());
      prisma.jurisdictions.findFirst = jest
        .fn()
        .mockResolvedValueOnce({ id: jurisdictionId });

      await service.update({
        id: jurisdictionId,
        name: 'Unbranded',
        brandLogoAssetId: null,
      } as unknown as JurisdictionUpdate);

      const written = (prisma.jurisdictions.update as jest.Mock).mock
        .calls[0][0].data;
      expect(written.brandLogo).toEqual({ disconnect: true });
      expect(written.brandFavicon).toBeUndefined();
    });

    it('rejects a branding asset id that does not exist', async () => {
      const missing = randomUUID();
      prisma.jurisdictions.findFirst = jest
        .fn()
        .mockResolvedValueOnce({ id: jurisdictionId });
      prisma.assets.findMany = jest.fn().mockResolvedValue([]);
      prisma.jurisdictions.update = jest.fn();

      await expect(
        service.update({
          id: jurisdictionId,
          name: 'Branded',
          brandLogoAssetId: missing,
        } as JurisdictionUpdate),
      ).rejects.toThrow(`assets ${missing} do not exist`);
      expect(prisma.jurisdictions.update).not.toHaveBeenCalled();
    });
  });
});
