import generalTranslations from "@bloom-housing/ui-components/src/locales/general.json"
import spanishTranslations from "@bloom-housing/ui-components/src/locales/es.json"
import chineseTranslations from "@bloom-housing/ui-components/src/locales/zh.json"
import vietnameseTranslations from "@bloom-housing/ui-components/src/locales/vi.json"
import tagalogTranslations from "@bloom-housing/ui-components/src/locales/tl.json"

import additionalGeneralTranslations from "../../page_content/locale_overrides/general.json"

/* eslint-disable @typescript-eslint/no-explicit-any */
export const translations = {
  general: generalTranslations,
  es: spanishTranslations,
  zh: chineseTranslations,
  vi: vietnameseTranslations,
  tl: tagalogTranslations,
} as Record<string, any>

export const overrideTranslations = {
  en: additionalGeneralTranslations,
} as Record<string, any>
/* eslint-enable @typescript-eslint/no-explicit-any */
