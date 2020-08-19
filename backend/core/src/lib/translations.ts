import { Request } from "express"
import { BaseEntity } from "typeorm"

export const getPreferredLanguage = (req: Request) => req.acceptsLanguages()[0]

export class TranslationEntity extends BaseEntity {
  languageCode: string
}

export class TranslateableEntity extends BaseEntity {
  translations: TranslationEntity[]
}

export function translateEntity<T extends TranslateableEntity>(
  entity: T,
  languagePreferences: string[] = []
): T {
  const availableLanguages = entity.translations.map((t) => t.languageCode)

  // languagePreferences is an array of preferred language codes in order of preference. Find the most
  // preferred language that matches available translations. If nothing is found, we'll default to no translations.
  const languageToTranslate = languagePreferences.find((l) => {
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
  }
  delete entity.translations
  return entity
}
