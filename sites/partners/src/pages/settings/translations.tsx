import React, { useContext, useEffect, useMemo, useState } from "react"
import { useRouter } from "next/router"
import Head from "next/head"
import { Select, t, useMutate } from "@bloom-housing/ui-components"
import { AgTable, useAgTable } from "@bloom-housing/ui-components/ag-table"
import { Button } from "@bloom-housing/ui-seeds"
import { useSWRConfig } from "swr"
import { AuthContext, MessageContext } from "@bloom-housing/shared-helpers"
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
  buildEdits,
  buildTranslationRows,
  conflictKeysFrom,
  editsForKeys,
  effectiveValue,
  isChanged,
  TranslationEditorRow,
} from "../../lib/translationEditor"
import {
  ConflictChoice,
  TranslationConflictDialog,
} from "../../components/settings/TranslationConflictDialog"

const SettingsTranslations = () => {
  const router = useRouter()
  const tableOptions = useAgTable()
  const { mutate } = useSWRConfig()
  const { addToast } = useContext(MessageContext)
  const { mutate: saveOverrides, isLoading: isSaving } = useMutate()
  const { mutate: revertOverride, isLoading: isReverting } = useMutate()
  const { profile, translationsService, doJurisdictionsHaveFeatureFlagOn } = useContext(AuthContext)

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

  const {
    data: overrides,
    loading,
    cacheKey,
  } = useRawTranslations({
    jurisdictionId: activeJurisdictionId,
    site: SiteEnum.public,
    language,
  })

  // Values the admin has typed but not saved, keyed by translation key.
  const [editedValues, setEditedValues] = useState<Record<string, string>>({})
  const [revertKey, setRevertKey] = useState<string | null>(null)
  // Keys a save could not write because someone changed them first.
  const [conflictKeys, setConflictKeys] = useState<string[]>([])
  const hasUnsavedChanges = Object.keys(editedValues).length > 0

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
        editable: true,
        // Many values are full paragraphs, so the single-line editor is not enough.
        cellEditor: "agLargeTextCellEditor",
        cellEditorParams: { maxLength: 5000 },
        valueGetter: ({ data }: { data: TranslationEditorRow }) =>
          editedValues[data.key] ?? effectiveValue(data) ?? "",
        // ag-grid has no grid-level change callback through AgTable, so the setter is where an
        // edit is captured. Returning true tells the grid the value was accepted.
        valueSetter: ({ data, newValue }: { data: TranslationEditorRow; newValue: string }) => {
          const value = newValue ?? ""
          setEditedValues((previous) => {
            const next = { ...previous }
            if (isChanged(data, value)) {
              next[data.key] = value
            } else {
              delete next[data.key]
            }
            return next
          })
          return true
        },
      },
      {
        headerName: t("t.status"),
        minWidth: 140,
        valueGetter: ({ data }: { data: TranslationEditorRow }) => {
          if (editedValues[data.key] !== undefined) return t("translations.statusEdited")
          if (data.overrideValue === null) return t("translations.statusFallback")
          return data.stale ? t("translations.statusStale") : t("translations.statusOverridden")
        },
      },
      {
        headerName: t("t.actions"),
        pinned: "right",
        maxWidth: 140,
        resizable: false,
        cellRendererFramework: ({ data }: { data: TranslationEditorRow }) =>
          data.overrideValue === null ? null : (
            <Button
              variant="text"
              size="sm"
              disabled={isReverting}
              // Records the key rather than calling the delete, so this memoized renderer never
              // closes over the scope selectors and cannot revert against a stale language.
              onClick={() => setRevertKey(data.key)}
              id={`revert-${data.key}`}
            >
              {t("translations.revert")}
            </Button>
          ),
      },
    ],
    [editedValues, isReverting]
  )

  const saveEdits = (values: Record<string, string>) =>
    saveOverrides(() =>
      translationsService
        .updateRawTranslations({
          jurisdictionId: activeJurisdictionId,
          site: SiteEnum.public,
          language,
          body: { edits: buildEdits(values, rows) },
        })
        .then(() => {
          setEditedValues({})
          setConflictKeys([])
          addToast(t("translations.alertSaved"), { variant: "success" })
        })
        .catch((error) => {
          const conflicts = conflictKeysFrom(error)
          if (conflicts.length) {
            // The rest of the batch was written, so only the named keys stay pending. The
            // refetch below brings in the values they now hold, for the resolution dialog.
            setEditedValues(editsForKeys(values, conflicts))
            setConflictKeys(conflicts)
            return
          }
          addToast(t("errors.alert.badRequest"), { variant: "alert" })
          console.log(error)
        })
        .finally(() => {
          void mutate(cacheKey)
        })
    )

  const handleSave = () => {
    void saveEdits(editedValues)
  }

  const conflicts = useMemo(() => {
    const rowsByKey = new Map(rows.map((row) => [row.key, row]))
    return conflictKeys.map((key) => {
      const row = rowsByKey.get(key)
      return {
        key,
        mine: editedValues[key] ?? "",
        theirs: row ? effectiveValue(row) ?? "" : "",
      }
    })
  }, [conflictKeys, editedValues, rows])

  const handleResolveConflicts = (choices: Record<string, ConflictChoice>) => {
    const kept = Object.fromEntries(
      Object.entries(editedValues).filter(([key]) => choices[key] !== "theirs")
    )

    setConflictKeys([])
    if (!Object.keys(kept).length) {
      // Every conflict resolved in favor of the stored value, so there is nothing left to write.
      setEditedValues({})
      return
    }
    // Re-saving now picks up each key's current `updatedAt` from the refetched rows, so the
    // second attempt locks against what the other admin left behind.
    void saveEdits(kept)
  }

  // Runs the delete for whichever key the revert button recorded, using the current scope.
  useEffect(() => {
    if (!revertKey) return

    void revertOverride(() =>
      translationsService
        .deleteRawTranslation({
          jurisdictionId: activeJurisdictionId,
          site: SiteEnum.public,
          language,
          key: revertKey,
        })
        .then(() => {
          setEditedValues((previous) => {
            const next = { ...previous }
            delete next[revertKey]
            return next
          })
          addToast(t("translations.alertReverted"), { variant: "success" })
        })
        .catch((error) => {
          addToast(t("errors.alert.badRequest"), { variant: "alert" })
          console.log(error)
        })
        .finally(() => {
          setRevertKey(null)
          void mutate(cacheKey)
        })
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [revertKey])

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
            <div className="flex gap-4 items-end">
              {jurisdictions.length > 1 && (
                <Select
                  id="translationsJurisdiction"
                  name="translationsJurisdiction"
                  label={t("t.jurisdiction")}
                  defaultValue={activeJurisdictionId}
                  // Changing scope with unsaved edits would discard them silently, and the
                  // edited values belong to the scope they were typed in.
                  disabled={hasUnsavedChanges}
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
                disabled={hasUnsavedChanges}
                options={languageOptions}
                inputProps={{
                  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => {
                    setLanguage(event.target.value as LanguagesEnum)
                    tableOptions.pagination.setCurrentPage(1)
                  },
                }}
              />
              {hasUnsavedChanges && (
                <>
                  <Button
                    variant="primary"
                    size="sm"
                    disabled={isSaving}
                    onClick={handleSave}
                    id="saveTranslations"
                  >
                    {t("translations.saveCount", {
                      count: Object.keys(editedValues).length,
                    })}
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    disabled={isSaving}
                    onClick={() => setEditedValues({})}
                    id="discardTranslations"
                  >
                    {t("t.cancel")}
                  </Button>
                </>
              )}
            </div>
          }
        />
      </TabView>
      {conflicts.length > 0 && (
        <TranslationConflictDialog
          conflicts={conflicts}
          isLoading={isSaving}
          onClose={() => setConflictKeys([])}
          onResolve={handleResolveConflicts}
        />
      )}
    </Layout>
  )
}

export default SettingsTranslations
