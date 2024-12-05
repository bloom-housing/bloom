import { Injectable } from '@nestjs/common';
import { LanguagesEnum, Translations } from '@prisma/client';
import { PrismaService } from './prisma.service';
import { Listing } from '../dtos/listings/listing.dto';
import { GoogleTranslateService } from './google-translate.service';
import * as lodash from 'lodash';

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

    if (listing.listingMultiselectQuestions) {
      listing.listingMultiselectQuestions.map((multiselectQuestion, index) => {
        multiselectQuestion.multiselectQuestions.untranslatedText =
          multiselectQuestion.multiselectQuestions?.text;
        multiselectQuestion.multiselectQuestions.untranslatedOptOutText =
          multiselectQuestion.multiselectQuestions?.optOutText;
        pathsToFilter[
          `listingMultiselectQuestions[${index}].multiselectQuestions.text`
        ] = multiselectQuestion.multiselectQuestions?.text;
        pathsToFilter[
          `listingMultiselectQuestions[${index}].multiselectQuestions.description`
        ] = multiselectQuestion.multiselectQuestions?.description;
        pathsToFilter[
          `listingMultiselectQuestions[${index}].multiselectQuestions.subText`
        ] = multiselectQuestion.multiselectQuestions?.subText;
        pathsToFilter[
          `listingMultiselectQuestions[${index}].multiselectQuestions.optOutText`
        ] = multiselectQuestion.multiselectQuestions?.optOutText;
        multiselectQuestion.multiselectQuestions?.options?.map(
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
        );
      });
    }

    if (listing.includeCommunityDisclaimer) {
      pathsToFilter[`communityDisclaimerTitle`] =
        listing.communityDisclaimerTitle;
      pathsToFilter[`communityDisclaimerDescription`] =
        listing.communityDisclaimerDescription;
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
