import { useContext, useMemo, useState } from "react"
import { useRouter } from "next/router"
import { t } from "@bloom-housing/ui-components"
import { AuthContext } from "@bloom-housing/shared-helpers"
import {
  Jurisdiction,
  LanguagesEnum,
  SiteEnum,
  TranslationRawKey,
  TranslationUpdate,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { useEmailBaseTranslations, useRawTranslations } from "./hooks"
import { overrideTranslations } from "./translations"
import { publicOverrideTranslations } from "./publicTranslations"

// Stands in for a jurisdiction in the select. The row it writes has none, so it is the value an
// email with no jurisdiction uses, and what a jurisdiction falls back to.
export const NO_JURISDICTION = "none"

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
  const [site, setSiteState] = useState<SiteEnum>(SiteEnum.public)

  // Email opens on the generic layer, which is the one that reaches every jurisdiction and the only
  // one an email with no jurisdiction reads.
  const setSite = (next: SiteEnum) => {
    setSiteState(next)
    if (next === SiteEnum.email) {
      setJurisdictionId(NO_JURISDICTION)
    }
  }

  // Partners rows are always global. Email rows have a generic layer too,
  // for users who belong to more than one jurisdiction
  const isGlobal =
    site === SiteEnum.partners || (site === SiteEnum.email && jurisdictionId === NO_JURISDICTION)

  const selectedJurisdiction = jurisdictions.find(
    (jurisdiction) =>
      jurisdiction.id ===
      ((jurisdictionId !== NO_JURISDICTION && jurisdictionId) || jurisdictions[0]?.id)
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
            rows: { type: "global" as const, site },
            baseOverrides: overrideTranslations,
            save: (body: TranslationUpdate) =>
              translationsService.updateRawGlobalTranslations({
                site,
                language: activeLanguage,
                body,
              }),
            revert: (key: string) =>
              translationsService.deleteRawGlobalTranslation({
                site,
                language: activeLanguage,
                key,
              }),
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

  // A jurisdiction's email rows sit on top of the generic ones at send time, so the generic values
  // are part of the base the editor compares against.
  const genericEmailScope = useMemo(() => ({ type: "global" as const, site: SiteEnum.email }), [])
  const scopedEmail = ready && isEmail && !isGlobal
  const genericLanguage = useRawTranslations(scopedEmail ? genericEmailScope : null, activeLanguage)
  const genericEnglish = useRawTranslations(
    scopedEmail && activeLanguage !== LanguagesEnum.en ? genericEmailScope : null,
    LanguagesEnum.en
  )

  const emailBase = useMemo(() => {
    if (!isEmail) return undefined

    const flatten = (rows?: TranslationRawKey[]) =>
      Object.fromEntries((rows ?? []).map((row) => [row.key, row.value]))
    const english = activeLanguage === LanguagesEnum.en ? genericLanguage.data : genericEnglish.data

    return {
      english: emailEnglishBase.data && {
        ...emailEnglishBase.data,
        ...flatten(english),
      },
      language: emailLanguageBase.data && {
        ...emailLanguageBase.data,
        ...flatten(genericLanguage.data),
      },
    }
  }, [
    activeLanguage,
    emailEnglishBase.data,
    emailLanguageBase.data,
    genericEnglish.data,
    genericLanguage.data,
    isEmail,
  ])

  // The email base is fetched rather than bundled, so it can be absent where the other scopes' is
  // not. Callers must not treat that as an empty base.
  const baseReady =
    !isEmail ||
    (!!emailBase?.english &&
      (activeLanguage === LanguagesEnum.en || !!emailBase?.language) &&
      (!scopedEmail || (!genericLanguage.loading && !genericEnglish.loading)))

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
    emailBase,
    baseReady,
    overrides: read.data,
    loading: read.loading || emailEnglishBase.loading || emailLanguageBase.loading,
    error: read.error ?? emailEnglishBase.error ?? emailLanguageBase.error,
    cacheKey: read.cacheKey,
  }
}
