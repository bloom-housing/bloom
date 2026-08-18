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
import { useRawTranslations } from "./hooks"
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
    activeJurisdictionId,
    activeLanguage,
    languageOptions,
    scope,
    englishOverrideKeys,
    overrides: read.data,
    loading: read.loading,
    error: read.error,
    cacheKey: read.cacheKey,
  }
}
