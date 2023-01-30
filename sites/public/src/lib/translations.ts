import generalTranslations from "@bloom-housing/shared-helpers/src/locales/general.json"
import spanishTranslations from "@bloom-housing/shared-helpers/src/locales/es.json"
import chineseTranslations from "@bloom-housing/shared-helpers/src/locales/zh.json"
import vietnameseTranslations from "@bloom-housing/shared-helpers/src/locales/vi.json"
import tagalogTranslations from "@bloom-housing/shared-helpers/src/locales/tl.json"

import additionalGeneralTranslations from "../page_content/locale_overrides/general.json"

export const translations = {
  general: generalTranslations,
  es: spanishTranslations,
  zh: chineseTranslations,
  vi: vietnameseTranslations,
  tl: tagalogTranslations,
} as Record<string, any>

export const overrideTranslations = { en: additionalGeneralTranslations } as Record<string, any>

export const jurisdictionTranslations = async () => {
  const [english, spanish, chinese, vietnamese, tagalog] = await Promise.allSettled(
    ["general", "es", "zh", "vi", "tl"].map(async (locale) => {
      return import(
        `../page_content/jurisdiction_overrides/${process.env.jurisdictionName
          .toLowerCase()
          .replace(" ", "_")}/locale_overrides/${locale}.json`
      )
    })
  )

  return {
    en: english.status === "fulfilled" ? english.value : null,
    es: spanish.status === "fulfilled" ? spanish.value : null,
    zh: chinese.status === "fulfilled" ? chinese.value : null,
    vi: vietnamese.status === "fulfilled" ? vietnamese.value : null,
    tl: tagalog.status === "fulfilled" ? tagalog.value : null,
  }
}
