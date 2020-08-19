import { Request } from "express"
import { BaseEntity } from "typeorm"

export const getPreferredLanguage = (req: Request) => req.acceptsLanguages()[0]

export class TranslationEntity extends BaseEntity {
  languageCode: string
}

export class TranslateableEntity extends BaseEntity {
  translations: TranslationEntity[]
}

export function translateEntity<T extends TranslateableEntity>(entity: T): T {
  const [translation] = entity.translations
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
