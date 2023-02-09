import generalTranslations from "../../../detroit-ui-components/src/locales/general.json"
import spanishTranslations from "../../../detroit-ui-components/src/locales/es.json"
import arabicTranslations from "../../../detroit-ui-components/src/locales/ar.json"
import bengaliTranslations from "../../../detroit-ui-components/src/locales/bn.json"

import additionalGeneralTranslations from "../page_content/locale_overrides/general.json"
import additionalSpanishTranslations from "../page_content/locale_overrides/es.json"
import additionalArabicTranslations from "../page_content/locale_overrides/ar.json"
import additionalBengaliTranslations from "../page_content/locale_overrides/bn.json"

export const translations = {
  general: generalTranslations,
  es: spanishTranslations,
  ar: arabicTranslations,
  bn: bengaliTranslations,
} as Record<string, any>

export const overrideTranslations = {
  en: additionalGeneralTranslations,
  es: additionalSpanishTranslations,
  ar: additionalArabicTranslations,
  bn: additionalBengaliTranslations,
} as Record<string, any>
