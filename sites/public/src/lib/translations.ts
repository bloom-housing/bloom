import generalTranslations from "@bloom-housing/shared-helpers/src/locales/general.json"
import spanishTranslations from "@bloom-housing/shared-helpers/src/locales/es.json"
import chineseTranslations from "@bloom-housing/shared-helpers/src/locales/zh.json"
import vietnameseTranslations from "@bloom-housing/shared-helpers/src/locales/vi.json"
import tagalogTranslations from "@bloom-housing/shared-helpers/src/locales/tl.json"
import bengaliTranslations from "@bloom-housing/shared-helpers/src/locales/bn.json"
import arabicTranslations from "@bloom-housing/shared-helpers/src/locales/ar.json"

import additionalGeneralTranslations from "../../page_content/locale_overrides/general.json"
import additionalSpanishTranslations from "../../page_content/locale_overrides/es.json"
import additionalBengaliTranslations from "../../page_content/locale_overrides/bn.json"

export const translations = {
  general: generalTranslations,
  es: spanishTranslations,
  zh: chineseTranslations,
  vi: vietnameseTranslations,
  tl: tagalogTranslations,
  bn: bengaliTranslations,
  ar: arabicTranslations,
} as Record<string, any>

export const overrideTranslations = {
  en: additionalGeneralTranslations,
  es: additionalSpanishTranslations,
  bn: additionalBengaliTranslations,
} as Record<string, any>
