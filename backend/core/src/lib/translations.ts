import { Response } from "express"
import { BaseEntity } from "typeorm"

export class TranslationEntity extends BaseEntity {
  languageCode: string
}

/**
 * This function adds "generic" (non locale specific) versions of languages after the locale-specific version in the
 * language preference list if applicable.
 *
 * ["es", "en-US", "fr"] => ["es", "en-US", "en", "fr"]
 * @param languages
 */
export function appendGenericVersionsOfLanguages(languages) {
  return languages.map((l) => (l.indexOf("-") === -1 ? l : [l, l.split("-")[0]])).flat()
}

export class TranslateableEntity extends BaseEntity {
  translations: TranslationEntity[]

  // Language of the output object
  languageCode: string
}

export function translateEntity<T extends TranslateableEntity>(
  entity: T,
  languagePreferences: string[] = []
): T {
  const availableLanguages = entity.translations.map((t) => t.languageCode)

  // languagePreferences is an array of preferred language codes in order of preference. Find the most
  // preferred language that matches available translations. If nothing is found, we'll default to no translations.
  const languageToTranslate = appendGenericVersionsOfLanguages(languagePreferences).find((l) => {
    const language = l.toLowerCase()
    return language === "en" || availableLanguages.includes(l)
  })

  const translation =
    languageToTranslate &&
    entity.translations.find(({ languageCode }) => languageCode === languageToTranslate)

  if (translation) {
    Object.keys(translation)
      .filter(
        (key) =>
          key !== "languageCode" && key in entity && translation[key] && translation[key].length > 0
      )
      .forEach((key) => (entity[key] = translation[key]))
    entity.languageCode = translation.languageCode
  }
  delete entity.translations
  return entity
}

export function setContentLanguageHeader(res: Response, languages: string[]) {
  // Create a comma-separated list of unique languages
  const headerLanguages = [...new Set(languages.filter((l) => l))].join(", ")
  if (headerLanguages.length > 0) {
    res.setHeader("Content-Language", headerLanguages)
  }
}
