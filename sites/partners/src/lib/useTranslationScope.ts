import { useContext, useMemo, useState } from "react"
import { useRouter } from "next/router"
import { t } from "@bloom-housing/ui-components"
import { AuthContext } from "@bloom-housing/shared-helpers"
import {
  Jurisdiction,
  LanguagesEnum,
  SiteEnum,
  TranslationUpdate,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { useEmailBaseTranslations, useRawTranslations } from "./hooks"
import { overrideTranslations } from "./translations"
import { publicOverrideTranslations } from "./publicTranslations"

export const useTranslationScope = ({
  jurisdictions,
  enabled,
}: {
  jurisdictions: Jurisdiction[]
  enabled: boolean
}) => {
  const router = useRouter()
  const { translationsService } = useContext(AuthContext)

  const [jurisdictionId, setJurisdictionId] = useState("")
  const [language, setLanguage] = useState<LanguagesEnum>(LanguagesEnum.en)
  const [site, setSite] = useState<SiteEnum>(SiteEnum.public)

  // The Partners rows are global
  const isGlobal = site === SiteEnum.partners

  const selectedJurisdiction = jurisdictions.find(
    (jurisdiction) => jurisdiction.id === (jurisdictionId || jurisdictions[0]?.id)
  )
  const activeJurisdictionId = selectedJurisdiction?.id ?? ""

  const partnersLanguages = useMemo(() => {
    const supported = (router.locales ?? []).filter((locale): locale is LanguagesEnum =>
      Object.values(LanguagesEnum).includes(locale as LanguagesEnum)
    )
    return supported.length ? supported : [LanguagesEnum.en]
  }, [router.locales])

  const languageOptions = useMemo(
    () =>
      (isGlobal ? partnersLanguages : selectedJurisdiction?.languages ?? [LanguagesEnum.en]).map(
        (value) => ({
          value,
          label: t(`languages.${value}`),
        })
      ),
    [isGlobal, partnersLanguages, selectedJurisdiction?.languages]
  )

  // Languages are per jurisdiction, so switching to one that does not offer the selected language
  // has to fall back rather than keep editing a language the jurisdiction has no option for.
  const activeLanguage = languageOptions.some((option) => option.value === language)
    ? language
    : languageOptions[0]?.value ?? LanguagesEnum.en

  const scope = useMemo(
    () =>
      isGlobal
        ? {
            rows: { type: "global" as const },
            baseOverrides: overrideTranslations,
            save: (body: TranslationUpdate) =>
              translationsService.updateRawPartnersTranslations({ language: activeLanguage, body }),
            revert: (key: string) =>
              translationsService.deleteRawPartnersTranslation({ language: activeLanguage, key }),
          }
        : {
            rows: {
              type: "jurisdiction" as const,
              jurisdictionId: activeJurisdictionId,
              site,
            },
            baseOverrides: publicOverrideTranslations,
            save: (body: TranslationUpdate) =>
              translationsService.updateRawTranslations({
                jurisdictionId: activeJurisdictionId,
                site,
                language: activeLanguage,
                body,
              }),
            revert: (key: string) =>
              translationsService.deleteRawTranslation({
                jurisdictionId: activeJurisdictionId,
                site,
                language: activeLanguage,
                key,
              }),
          },
    [activeJurisdictionId, activeLanguage, isGlobal, site, translationsService]
  )

  const ready = enabled && (isGlobal || !!activeJurisdictionId)

  const isEmail = site === SiteEnum.email
  const emailEnglishBase = useEmailBaseTranslations(ready && isEmail ? LanguagesEnum.en : null)
  const emailLanguageBase = useEmailBaseTranslations(
    ready && isEmail && activeLanguage !== LanguagesEnum.en ? activeLanguage : null
  )

  const read = useRawTranslations(ready ? scope.rows : null, activeLanguage)

  const { data: englishOverrides } = useRawTranslations(
    ready && activeLanguage !== LanguagesEnum.en ? scope.rows : null,
    LanguagesEnum.en
  )
  const englishOverrideKeys = useMemo(
    () => new Set((englishOverrides ?? []).map((override) => override.key)),
    [englishOverrides]
  )

  return {
    site,
    setSite,
    setJurisdictionId,
    setLanguage,
    isGlobal,
    isEmail,
    activeJurisdictionId,
    activeLanguage,
    languageOptions,
    scope,
    englishOverrideKeys,
    emailBase: isEmail
      ? { english: emailEnglishBase.data, language: emailLanguageBase.data }
      : undefined,
    overrides: read.data,
    loading: read.loading || emailEnglishBase.loading || emailLanguageBase.loading,
    error: read.error ?? emailEnglishBase.error ?? emailLanguageBase.error,
    cacheKey: read.cacheKey,
  }
}
