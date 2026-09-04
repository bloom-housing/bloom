import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { Jurisdiction } from '../dtos/jurisdictions/jurisdiction.dto';
import { JurisdictionCreate } from '../dtos/jurisdictions/jurisdiction-create.dto';
import { mapTo } from '../utilities/mapTo';
import { SuccessDTO } from '../dtos/shared/success.dto';
import { Prisma } from '@prisma/client';
import { JurisdictionUpdate } from '../dtos/jurisdictions/jurisdiction-update.dto';
import { JurisdictionViews } from '../enums/jurisdictions/view-enum';
import { BrandDTO } from '../dtos/jurisdictions/brand.dto';
import { brandAssetUrl } from '../utilities/brand-asset-url';
import { completeRamp } from '../utilities/brand-ramp';

// TODO: convert this to the selectViews
const view: Prisma.JurisdictionsInclude = {
  featureFlags: true,
  multiselectQuestions: true,
  brandLogo: { select: { fileId: true } },
  brandFavicon: { select: { fileId: true } },
};

const selectViews: Partial<
  Record<JurisdictionViews, Prisma.JurisdictionsSelect>
> = {
  [JurisdictionViews.public]: {
    enabledStopLightRuleKeys: true,
    featureFlags: {
      select: {
        id: true,
        name: true,
        active: true,
      },
    },
    id: true,
    name: true,
    languages: true,
    notificationsSignUpUrl: true,
    raceEthnicityConfiguration: true,
    regions: true,
    subJurisdictions: {
      select: { id: true, name: true },
    },
    listingFeaturesConfiguration: true,
    brand: true,
    brandLogoAssetId: true,
    brandFaviconAssetId: true,
    brandLogo: { select: { fileId: true } },
    brandFavicon: { select: { fileId: true } },
    visibleAccessibilityPriorityTypes: true,
    visibleApplicationAccessibilityFeatures: true,
    visibleHouseholdMemberRelationships: true,
    visibleSpokenLanguages: true,
  },
};

selectViews[JurisdictionViews.full] = {
  ...selectViews[JurisdictionViews.public],
  multiselectQuestions: true,
  emailFromAddress: true,
  allowSingleUseCodeLogin: true,
  duplicateListingPermissions: true,
  enableGeocodingPreferences: true,
  enablePartnerDemographics: true,
  enablePartnerSettings: true,
  listingApprovalPermissions: true,
  minimumListingPublishImagesRequired: true,
  notificationsSignUpUrl: true,
  partnerTerms: true,
  publicUrl: true,
  referralSummaryDefault: true,
  rentalAssistanceDefault: true,
  requiredListingFields: true,
  whatToExpect: true,
  whatToExpectAdditionalText: true,
  whatToExpectUnderConstruction: true,
};

// The brand JSON stores only what the admin sets: the url fields are built from the asset foreign
// keys at read time.
const storableBrand = (
  brand?: BrandDTO | null,
): Prisma.InputJsonObject | typeof Prisma.DbNull | undefined => {
  // Null clears the stored brand, matching how a null asset id disconnects that asset.
  if (brand === null) return Prisma.DbNull;
  if (!brand) return undefined;
  const { logoUrl, faviconUrl, ...rest } = brand;
  void logoUrl;
  void faviconUrl;
  return rest as unknown as Prisma.InputJsonObject;
};

type BrandRow = {
  brand?: Prisma.JsonValue | null;
  brandLogo?: { fileId: string } | null;
  brandFavicon?: { fileId: string } | null;
};

// A stored ramp is only derivable when it has a base; a malformed row is returned as stored
// rather than failing the whole jurisdiction read.
const hasDerivableBase = (ramp?: { base?: unknown }): boolean =>
  typeof ramp?.base === 'string' && ramp.base.length > 0;

const withResponseBrand = <T extends BrandRow>(raw: T): T => {
  const stored = raw.brand as unknown as BrandDTO | null;
  const logoUrl = brandAssetUrl(raw.brandLogo?.fileId, 'logo');
  const faviconUrl = brandAssetUrl(raw.brandFavicon?.fileId, 'favicon');
  if (!stored && !logoUrl && !faviconUrl) {
    return raw;
  }

  return {
    ...raw,
    brand: {
      ...(stored ?? {}),
      ...(hasDerivableBase(stored?.primary)
        ? { primary: completeRamp(stored.primary) }
        : {}),
      ...(hasDerivableBase(stored?.secondary)
        ? { secondary: completeRamp(stored.secondary) }
        : {}),
      logoUrl,
      faviconUrl,
    },
  };
};

const brandAssetConnect = (assetId?: string) =>
  assetId === undefined
    ? undefined
    : assetId
    ? { connect: { id: assetId } }
    : { disconnect: true };

/**
  this is the service for jurisdictions
  it handles all the backend's business logic for reading/writing/deleting jurisdiction data
*/
@Injectable()
export class JurisdictionService {
  constructor(private prisma: PrismaService) {}

  /**
    this will get a set of jurisdictions given the params passed in
  */
  async list(view?: JurisdictionViews): Promise<Jurisdiction[]> {
    const rawJurisdictions = await this.prisma.jurisdictions.findMany({
      select: view ? selectViews[view] : selectViews[JurisdictionViews.full],
    });
    return mapTo(Jurisdiction, rawJurisdictions.map(withResponseBrand));
  }

  /*
    this will build the where clause for findOne()
  */
  buildWhere({
    jurisdictionId,
    jurisdictionName,
  }: {
    jurisdictionId?: string;
    jurisdictionName?: string;
  }): Prisma.JurisdictionsWhereInput {
    const toReturn: Prisma.JurisdictionsWhereInput = {};
    if (jurisdictionId) {
      toReturn.id = {
        equals: jurisdictionId,
      };
    } else if (jurisdictionName) {
      toReturn.name = {
        equals: jurisdictionName,
      };
    }
    return toReturn;
  }

  /*
    this will return 1 jurisdiction or error
  */
  async findOne(condition: {
    jurisdictionId?: string;
    jurisdictionName?: string;
    view?: JurisdictionViews;
  }): Promise<Jurisdiction> {
    if (!condition.jurisdictionId && !condition.jurisdictionName) {
      throw new BadRequestException(
        'a jurisdiction id or jurisdiction name must be provided',
      );
    }
    const viewToUse = condition.view || JurisdictionViews.public;

    const rawJurisdiction = await this.prisma.jurisdictions.findFirst({
      where: this.buildWhere(condition),
      select: selectViews[viewToUse],
    });

    if (!rawJurisdiction) {
      throw new NotFoundException(
        `jurisdiction ${
          condition.jurisdictionId || condition.jurisdictionName
        } was requested but not found`,
      );
    }

    return mapTo(Jurisdiction, withResponseBrand(rawJurisdiction));
  }

  /*
    this will create a jurisdiction
  */
  async create(incomingData: JurisdictionCreate): Promise<Jurisdiction> {
    const { brandLogoAssetId, brandFaviconAssetId, ...jurisdictionData } =
      incomingData;
    await this.assertAssetsExist([brandLogoAssetId, brandFaviconAssetId]);
    const rawResult = await this.prisma.jurisdictions.create({
      data: {
        ...jurisdictionData,
        listingFeaturesConfiguration:
          incomingData.listingFeaturesConfiguration as unknown as Prisma.JsonArray,
        raceEthnicityConfiguration:
          incomingData.raceEthnicityConfiguration as unknown as Prisma.JsonArray,
        brand: storableBrand(incomingData.brand),
        brandLogo: brandAssetConnect(brandLogoAssetId),
        brandFavicon: brandAssetConnect(brandFaviconAssetId),
      },
      include: view,
    });

    return mapTo(Jurisdiction, withResponseBrand(rawResult));
  }

  /*
    this will update a jurisdiction's name or items field
    if no jurisdiction has the id of the incoming argument an error is thrown
  */
  async update(incomingData: JurisdictionUpdate): Promise<Jurisdiction> {
    await this.findOrThrow(incomingData.id);

    const { brandLogoAssetId, brandFaviconAssetId, ...jurisdictionData } =
      incomingData;
    await this.assertAssetsExist([brandLogoAssetId, brandFaviconAssetId]);
    const rawResults = await this.prisma.jurisdictions.update({
      data: {
        ...jurisdictionData,
        id: undefined,
        listingFeaturesConfiguration:
          incomingData.listingFeaturesConfiguration as unknown as Prisma.JsonArray,
        raceEthnicityConfiguration:
          incomingData.raceEthnicityConfiguration as unknown as Prisma.JsonArray,
        brand: storableBrand(incomingData.brand),
        brandLogo: brandAssetConnect(brandLogoAssetId),
        brandFavicon: brandAssetConnect(brandFaviconAssetId),
      },
      where: {
        id: incomingData.id,
      },
      include: view,
    });
    return mapTo(Jurisdiction, withResponseBrand(rawResults));
  }

  private async assertAssetsExist(ids: (string | undefined)[]): Promise<void> {
    const wanted = [...new Set(ids.filter((id): id is string => !!id))];
    if (!wanted.length) return;

    const found = await this.prisma.assets.findMany({
      where: { id: { in: wanted } },
      select: { id: true },
    });
    const missing = wanted.filter(
      (id) => !found.some((asset) => asset.id === id),
    );
    if (missing.length) {
      throw new BadRequestException(
        `assets ${missing.join(', ')} do not exist`,
      );
    }
  }

  /*
    this will delete a jurisdiction
  */
  async delete(jurisdictionId: string): Promise<SuccessDTO> {
    await this.findOrThrow(jurisdictionId);
    await this.prisma.jurisdictions.delete({
      where: {
        id: jurisdictionId,
      },
    });
    return {
      success: true,
    } as SuccessDTO;
  }

  /*
    this will either find a record or throw a customized error
  */
  async findOrThrow(jurisdictionId: string): Promise<boolean> {
    const jurisdiction = await this.prisma.jurisdictions.findFirst({
      where: {
        id: jurisdictionId,
      },
    });

    if (!jurisdiction) {
      throw new NotFoundException(
        `jurisdictionId ${jurisdictionId} was requested but not found`,
      );
    }

    return true;
  }
}
