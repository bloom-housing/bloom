import { Injectable, NotFoundException } from "@nestjs/common"
import { AbstractServiceFactory } from "../../shared/services/abstract-service"
import { Translation } from "../entities/translation.entity"
import { TranslationCreateDto, TranslationUpdateDto } from "../dto/translation.dto"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"
import { Language } from "../../shared/types/language-enum"
import { Listing } from "../../listings/entities/listing.entity"
import { GoogleTranslateService } from "./google-translate.service"
import { GeneratedListingTranslation } from "../entities/generated-listing-translation.entity"
import { isEmpty } from "../../shared/utils/is-empty"

const TRANSLATION_KEYS = [
  "applicationPickUpAddressOfficeHours",
  "costsNotIncluded",
  "creditHistory",
  "criminalBackground",
  "programRules",
  "rentalAssistance",
  "rentalHistory",
  "requiredDocuments",
  "specialNotes",
  "whatToExpect",
  {
    events: ["note", "label"],
    property: [
      "accessibility",
      "amenities",
      "neighborhood",
      "petPolicy",
      "servicesOffered",
      "smokingPolicy",
      "unitAmenities",
    ],
    whatToExpect: ["applicantsWillBeContacted", "allInfoWillBeVerified", "bePreparedIfChosen"],
    preferences: ["title", "description", "subtitle"],
  },
]

@Injectable()
export class TranslationsService extends AbstractServiceFactory<
  Translation,
  TranslationCreateDto,
  TranslationUpdateDto
>(Translation) {
  constructor(
    @InjectRepository(GeneratedListingTranslation)
    private readonly generatedListingTranslationRepository: Repository<GeneratedListingTranslation>,
    private readonly googleTranslateService: GoogleTranslateService
  ) {
    super()
  }

  public async getTranslationByLanguageAndJurisdictionOrDefaultEn(
    language: Language,
    jurisdictionId: string | null
  ) {
    try {
      return await this.findOne({
        where: {
          language,
          ...(jurisdictionId && {
            jurisdiction: {
              id: jurisdictionId,
            },
          }),
          ...(!jurisdictionId && {
            jurisdiction: null,
          }),
        },
      })
    } catch (e) {
      if (e instanceof NotFoundException && language != Language.en) {
        console.warn(`Fetching translations for ${language} failed, defaulting to english.`)
        return this.findOne({
          where: {
            language: Language.en,
            ...(jurisdictionId && {
              jurisdiction: {
                id: jurisdictionId,
              },
            }),
            ...(!jurisdictionId && {
              jurisdiction: null,
            }),
          },
        })
      } else {
        throw e
      }
    }
  }

  public async translateListing(listing: Listing, language: Language) {
    if (!this.googleTranslateService.isConfigured()) {
      console.warn("listing translation requested, but google translate service is not configured")
      return
    }
    const keysAndValuesToBeTranslated = this.fetchKeysAndValuesToBeTranslated(listing)
    /**
     * TODO: update findData and setValue to accommodate new preference structure, so we're not mapping.
     * This is a patch as I don't want to alter findData or setValue under a small time frame. The updates to those functions should include tests, which don't currently exist :(
     */
    if (listing.listingPreferences) {
      listing.listingPreferences.forEach((val) => {
        keysAndValuesToBeTranslated.keys.push(
          "preferences.title",
          "preferences.description",
          "preferences.subtitle"
        )
        keysAndValuesToBeTranslated.values.push(
          val.preference.title,
          val.preference.description,
          val.preference.subtitle
        )
      })
    }
    if (
      !keysAndValuesToBeTranslated?.values ||
      (keysAndValuesToBeTranslated?.values && keysAndValuesToBeTranslated.values.length === 0)
    ) {
      return
    }

    let persistedTranslatedValues
    persistedTranslatedValues = await this.getPersistedTranslatedValues(listing, language)

    if (!persistedTranslatedValues || persistedTranslatedValues.timestamp < listing.updatedAt) {
      const newTranslations = await this.googleTranslateService.fetch(
        keysAndValuesToBeTranslated.values,
        language
      )
      persistedTranslatedValues = await this.persistTranslatedValues(
        persistedTranslatedValues?.id,
        listing,
        language,
        newTranslations
      )
    }
    /**
     * TODO: update findData and setValue to accommodate new preference structure, so we're not mapping.
     * This is a patch as I don't want to alter findData or setValue under a small time frame. The updates to those functions should include tests, which don't currently exist :(
     */
    let preferenceIndex = 0
    keysAndValuesToBeTranslated.keys.forEach((key, index) => {
      if (key === "preferences.title") {
        listing.listingPreferences[preferenceIndex].preference.title =
          persistedTranslatedValues.translations[0][index]
      } else if (key === "preferences.description") {
        listing.listingPreferences[preferenceIndex].preference.description =
          persistedTranslatedValues.translations[0][index]
      } else if (key === "preferences.subtitle") {
        listing.listingPreferences[preferenceIndex].preference.subtitle =
          persistedTranslatedValues.translations[0][index]
        preferenceIndex++
      } else {
        this.setValue(listing, key, persistedTranslatedValues.translations[0][index])
      }
    })
    return listing
  }

  // Sets value to the object by string path. eg. "property.accessibility" or "preferences.0.title"
  private setValue(object, path, value) {
    return path
      .split(".")
      .reduce(
        (currentObject, currentPath, index) =>
          (currentObject[currentPath] =
            path.split(".").length === ++index ? value : currentObject[currentPath] || {}),
        object
      )
  }

  // Returns not null key-values pairs also from nested properties
  private findData(translationKeys, object: Listing, results, parent = null) {
    translationKeys.forEach((key) => {
      if (typeof key === "string") {
        if (object[key] && isEmpty(object[key]) === false) {
          results.keys.push(parent ? [parent, key].join(".") : key)
          results.values.push(object[key])
        }
        return
      } else {
        for (const k in key) {
          if (object[k]) {
            this.findData(key[k], object[k], results, k)
          }
        }
      }
    })
  }

  private fetchKeysAndValuesToBeTranslated(listing: Listing) {
    const result = { keys: [], values: [] }
    this.findData(TRANSLATION_KEYS, listing, result)
    return result
  }

  private async persistTranslatedValues(
    id: string | undefined,
    listing: Listing,
    language: Language,
    translatedValues: any
  ) {
    return await this.generatedListingTranslationRepository.save({
      id,
      listingId: listing.id,
      jurisdictionId: listing.jurisdiction.id,
      language,
      translations: translatedValues,
      timestamp: listing.updatedAt,
    })
  }

  private async getPersistedTranslatedValues(listing: Listing, language: Language) {
    return this.generatedListingTranslationRepository.findOne({
      where: {
        jurisdictionId: listing.jurisdiction.id,
        language,
        listingId: listing.id,
      },
    })
  }
}
