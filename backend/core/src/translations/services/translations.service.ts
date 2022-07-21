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
import * as lodash from "lodash"

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

    const pathsToFilter = [
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
      "accessibility",
      "amenities",
      "neighborhood",
      "petPolicy",
      "servicesOffered",
      "smokingPolicy",
      "unitAmenities",
    ]

    for (let i = 0; i < listing.events.length; i++) {
      pathsToFilter.push(`events[${i}].note`)
      pathsToFilter.push(`events[${i}].label`)
    }

    for (let i = 0; i < listing.listingMultiselectQuestions.length; i++) {
      pathsToFilter.push(`listingMultiselectQuestions[${i}].multiselectQuestion.text`)
      pathsToFilter.push(`listingMultiselectQuestions[${i}].multiselectQuestion.description`)
      pathsToFilter.push(`listingMultiselectQuestions[${i}].multiselectQuestion.subText`)
    }

    const listingPathsAndValues: { [key: string]: any } = {}
    for (const path of pathsToFilter) {
      const value = lodash.get(listing, path)
      if (value) {
        listingPathsAndValues[path] = lodash.get(listing, path)
      }
    }

    // Caching
    let persistedTranslatedValues
    persistedTranslatedValues = await this.getPersistedTranslatedValues(listing, language)

    if (
      Object.keys(listingPathsAndValues).length > 0 &&
      (!persistedTranslatedValues || persistedTranslatedValues.timestamp < listing.updatedAt)
    ) {
      const newTranslations = await this.googleTranslateService.fetch(
        Object.values(listingPathsAndValues),
        language
      )
      persistedTranslatedValues = await this.persistTranslatedValues(
        persistedTranslatedValues?.id,
        listing,
        language,
        newTranslations
      )
    }

    for (const [index, path] of Object.keys(listingPathsAndValues).entries()) {
      // accessing 0th index here because google translate service response returns multiple
      // possible arrays with results, we are interested in first
      lodash.set(listing, path, persistedTranslatedValues.translations[0][index])
    }

    return listing
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
