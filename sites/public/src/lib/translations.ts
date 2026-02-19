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
import additionalSpanishTranslations from "../../page_content/locale_overrides/es.json"
import additionalChineseTranslations from "../../page_content/locale_overrides/zh.json"
import additionalVietnameseTranslations from "../../page_content/locale_overrides/vi.json"
import additionalTagalogTranslations from "../../page_content/locale_overrides/tl.json"
import additionalBengaliTranslations from "../../page_content/locale_overrides/bn.json"
import additionalArabicTranslations from "../../page_content/locale_overrides/ar.json"
import additionalKoreanTranslations from "../../page_content/locale_overrides/ko.json"
import additionalArmenianTranslations from "../../page_content/locale_overrides/hy.json"
import additionalFarsiTranslations from "../../page_content/locale_overrides/fa.json"

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

export const overrideTranslations = {
  en: additionalGeneralTranslations,
  es: additionalSpanishTranslations,
  zh: additionalChineseTranslations,
  vi: additionalVietnameseTranslations,
  tl: additionalTagalogTranslations,
  bn: additionalBengaliTranslations,
  ar: additionalArabicTranslations,
  ko: additionalKoreanTranslations,
  hy: additionalArmenianTranslations,
  fa: additionalFarsiTranslations,
} as Record<string, any>
