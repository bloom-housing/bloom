import generalOverrides from "../../../public/page_content/locale_overrides/general.json"
import spanishOverrides from "../../../public/page_content/locale_overrides/es.json"
import chineseOverrides from "../../../public/page_content/locale_overrides/zh.json"
import vietnameseOverrides from "../../../public/page_content/locale_overrides/vi.json"
import tagalogOverrides from "../../../public/page_content/locale_overrides/tl.json"
import arabicOverrides from "../../../public/page_content/locale_overrides/ar.json"
import bengaliOverrides from "../../../public/page_content/locale_overrides/bn.json"
import koreanOverrides from "../../../public/page_content/locale_overrides/ko.json"
import armenianOverrides from "../../../public/page_content/locale_overrides/hy.json"
import farsiOverrides from "../../../public/page_content/locale_overrides/fa.json"

/**
 * What the public site layers over the shared locale files, mirroring `overrideTranslations` in
 * `sites/public/src/lib/translations.ts`. The translation editor compares its public scope against
 * this, so the base it shows matches what the public site renders.
 *
 * This lives apart from `./translations` so it stays out of the chunk `_app` loads on every page.
 * A fork adding a locale to the public site has to add it here too; the test asserts the pairing.
 */
/* eslint-disable @typescript-eslint/no-explicit-any */
export const publicOverrideTranslations = {
  en: generalOverrides,
  es: spanishOverrides,
  zh: chineseOverrides,
  vi: vietnameseOverrides,
  tl: tagalogOverrides,
  ar: arabicOverrides,
  bn: bengaliOverrides,
  ko: koreanOverrides,
  hy: armenianOverrides,
  fa: farsiOverrides,
} as Record<string, any>
/* eslint-enable @typescript-eslint/no-explicit-any */
