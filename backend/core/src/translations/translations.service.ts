import { AbstractServiceFactory } from "../shared/services/abstract-service"
import { Injectable, NotFoundException } from "@nestjs/common"
import { Translation } from "./entities/translation.entity"
import { Translate } from "@google-cloud/translate/build/src/v2"
import { TranslationCreateDto, TranslationUpdateDto } from "./dto/translation.dto"
import { Language } from "../shared/types/language-enum"
import { Listing } from "../listings/entities/listing.entity"
import { isEmpty } from "../libs/miscLib"

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
    /**
     * check for necessary keys before continuing
     */
    const { GOOGLE_API_ID, GOOGLE_API_EMAIL, GOOGLE_API_KEY } = process.env
    if (!GOOGLE_API_ID || !GOOGLE_API_EMAIL || !GOOGLE_API_KEY) return

    // Get key-value pairs from listing to be translated
    const translations = this.getTranslations(listing)
    if (!translations?.values || (translations?.values && translations.values.length === 0)) return
    const translatedValues = await this.translateService().translate(translations.values, {
      from: Language.en,
      to: language,
    })
    // Attach translated values to the listing
    translations.keys.forEach((key, index) => {
      this.setValue(listing, key, translatedValues[0][index])
    })
  }

  private translateService = () => {
    return new Translate({
      credentials: {
        private_key: process.env.GOOGLE_API_KEY.replace(/\\n/gm, "\n"),
        client_email: process.env.GOOGLE_API_EMAIL,
      },
      projectId: process.env.GOOGLE_API_ID,
    })
  }
  // Sets value to the object by string path. eg. "property.accessibility" or "preferences.0.title"
  private setValue = (object, path, value) =>
    path
      .split(".")
      .reduce(
        (currentObject, currentPath, index) =>
          (currentObject[currentPath] =
            path.split(".").length === ++index ? value : currentObject[currentPath] || {}),
        object
      )

  // Returns not null key-values pairs also from nested properties
  private findData = (keys, object, results, parent = null) => {
    keys.forEach((key) => {
      if (typeof key === "string") {
        if (Array.isArray(object)) {
          object.forEach((value, i) => {
            if (isEmpty(value[key]) === false) {
              results.keys.push(parent ? [parent, i, key].join(".") : key)
              results.values.push(value[key])
            }
          })
        } else {
          console.log("object[key] = ", object[key])
          if (object[key] && isEmpty(object[key]) === false) {
            results.keys.push(parent ? [parent, key].join(".") : key)
            results.values.push(object[key])
          }
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
  private getTranslations = (listing: Listing) => {
    const result = { keys: [], values: [] }
    this.findData(TRANSLATION_KEYS, listing, result)
    return result
  }
}
