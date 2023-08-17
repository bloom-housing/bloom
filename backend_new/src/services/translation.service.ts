import { Injectable } from '@nestjs/common';
import { LanguagesEnum, Translations } from '@prisma/client';
import { PrismaService } from './prisma.service';
import { Listing } from '../dtos/listings/listing.dto';
import { GoogleTranslateService } from './google-translate.service';
import * as lodash from 'lodash';
import { Jurisdiction } from '../dtos/jurisdictions/jurisdiction.dto';

@Injectable()
export class TranslationService {
  constructor(
    private prisma: PrismaService,
    private readonly googleTranslateService: GoogleTranslateService,
  ) {}

  public async getMergedTranslations(
    jurisdictionId: string | null,
    language?: LanguagesEnum,
  ) {
    let jurisdictionalTranslations: Promise<Translations | null>,
      genericTranslations: Promise<Translations | null>,
      jurisdictionalDefaultTranslations: Promise<Translations | null>;

    if (language && language !== LanguagesEnum.en) {
      if (jurisdictionId) {
        jurisdictionalTranslations =
          this.getTranslationByLanguageAndJurisdictionOrDefaultEn(
            language,
            jurisdictionId,
          );
      }
      genericTranslations =
        this.getTranslationByLanguageAndJurisdictionOrDefaultEn(language, null);
    }

    if (jurisdictionId) {
      jurisdictionalDefaultTranslations =
        this.getTranslationByLanguageAndJurisdictionOrDefaultEn(
          LanguagesEnum.en,
          jurisdictionId,
        );
    }

    const genericDefaultTranslations =
      this.getTranslationByLanguageAndJurisdictionOrDefaultEn(
        LanguagesEnum.en,
        null,
      );

    const [genericDefault, generic, jurisdictionalDefault, jurisdictional] =
      await Promise.all([
        genericDefaultTranslations,
        genericTranslations,
        jurisdictionalDefaultTranslations,
        jurisdictionalTranslations,
      ]);
    // Deep merge
    const translations = lodash.merge(
      genericDefault?.translations,
      generic?.translations,
      jurisdictionalDefault?.translations,
      jurisdictional?.translations,
    );

    return translations;
  }

  public async getTranslationByLanguageAndJurisdictionOrDefaultEn(
    language: LanguagesEnum,
    jurisdictionId: string | null,
  ) {
    let translations = await this.prisma.translations.findFirst({
      where: { AND: [{ language: language }, { jurisdictionId }] },
    });

    if (translations === null && language !== LanguagesEnum.en) {
      console.warn(
        `Fetching translations for ${language} failed on jurisdiction ${jurisdictionId}, defaulting to english.`,
      );
      translations = await this.prisma.translations.findFirst({
        where: { AND: [{ language: LanguagesEnum.en }, { jurisdictionId }] },
      });
    }
    return translations;
  }

  public async translateListing(listing: Listing, language: LanguagesEnum) {
    if (!this.googleTranslateService.isConfigured()) {
      console.warn(
        'listing translation requested, but google translate service is not configured',
      );
      return;
    }

    const pathsToFilter = {
      applicationPickUpAddressOfficeHours:
        listing.applicationPickUpAddressOfficeHours,
      costsNotIncluded: listing.costsNotIncluded,
      creditHistory: listing.creditHistory,
      criminalBackground: listing.criminalBackground,
      programRules: listing.programRules,
      rentalAssistance: listing.rentalAssistance,
      rentalHistory: listing.rentalHistory,
      requiredDocuments: listing.requiredDocuments,
      specialNotes: listing.specialNotes,
      whatToExpect: listing.whatToExpect,
      accessibility: listing.accessibility,
      amenities: listing.amenities,
      neighborhood: listing.neighborhood,
      petPolicy: listing.petPolicy,
      servicesOffered: listing.servicesOffered,
      smokingPolicy: listing.smokingPolicy,
      unitAmenities: listing.unitAmenities,
    };

    listing.listingEvents?.forEach((_, index) => {
      pathsToFilter[`listingEvents[${index}].note`] =
        listing.listingEvents[index].note;
      pathsToFilter[`listingEvents[${index}].label`] =
        listing.listingEvents[index].label;
    });

    if (listing.listingMultiselectQuestions) {
      listing.listingMultiselectQuestions.map((multiselectQuestion, index) => {
        multiselectQuestion.multiselectQuestions.untranslatedText =
          multiselectQuestion.multiselectQuestions.text;
        multiselectQuestion.multiselectQuestions.untranslatedOptOutText =
          multiselectQuestion.multiselectQuestions.optOutText;
        pathsToFilter[
          `listingMultiselectQuestions[${index}].multiselectQuestions.text`
        ] = multiselectQuestion.multiselectQuestions.text;
        pathsToFilter[
          `listingMultiselectQuestions[${index}].multiselectQuestions.description`
        ] = multiselectQuestion.multiselectQuestions.description;
        pathsToFilter[
          `listingMultiselectQuestions[${index}].multiselectQuestions.subText`
        ] = multiselectQuestion.multiselectQuestions.subText;
        pathsToFilter[
          `listingMultiselectQuestions[${index}].multiselectQuestions.optOutText`
        ] = multiselectQuestion.multiselectQuestions.optOutText;
        // TODO: should we translate links?
        multiselectQuestion.multiselectQuestions.options?.map(
          (multiselectOption, optionIndex) => {
            multiselectOption.untranslatedText = multiselectOption.text;
            pathsToFilter[
              `listingMultiselectQuestions[${index}].multiselectQuestions.options[${optionIndex}].text`
            ] = multiselectOption.text;
            pathsToFilter[
              `listingMultiselectQuestions[${index}].multiselectQuestions.options[${optionIndex}].description`
            ] = multiselectOption.description;
            pathsToFilter[
              `listingMultiselectQuestions[${index}].multiselectQuestions.options[${optionIndex}].description`
            ] = multiselectOption.description;
          },
          // TODO: should we translate links?
        );
      });
    }

    const persistedTranslationsFromDB = await this.getPersistedTranslatedValues(
      listing,
      language,
    );
    let translatedValue;

    if (persistedTranslationsFromDB) {
      translatedValue = persistedTranslationsFromDB.translations;
    } else {
      translatedValue = await this.googleTranslateService.fetch(
        Object.values(pathsToFilter),
        language,
      );
      await this.persistNewTranslatedValues(listing, language, translatedValue);
    }

    if (translatedValue) {
      [...Object.keys(pathsToFilter).values()].forEach((path, index) => {
        lodash.set(listing, path, translatedValue[0][index]);
      });
    }

    return listing;
  }

  private async getPersistedTranslatedValues(
    listing: Listing,
    language: LanguagesEnum,
  ) {
    return this.prisma.generatedListingTranslations.findFirst({
      where: { listingId: listing.id, language: language },
    });
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
