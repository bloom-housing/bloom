/* eslint-disable @typescript-eslint/no-explicit-any */
import generalTranslations from "@bloom-housing/ui-components/src/locales/general.json"
import spanishTranslations from "@bloom-housing/ui-components/src/locales/es.json"
import chineseTranslations from "@bloom-housing/ui-components/src/locales/zh.json"
import vietnameseTranslations from "@bloom-housing/ui-components/src/locales/vi.json"

import additionalGeneralTranslations from "../page_content/locale_overrides/general.json"
import additionalSpanishTranslations from "../page_content/locale_overrides/es.json"
import additionalChineseTranslations from "../page_content/locale_overrides/zh.json"
import additionalViatnameseTranslations from "../page_content/locale_overrides/vi.json"

export const translations = {
  general: generalTranslations,
  es: spanishTranslations,
  zh: chineseTranslations,
  vi: vietnameseTranslations,
} as Record<string, any>

export const overrideTranslations = {
  en: additionalGeneralTranslations,
  es: additionalSpanishTranslations,
  zh: additionalChineseTranslations,
  vi: additionalViatnameseTranslations,
} as Record<string, any>
