import generalTranslations from "@bloom-housing/shared-helpers/src/locales/general.json"
import spanishTranslations from "@bloom-housing/shared-helpers/src/locales/es.json"
import chineseTranslations from "@bloom-housing/shared-helpers/src/locales/zh.json"
import vietnameseTranslations from "@bloom-housing/shared-helpers/src/locales/vi.json"
import tagalogTranslations from "@bloom-housing/shared-helpers/src/locales/tl.json"
import bengaliTranslations from "@bloom-housing/shared-helpers/src/locales/bn.json"
import arabicTranslations from "@bloom-housing/shared-helpers/src/locales/ar.json"
import koreanTranslations from "@bloom-housing/shared-helpers/src/locales/ko.json"
import armenianTranslations from "@bloom-housing/shared-helpers/src/locales/hy.json"
import farsiTranslations from "@bloom-housing/shared-helpers/src/locales/fa.json"

import additionalGeneralTranslations from "../../page_content/locale_overrides/general.json"

export const translations = {
  general: generalTranslations,
  es: spanishTranslations,
  zh: chineseTranslations,
  vi: vietnameseTranslations,
  tl: tagalogTranslations,
  bn: bengaliTranslations,
  ar: arabicTranslations,
  ko: koreanTranslations,
  hy: armenianTranslations,
  fa: farsiTranslations,
} as Record<string, any>

export const overrideTranslations = { en: additionalGeneralTranslations } as Record<string, any>
