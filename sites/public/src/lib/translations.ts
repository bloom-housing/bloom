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

import featuresGeneralTranslations from "../../page_content/locale_overrides/features/general.json"
import featuresEsTranslations from "../../page_content/locale_overrides/features/es.json"
import featuresZhTranslations from "../../page_content/locale_overrides/features/zh.json"
import featuresViTranslations from "../../page_content/locale_overrides/features/vi.json"
import featuresTlTranslations from "../../page_content/locale_overrides/features/tl.json"
import featuresBnTranslations from "../../page_content/locale_overrides/features/bn.json"
import featuresArTranslations from "../../page_content/locale_overrides/features/ar.json"
import featuresKoTranslations from "../../page_content/locale_overrides/features/ko.json"
import featuresHyTranslations from "../../page_content/locale_overrides/features/hy.json"
import featuresFaTranslations from "../../page_content/locale_overrides/features/fa.json"

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
  en: { ...additionalGeneralTranslations, ...featuresGeneralTranslations },
  es: { ...additionalSpanishTranslations, ...featuresEsTranslations },
  zh: { ...additionalChineseTranslations, ...featuresZhTranslations },
  vi: { ...additionalVietnameseTranslations, ...featuresViTranslations },
  tl: { ...additionalTagalogTranslations, ...featuresTlTranslations },
  bn: { ...additionalBengaliTranslations, ...featuresBnTranslations },
  ar: { ...additionalArabicTranslations, ...featuresArTranslations },
  ko: { ...additionalKoreanTranslations, ...featuresKoTranslations },
  hy: { ...additionalArmenianTranslations, ...featuresHyTranslations },
  fa: { ...additionalFarsiTranslations, ...featuresFaTranslations },
} as Record<string, any>
