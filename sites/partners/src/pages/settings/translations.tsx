import React, { useContext, useMemo, useState } from "react"
import { useRouter } from "next/router"
import Head from "next/head"
import { Select, t } from "@bloom-housing/ui-components"
import { AgTable, useAgTable } from "@bloom-housing/ui-components/ag-table"
import { AuthContext } from "@bloom-housing/shared-helpers"
import {
  FeatureFlagEnum,
  LanguagesEnum,
  SiteEnum,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { flattenTranslations } from "@bloom-housing/shared-helpers/src/utilities/flattenTranslations"
import { TabView } from "@bloom-housing/shared-helpers/src/views/components/TabView"
import { ColDef, ColGroupDef } from "ag-grid-community"
import Layout from "../../layouts"
import { NavigationHeader } from "../../components/shared/NavigationHeader"
import {
  getEnabledSettingsTabCount,
  getSettingsTabs,
  SettingsIndexEnum,
} from "../../components/settings/SettingsViewHelpers"
import { useRawTranslations } from "../../lib/hooks"
import { translations } from "../../lib/translations"
import {
  buildTranslationRows,
  effectiveValue,
  TranslationEditorRow,
} from "../../lib/translationEditor"

const SettingsTranslations = () => {
  const router = useRouter()
  const tableOptions = useAgTable()
  const { profile, doJurisdictionsHaveFeatureFlagOn } = useContext(AuthContext)

  const enableProperties = doJurisdictionsHaveFeatureFlagOn(FeatureFlagEnum.enableProperties)
  const atLeastOneJurisdictionEnablesPreferences = !doJurisdictionsHaveFeatureFlagOn(
    FeatureFlagEnum.disableListingPreferences,
    null,
    true
  )
  const v2Preferences = doJurisdictionsHaveFeatureFlagOn(FeatureFlagEnum.enableV2MSQ)
  const enableAgencies = doJurisdictionsHaveFeatureFlagOn(FeatureFlagEnum.enableHousingAdvocate)
  const enableTranslations = doJurisdictionsHaveFeatureFlagOn(FeatureFlagEnum.enableDbDrivenContent)
  const settingsTabsFeatureFlags = {
    enablePreferences: atLeastOneJurisdictionEnablesPreferences,
    enableProperties,
    enableAgencies,
    enableTranslations,
  }

  // Editing is limited to the admin role, which spans every jurisdiction in the system.
  if (!enableTranslations || !profile?.userRoles?.isAdmin) {
    void router.push("/unauthorized")
  }

  const jurisdictions = useMemo(() => profile?.jurisdictions ?? [], [profile?.jurisdictions])
  const [jurisdictionId, setJurisdictionId] = useState("")
  const [language, setLanguage] = useState<LanguagesEnum>(LanguagesEnum.en)

  const selectedJurisdiction = jurisdictions.find(
    (jurisdiction) => jurisdiction.id === (jurisdictionId || jurisdictions[0]?.id)
  )
  const activeJurisdictionId = selectedJurisdiction?.id ?? ""

  const { data: overrides, loading } = useRawTranslations({
    jurisdictionId: activeJurisdictionId,
    site: SiteEnum.public,
    language,
  })

  const rows = useMemo(
    () =>
      buildTranslationRows({
        englishBase: flattenTranslations(translations.general),
        // English is the base itself, so it has no separate language file to layer.
        languageBase:
          language === LanguagesEnum.en ? undefined : flattenTranslations(translations[language]),
        overrides: overrides ?? [],
      }),
    [language, overrides]
  )

  // Every row is already in the browser, so search and pagination are local rather than a refetch.
  const search = (tableOptions.filter.filterValue ?? "").trim().toLowerCase()
  const filteredRows = useMemo(() => {
    if (!search) return rows
    return rows.filter((row) =>
      [row.key, row.baseValue, row.overrideValue].some((value) =>
        (value ?? "").toLowerCase().includes(search)
      )
    )
  }, [rows, search])

  const perPage = tableOptions.pagination.itemsPerPage
  const currentPage = tableOptions.pagination.currentPage
  const pagedRows = useMemo(
    () => filteredRows.slice((currentPage - 1) * perPage, currentPage * perPage),
    [filteredRows, currentPage, perPage]
  )

  const columnDefs: (ColDef | ColGroupDef)[] = useMemo(
    () => [
      {
        headerName: t("translations.keyPath"),
        field: "key",
        minWidth: 220,
        flex: 1,
      },
      {
        headerName: t("translations.baseValue"),
        field: "baseValue",
        minWidth: 220,
        flex: 2,
        valueFormatter: ({ value }) => (value === null ? t("t.none") : value),
      },
      {
        headerName: t("translations.currentValue"),
        minWidth: 220,
        flex: 2,
        valueGetter: ({ data }: { data: TranslationEditorRow }) => effectiveValue(data) ?? "",
      },
      {
        headerName: t("t.status"),
        minWidth: 140,
        valueGetter: ({ data }: { data: TranslationEditorRow }) => {
          if (data.overrideValue === null) return t("translations.statusFallback")
          return data.stale ? t("translations.statusStale") : t("translations.statusOverridden")
        },
      },
    ],
    []
  )

  const languageOptions = useMemo(
    () =>
      (selectedJurisdiction?.languages ?? [LanguagesEnum.en]).map((value) => ({
        value,
        label: t(`languages.${value}`),
      })),
    [selectedJurisdiction?.languages]
  )

  return (
    <Layout>
      <Head>
        <title>
          {`${t("t.settings")} - ${t("settings.translations")} - ${t("nav.siteTitlePartners")}`}
        </title>
      </Head>
      <NavigationHeader className="relative" title={t("t.settings")} />
      <TabView
        hideTabs={getEnabledSettingsTabCount(settingsTabsFeatureFlags) <= 1}
        tabs={getSettingsTabs(
          SettingsIndexEnum.translations,
          v2Preferences,
          settingsTabsFeatureFlags
        )}
      >
        <AgTable
          id="translations-table"
          pagination={{
            perPage,
            setPerPage: tableOptions.pagination.setItemsPerPage,
            currentPage,
            setCurrentPage: tableOptions.pagination.setCurrentPage,
          }}
          data={{
            items: pagedRows,
            loading,
            totalItems: filteredRows.length,
            totalPages: Math.max(Math.ceil(filteredRows.length / perPage), 1),
          }}
          config={{
            columns: columnDefs,
            totalItemsLabel: t("translations.total"),
          }}
          search={{
            setSearch: tableOptions.filter.setFilterValue,
          }}
          headerContent={
            <div className="flex gap-4">
              {jurisdictions.length > 1 && (
                <Select
                  id="translationsJurisdiction"
                  name="translationsJurisdiction"
                  label={t("t.jurisdiction")}
                  defaultValue={activeJurisdictionId}
                  options={jurisdictions.map((jurisdiction) => ({
                    value: jurisdiction.id,
                    label: jurisdiction.name,
                  }))}
                  inputProps={{
                    onChange: (event: React.ChangeEvent<HTMLSelectElement>) => {
                      setJurisdictionId(event.target.value)
                      tableOptions.pagination.setCurrentPage(1)
                    },
                  }}
                />
              )}
              <Select
                id="translationsLanguage"
                name="translationsLanguage"
                label={t("t.language")}
                defaultValue={language}
                options={languageOptions}
                inputProps={{
                  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => {
                    setLanguage(event.target.value as LanguagesEnum)
                    tableOptions.pagination.setCurrentPage(1)
                  },
                }}
              />
            </div>
          }
        />
      </TabView>
    </Layout>
  )
}

export default SettingsTranslations
