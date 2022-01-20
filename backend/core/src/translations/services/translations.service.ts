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
export class TranslationsService extends AbstractServiceFactory<Translation,
  TranslationCreateDto,
  TranslationUpdateDto>(Translation) {

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
              id: jurisdictionId
            }
          }),
          ...(!jurisdictionId && {
            jurisdiction: null
          })
        }
      })
    } catch (e) {
      if (e instanceof NotFoundException && language != Language.en) {
        console.warn(`Fetching translations for ${language} failed, defaulting to english.`)
        return this.findOne({
          where: {
            language: Language.en,
            ...(jurisdictionId && {
              jurisdiction: {
                id: jurisdictionId
              }
            }),
            ...(!jurisdictionId && {
              jurisdiction: null
            })
          }
        })
      } else {
        throw e
      }
    }
  }

  private logUnmatchedPatterns(patterns: Array<RegExp>, patternsMatchMap: { [key: string]: true }) {
    if (Object.keys(patternsMatchMap).length != patterns.length) {
      const a = new Set(patterns.map(pattern => pattern.toString()))
      const b = new Set(Object.keys(patternsMatchMap))
      let a_minus_b = new Set([...a].filter(x => !b.has(x)))
      console.warn("some patterns did not match any object key while translating a listing")
      console.warn(a_minus_b)
    }
  }

  public async translateListing(listing: Listing, language: Language) {
    if (!this.googleTranslateService.isConfigured()) {
      console.warn("listing translation requested, but google translate service is not configured")
      return
    }

    /*
      Convert a listing object to the following flattened format:
        ...
        status: 'active',
        reviewOrderType: 'lottery',
        'applicationMethods[0].id': 'b8e3b1e3-ace8-486f-9adb-ba041afc0e30',
        'applicationMethods[0].type': 'Internal',
        'applicationMethods[0].label': 'Label',
        'image.id': '9237bc00-1ac2-4a3b-a05e-6b59e294d091',
        'image.fileId': 'fileid',
        'image.label': 'test_label',
        'events[0].id': '6bcb16b5-d1f0-428b-986c-fecf78f1bb5b',
        'events[0].type': 'openHouse',
        ...
      which is basically a [path:value] dict.
     */

    const flattenedListingFull = this.flatten(listing)

    /*
      Filter out flattened paths matching hardcoded path regexps.
     */
    const pathPatternsToFilter = [
      /applicationPickUpAddressOfficeHours/g,
      /costsNotIncluded/g,
      /creditHistory/g,
      /criminalBackground/g,
      /programRules/g,
      /rentalAssistance/g,
      /rentalHistory/g,
      /requiredDocuments/g,
      /specialNotes/g,
      /whatToExpect/g,
      /events\[\d+\]\.note/g,
      /events\[\d+\]\.label/g,
      /property\.accessibility/g,
      /property\.amenities/g,
      /property\.neighborhood/g,
      /property\.petPolicy/g,
      /property\.servicesOffered/g,
      /property\.smokingPolicy/g,
      /property\.unitAmenities/g,
      /whatToExpect\.applicantsWillBeContacted/g,
      /whatToExpect\.allInfoWillBeVerified/g,
      /whatToExpect\.bePreparedIfChosen/g,
      /listingPreferences\[\d+\]\.preference.title/g,
      /listingPreferences\[\d+\]\.preference.description/g,
      /listingPreferences\[\d+\]\.preference.subtitle/g
    ]

    const regexpMatchedFlattenedListing: { [key: string]: any } = {}
    const debugPathPatternsMatchedMap: { [key: string]: true } = {}
    for (const path of Object.keys(flattenedListingFull)) {
      for (const pathPatternRegexp of pathPatternsToFilter) {
        if (path.match(pathPatternRegexp)) {
          regexpMatchedFlattenedListing[path] = flattenedListingFull[path]
          debugPathPatternsMatchedMap[pathPatternRegexp.toString()] = true
          break
        }
      }
    }

    this.logUnmatchedPatterns(pathPatternsToFilter, debugPathPatternsMatchedMap)

    // Caching
    let persistedTranslatedValues
    persistedTranslatedValues = await this.getPersistedTranslatedValues(listing, language)

    if (!persistedTranslatedValues || persistedTranslatedValues.timestamp < listing.updatedAt) {
      const newTranslations = await this.googleTranslateService.fetch(
        Object.values(regexpMatchedFlattenedListing),
        language
      )
      persistedTranslatedValues = await this.persistTranslatedValues(
        persistedTranslatedValues?.id,
        listing,
        language,
        newTranslations
      )
    }

    /*
      Paths created earlier are compatible with lodash.set
      Response array returned by translation service has the same values order as regexpMatchedFlattenedListing
      So here we can simply reassign them by array index value
     */
    for (const [index, path] of Object.keys(regexpMatchedFlattenedListing).entries()) {
      // accessing 0th index here because google translate service response returns multiple
      // possible arrays with results, we are interested in first
      lodash.set(listing, path, persistedTranslatedValues.translations[0][index])
    }

    return listing
  }

  private _flatten(obj, prefix, result) {
    if (!obj) {
      return result
    } else if (typeof obj === "string" || typeof obj === "number") {
      result[prefix] = obj
    } else if (obj instanceof Array) {
      for (const [index, item] of obj.entries()) {
        this._flatten(item, prefix + "[" + index + "]", result)
      }
    } else if (typeof obj === "object") {
      for (const [key, value] of Object.entries(obj)) {
        this._flatten(value, prefix + "." + key, result)
      }
    }
    return result
  }

  private flatten(obj) {
    const result = {}
    for (const [key, value] of Object.entries(obj)) {
      this._flatten(value, key, result)
    }
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
      timestamp: listing.updatedAt
    })
  }

  private async getPersistedTranslatedValues(listing: Listing, language: Language) {
    return this.generatedListingTranslationRepository.findOne({
      where: {
        jurisdictionId: listing.jurisdiction.id,
        language,
        listingId: listing.id
      }
    })
  }
}
