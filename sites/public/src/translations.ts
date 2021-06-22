import generalTranslations from "@bloom-housing/ui-components/src/locales/general.json"
import spanishTranslations from "@bloom-housing/ui-components/src/locales/es.json"
import chineseTranslations from "@bloom-housing/ui-components/src/locales/zh.json"
import vietnameseTranslations from "@bloom-housing/ui-components/src/locales/vi.json"

export const translations = {
  general: generalTranslations,
  es: spanishTranslations,
  zh: chineseTranslations,
  vi: vietnameseTranslations,
} as Record<string, any>

export const overrideTranslations = {
  //  zh: additionalChineseTranslations
} as Record<string, any>
