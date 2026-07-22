import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  LanguagesEnum,
  Prisma,
  SiteEnum,
  Translations,
  TranslationOrigin,
} from '@prisma/client';
import * as lodash from 'lodash';
import { GoogleTranslateService } from './google-translate.service';
import { PrismaService } from './prisma.service';
import { PermissionService } from './permission.service';
import { Listing } from '../dtos/listings/listing.dto';
import { User } from '../dtos/users/user.dto';
import { SuccessDTO } from '../dtos/shared/success.dto';
import { TranslationUpdate } from '../dtos/translations/translation-update.dto';
import { TranslationRawKey } from '../dtos/translations/translation-raw-key.dto';
import { TranslationOverrideRow } from '../dtos/translations/translation-override-row.dto';
import { flattenTranslationRows } from '../utilities/translation-merge';
import { sourceHash } from '../utilities/translation-source-hash';
import { permissionActions } from '../enums/permissions/permission-actions-enum';

@Injectable()
export class TranslationService {
  constructor(
    private prisma: PrismaService,
    private readonly googleTranslateService: GoogleTranslateService,
    private readonly permissionService: PermissionService,
  ) {}

  public async getMergedTranslations(
    jurisdictionId: string | null,
    language?: LanguagesEnum,
  ) {
    const useLanguage = !!language && language !== LanguagesEnum.en;
    const languages = this.languagesToRead(language);

    const rows = await this.prisma.translationStrings.findMany({
      where: {
        site: null,
        language: { in: languages },
        OR: jurisdictionId
          ? [{ jurisdictionId: null }, { jurisdictionId }]
          : [{ jurisdictionId: null }],
      },
      select: {
        jurisdictionId: true,
        language: true,
        key: true,
        value: true,
      },
    });

    // Until the base rows are backfilled (#6519), read the legacy blob. Keyed on the
    // generic-default scope so a migrated environment never falls back per scope.
    const migrated = rows.some(
      (row) => row.jurisdictionId === null && row.language === LanguagesEnum.en,
    );
    if (!migrated) {
      return this.getLegacyMergedTranslations(jurisdictionId, language);
    }

    const scopeRows = (id: string | null, lang: LanguagesEnum) =>
      rows.filter((row) => row.jurisdictionId === id && row.language === lang);

    return flattenTranslationRows([
      scopeRows(null, LanguagesEnum.en),
      ...(useLanguage ? [scopeRows(null, language)] : []),
      ...(jurisdictionId ? [scopeRows(jurisdictionId, LanguagesEnum.en)] : []),
      ...(jurisdictionId && useLanguage
        ? [scopeRows(jurisdictionId, language)]
        : []),
    ]);
  }

  private async getLegacyMergedTranslations(
    jurisdictionId: string | null,
    language?: LanguagesEnum,
  ) {
    const useLanguage = !!language && language !== LanguagesEnum.en;

    const [genericDefault, generic, jurisdictionalDefault, jurisdictional] =
      await Promise.all([
        this.getTranslationByLanguageAndJurisdiction(LanguagesEnum.en, null),
        useLanguage
          ? this.getTranslationByLanguageAndJurisdiction(language, null)
          : Promise.resolve(null),
        jurisdictionId
          ? this.getTranslationByLanguageAndJurisdiction(
              LanguagesEnum.en,
              jurisdictionId,
            )
          : Promise.resolve(null),
        jurisdictionId && useLanguage
          ? this.getTranslationByLanguageAndJurisdiction(
              language,
              jurisdictionId,
            )
          : Promise.resolve(null),
      ]);

    return lodash.merge(
      {},
      genericDefault?.translations,
      generic?.translations,
      jurisdictionalDefault?.translations,
      jurisdictional?.translations,
    );
  }

  private languagesToRead(language?: LanguagesEnum): LanguagesEnum[] {
    return !!language && language !== LanguagesEnum.en
      ? [LanguagesEnum.en, language]
      : [LanguagesEnum.en];
  }

  public async getJurisdictionOverrides(
    jurisdictionId: string | null,
    language: LanguagesEnum,
    site: SiteEnum,
  ): Promise<Record<string, string>> {
    const useLanguage = !!language && language !== LanguagesEnum.en;
    const languages = this.languagesToRead(language);

    const rows = await this.prisma.translationStrings.findMany({
      where: { jurisdictionId, site, language: { in: languages } },
      select: { language: true, key: true, value: true },
    });

    const byLanguage = (lang: LanguagesEnum) =>
      rows.filter((row) => row.language === lang);

    return flattenTranslationRows([
      byLanguage(LanguagesEnum.en),
      ...(useLanguage ? [byLanguage(language)] : []),
    ]);
  }

  public async getJurisdictionOverridesById(
    jurisdictionId: string,
    language: LanguagesEnum,
    site: SiteEnum,
  ): Promise<Record<string, string>> {
    await this.resolveJurisdictionId({ id: jurisdictionId }, jurisdictionId);
    return this.getJurisdictionOverrides(jurisdictionId, language, site);
  }

  public async getJurisdictionOverridesByName(
    jurisdictionName: string,
    language: LanguagesEnum,
    site: SiteEnum,
  ): Promise<Record<string, string>> {
    const jurisdictionId = await this.resolveJurisdictionId(
      { name: jurisdictionName },
      jurisdictionName,
    );
    return this.getJurisdictionOverrides(jurisdictionId, language, site);
  }

  // Resolves and asserts a jurisdiction exists, matching the 404 the other jurisdiction
  // reads return for an unknown id or name.
  private async resolveJurisdictionId(
    where: Prisma.JurisdictionsWhereInput,
    label: string,
  ): Promise<string> {
    const jurisdiction = await this.prisma.jurisdictions.findFirst({
      where,
      select: { id: true },
    });
    if (!jurisdiction) {
      throw new NotFoundException(
        `jurisdiction ${label} was requested but not found`,
      );
    }
    return jurisdiction.id;
  }

  // Admin CRUD over a jurisdiction's per-key overrides (Partners translation editor).

  public async listRawOverrides(
    jurisdictionId: string,
    user: User,
  ): Promise<TranslationOverrideRow[]> {
    await this.permissionService.canOrThrow(
      user,
      'translation',
      permissionActions.read,
      { jurisdictionId },
    );
    return this.prisma.translationStrings.findMany({
      where: { jurisdictionId },
      select: {
        key: true,
        site: true,
        language: true,
        value: true,
        updatedAt: true,
        origin: true,
      },
      orderBy: [{ site: 'asc' }, { language: 'asc' }, { key: 'asc' }],
    });
  }

  public async getRawOverrides(
    jurisdictionId: string,
    site: SiteEnum,
    language: LanguagesEnum,
    user: User,
  ): Promise<TranslationRawKey[]> {
    await this.permissionService.canOrThrow(
      user,
      'translation',
      permissionActions.read,
      { jurisdictionId },
    );

    const rows = await this.prisma.translationStrings.findMany({
      where: { jurisdictionId, site, language },
      select: {
        key: true,
        value: true,
        updatedAt: true,
        origin: true,
        sourceHash: true,
      },
    });

    const englishHashes =
      language === LanguagesEnum.en
        ? new Map<string, string>()
        : await this.englishSourceHashes(
            jurisdictionId,
            site,
            rows.map((row) => row.key),
          );

    return rows.map((row) => {
      const currentEnglish = englishHashes.get(row.key);
      return {
        key: row.key,
        value: row.value,
        updatedAt: row.updatedAt,
        origin: row.origin,
        // Stale when the English source recorded at save time no longer matches the
        // current English source.
        stale:
          language !== LanguagesEnum.en &&
          row.sourceHash != null &&
          currentEnglish != null &&
          row.sourceHash !== currentEnglish,
      };
    });
  }

  public async updateOverrides(
    jurisdictionId: string,
    site: SiteEnum,
    language: LanguagesEnum,
    dto: TranslationUpdate,
    user: User,
  ): Promise<SuccessDTO> {
    await this.permissionService.canOrThrow(
      user,
      'translation',
      permissionActions.update,
      { jurisdictionId },
    );

    const isEnglish = language === LanguagesEnum.en;
    const englishHashes = isEnglish
      ? new Map<string, string>()
      : await this.englishSourceHashes(
          jurisdictionId,
          site,
          dto.edits.map((edit) => edit.key),
        );

    // A stale per-key lock is reported without discarding the non-conflicting edits, so the
    // batch is intentionally not wrapped in a transaction.
    const conflicts: string[] = [];
    for (const edit of dto.edits) {
      const where = { jurisdictionId, language, site, key: edit.key };
      const data = {
        value: edit.value,
        origin: TranslationOrigin.human,
        sourceHash: isEnglish ? null : englishHashes.get(edit.key) ?? null,
      };

      if (edit.lastUpdatedAt) {
        const result = await this.prisma.translationStrings.updateMany({
          where: { ...where, updatedAt: edit.lastUpdatedAt },
          data,
        });
        if (result.count === 0) {
          if (await this.prisma.translationStrings.findFirst({ where })) {
            conflicts.push(edit.key);
          } else {
            await this.prisma.translationStrings.create({
              data: { ...where, ...data },
            });
          }
        }
      } else {
        try {
          await this.prisma.translationStrings.create({
            data: { ...where, ...data },
          });
        } catch (error) {
          if (
            error instanceof Prisma.PrismaClientKnownRequestError &&
            error.code === 'P2002'
          ) {
            conflicts.push(edit.key);
          } else {
            throw error;
          }
        }
      }
    }

    if (conflicts.length) {
      throw new ConflictException({
        message: 'translationConflict',
        conflicts,
      });
    }
    return { success: true };
  }

  public async deleteOverride(
    jurisdictionId: string,
    site: SiteEnum,
    language: LanguagesEnum,
    key: string,
    user: User,
  ): Promise<SuccessDTO> {
    await this.permissionService.canOrThrow(
      user,
      'translation',
      permissionActions.delete,
      { jurisdictionId },
    );
    await this.prisma.translationStrings.deleteMany({
      where: { jurisdictionId, language, site, key },
    });
    return { success: true };
  }

  // English source hash per key, resolved by the same precedence the reads use:
  // (jurisdictionId, en, site) then (null, en, site) then (null, en, null).
  private async englishSourceHashes(
    jurisdictionId: string | null,
    site: SiteEnum | null,
    keys: string[],
  ): Promise<Map<string, string>> {
    if (!keys.length) {
      return new Map();
    }
    const rows = await this.prisma.translationStrings.findMany({
      where: {
        language: LanguagesEnum.en,
        key: { in: keys },
        OR: [
          { jurisdictionId, site },
          { jurisdictionId: null, site },
          { jurisdictionId: null, site: null },
        ],
      },
      select: { jurisdictionId: true, site: true, key: true, value: true },
    });

    const rank = (row: {
      jurisdictionId: string | null;
      site: SiteEnum | null;
    }) =>
      row.jurisdictionId === jurisdictionId && row.site === site
        ? 0
        : row.jurisdictionId === null && row.site === site
        ? 1
        : 2;

    const best = new Map<string, { rank: number; value: string }>();
    for (const row of rows) {
      const current = best.get(row.key);
      const rowRank = rank(row);
      if (!current || rowRank < current.rank) {
        best.set(row.key, { rank: rowRank, value: row.value });
      }
    }

    const hashes = new Map<string, string>();
    for (const [key, { value }] of best) {
      hashes.set(key, sourceHash(value));
    }
    return hashes;
  }

  public async getTranslationByLanguageAndJurisdiction(
    language: LanguagesEnum,
    jurisdictionId: string | null,
  ): Promise<Translations | null> {
    return await this.prisma.translations.findFirst({
      where: { AND: [{ language: language }, { jurisdictionId }] },
    });
  }

  public async translateListing(listing: Listing, language: LanguagesEnum) {
    if (!this.googleTranslateService.isConfigured()) {
      console.warn(
        'listing translation requested, but google translate service is not configured',
      );
      return;
    }

    const pathsToFilter = {
      accessibility: listing.accessibility,
      amenities: listing.amenities,
      applicationDropOffAddressOfficeHours:
        listing.applicationDropOffAddressOfficeHours,
      applicationPickUpAddressOfficeHours:
        listing.applicationPickUpAddressOfficeHours,
      costsNotIncluded: listing.costsNotIncluded,
      creditHistory: listing.creditHistory,
      criminalBackground: listing.criminalBackground,
      depositHelperText: listing.depositHelperText,
      depositMax: listing.depositMax,
      depositMin: listing.depositMin,
      leasingAgentOfficeHours: listing.leasingAgentOfficeHours,
      neighborhood: listing.neighborhood,
      petPolicy: listing.petPolicy,
      programRules: listing.programRules,
      rentalAssistance: listing.rentalAssistance,
      rentalHistory: listing.rentalHistory,
      requiredDocuments: listing.requiredDocuments,
      reservedCommunityDescription: listing.reservedCommunityDescription,
      servicesOffered: listing.servicesOffered,
      smokingPolicy: listing.smokingPolicy,
      specialNotes: listing.specialNotes,
      unitAmenities: listing.unitAmenities,
      whatToExpect: listing.whatToExpect,
    };

    if (listing.listingNeighborhoodAmenities) {
      Object.keys(listing.listingNeighborhoodAmenities).forEach((field) => {
        pathsToFilter[`listingNeighborhoodAmenities.${field}`] =
          listing.listingNeighborhoodAmenities[field];
      });
    }

    if (listing.referralApplication?.externalReference) {
      pathsToFilter[`referralApplication.externalReference`] =
        listing.referralApplication?.externalReference;
    }

    listing.listingEvents?.forEach((_, index) => {
      pathsToFilter[`listingEvents[${index}].note`] =
        listing.listingEvents[index].note;
      pathsToFilter[`listingEvents[${index}].label`] =
        listing.listingEvents[index].label;
    });

    if (listing.listingImages) {
      listing.listingImages.forEach((image, index) => {
        if (image.description) {
          pathsToFilter[`listingImages[${index}].description`] =
            image.description;
        }
      });
    }

    if (listing.includeCommunityDisclaimer) {
      pathsToFilter[`communityDisclaimerTitle`] =
        listing.communityDisclaimerTitle;
      pathsToFilter[`communityDisclaimerDescription`] =
        listing.communityDisclaimerDescription;
    }

    if (listing.property?.description) {
      pathsToFilter[`property.description`] = listing.property.description;
    }

    if (listing.property?.urlTitle) {
      pathsToFilter[`property.urlTitle`] = listing.property.urlTitle;
    }

    if (listing.listingMultiselectQuestions) {
      listing.listingMultiselectQuestions.map((multiselectQuestion, index) => {
        multiselectQuestion.multiselectQuestions.untranslatedName =
          multiselectQuestion.multiselectQuestions?.name;

        pathsToFilter[
          `listingMultiselectQuestions[${index}].multiselectQuestions.name`
        ] = multiselectQuestion.multiselectQuestions?.name;
        pathsToFilter[
          `listingMultiselectQuestions[${index}].multiselectQuestions.description`
        ] = multiselectQuestion.multiselectQuestions?.description;
        pathsToFilter[
          `listingMultiselectQuestions[${index}].multiselectQuestions.subText`
        ] = multiselectQuestion.multiselectQuestions?.subText;

        multiselectQuestion.multiselectQuestions?.multiselectOptions?.map(
          (multiselectOption, optionIndex) => {
            multiselectOption.untranslatedName = multiselectOption.name;
            pathsToFilter[
              `listingMultiselectQuestions[${index}].multiselectQuestions.multiselectOptions[${optionIndex}].name`
            ] = multiselectOption.name;
            pathsToFilter[
              `listingMultiselectQuestions[${index}].multiselectQuestions.multiselectOptions[${optionIndex}].description`
            ] = multiselectOption.description;
          },
        );

        // TODO: Remove after V2MSQ
        multiselectQuestion.multiselectQuestions.untranslatedText =
          multiselectQuestion.multiselectQuestions?.text;
        multiselectQuestion.multiselectQuestions.untranslatedOptOutText =
          multiselectQuestion.multiselectQuestions?.optOutText;
        pathsToFilter[
          `listingMultiselectQuestions[${index}].multiselectQuestions.text`
        ] = multiselectQuestion.multiselectQuestions?.text;
        multiselectQuestion.multiselectQuestions?.options?.map(
          (multiselectOption, optionIndex) => {
            multiselectOption.untranslatedText = multiselectOption.text;
            pathsToFilter[
              `listingMultiselectQuestions[${index}].multiselectQuestions.options[${optionIndex}].text`
            ] = multiselectOption.text;
            pathsToFilter[
              `listingMultiselectQuestions[${index}].multiselectQuestions.options[${optionIndex}].description`
            ] = multiselectOption.description;
          },
        );
        pathsToFilter[
          `listingMultiselectQuestions[${index}].multiselectQuestions.optOutText`
        ] = multiselectQuestion.multiselectQuestions?.optOutText;
      });
    }

    const persistedTranslationsFromDB = await this.getPersistedTranslatedValues(
      listing,
      language,
    );
    let translatedValue;

    // Remove all null or undefined values
    const cleanedPaths = {};
    Object.entries(pathsToFilter).forEach(([key, value]) => {
      if (value) {
        cleanedPaths[key] = value;
      }
    });

    if (persistedTranslationsFromDB) {
      translatedValue = persistedTranslationsFromDB.translations;
    } else {
      translatedValue = await this.googleTranslateService.fetch(
        Object.values(cleanedPaths),
        language,
      );
      await this.persistNewTranslatedValues(listing, language, translatedValue);
    }

    if (translatedValue) {
      [...Object.keys(cleanedPaths).values()].forEach((path, index) => {
        if (translatedValue[0][index]) {
          lodash.set(listing, path, translatedValue[0][index]);
        }
      });
    }

    return listing;
  }

  private async getPersistedTranslatedValues(
    listing: Listing,
    language: LanguagesEnum,
  ) {
    const existingTranslations =
      await this.prisma.generatedListingTranslations.findFirst({
        where: {
          listingId: listing.id,
          language: language,
        },
      });

    //determine when listing or associated preferences most recently changed
    let mostRecentUpdate = listing.contentUpdatedAt;
    listing.listingMultiselectQuestions?.forEach((multiselectObj) => {
      const multiselectUpdatedAt =
        multiselectObj.multiselectQuestions?.updatedAt;
      if (mostRecentUpdate < multiselectUpdatedAt) {
        mostRecentUpdate = multiselectUpdatedAt;
      }
    });
    //refresh translations if application content changed since translation creation
    if (
      existingTranslations &&
      existingTranslations.createdAt < mostRecentUpdate
    ) {
      await this.prisma.generatedListingTranslations.delete({
        where: {
          id: existingTranslations.id,
        },
      });
      return undefined;
    }

    return existingTranslations;
  }

  private async persistNewTranslatedValues(
    listing: Listing,
    language: LanguagesEnum,
    translatedValues: any,
  ) {
    return this.prisma.generatedListingTranslations.create({
      data: {
        jurisdictionId: listing.jurisdictions.id,
        listingId: listing.id,
        language: language,
        translations: translatedValues,
        timestamp: new Date(),
      },
    });
  }
}
