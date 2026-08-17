import generalTranslations from "@bloom-housing/shared-helpers/src/locales/general.json"
import spanishTranslations from "@bloom-housing/shared-helpers/src/locales/es.json"
import chineseTranslations from "@bloom-housing/shared-helpers/src/locales/zh.json"
import vietnameseTranslations from "@bloom-housing/shared-helpers/src/locales/vi.json"
import tagalogTranslations from "@bloom-housing/shared-helpers/src/locales/tl.json"
import arabicTranslations from "@bloom-housing/shared-helpers/src/locales/ar.json"
import bengaliTranslations from "@bloom-housing/shared-helpers/src/locales/bn.json"
import koreanTranslations from "@bloom-housing/shared-helpers/src/locales/ko.json"
import armenianTranslations from "@bloom-housing/shared-helpers/src/locales/hy.json"
import farsiTranslations from "@bloom-housing/shared-helpers/src/locales/fa.json"

import additionalGeneralTranslations from "../../page_content/locales/general.json"
import localeOverrides from "../../page_content/overrides/general.json"

import publicGeneralOverrides from "../../../public/page_content/locale_overrides/general.json"
import publicSpanishOverrides from "../../../public/page_content/locale_overrides/es.json"
import publicChineseOverrides from "../../../public/page_content/locale_overrides/zh.json"
import publicVietnameseOverrides from "../../../public/page_content/locale_overrides/vi.json"
import publicTagalogOverrides from "../../../public/page_content/locale_overrides/tl.json"
import publicArabicOverrides from "../../../public/page_content/locale_overrides/ar.json"
import publicBengaliOverrides from "../../../public/page_content/locale_overrides/bn.json"
import publicKoreanOverrides from "../../../public/page_content/locale_overrides/ko.json"
import publicArmenianOverrides from "../../../public/page_content/locale_overrides/hy.json"
import publicFarsiOverrides from "../../../public/page_content/locale_overrides/fa.json"

/* eslint-disable @typescript-eslint/no-explicit-any */
export const translations = {
  general: generalTranslations,
  es: spanishTranslations,
  zh: chineseTranslations,
  vi: vietnameseTranslations,
  tl: tagalogTranslations,
  ar: arabicTranslations,
  bn: bengaliTranslations,
  ko: koreanTranslations,
  hy: armenianTranslations,
  fa: farsiTranslations,
} as Record<string, any>

export const overrideTranslations = {
  en: { ...additionalGeneralTranslations, ...localeOverrides },
} as Record<string, any>

// What the public site layers over the shared file. The translation editor compares its public
// scope against this; the Partners portal itself never loads it.
export const publicOverrideTranslations = {
  en: publicGeneralOverrides,
  es: publicSpanishOverrides,
  zh: publicChineseOverrides,
  vi: publicVietnameseOverrides,
  tl: publicTagalogOverrides,
  ar: publicArabicOverrides,
  bn: publicBengaliOverrides,
  ko: publicKoreanOverrides,
  hy: publicArmenianOverrides,
  fa: publicFarsiOverrides,
} as Record<string, any>
/* eslint-enable @typescript-eslint/no-explicit-any */
