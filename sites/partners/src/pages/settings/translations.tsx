import React, { useCallback, useContext, useMemo, useRef, useState } from "react"
import { useRouter } from "next/router"
import Head from "next/head"
import { AlertBox, debounce, Field, Select, t, useMutate } from "@bloom-housing/ui-components"
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
import { ColDef, ColGroupDef, GridApi } from "ag-grid-community"
import Layout from "../../layouts"
import { NavigationHeader } from "../../components/shared/NavigationHeader"
import {
  getEnabledSettingsTabCount,
  getSettingsTabs,
  SettingsIndexEnum,
} from "../../components/settings/SettingsViewHelpers"
import { useRawTranslations, useUnsavedChangesWarning } from "../../lib/hooks"
import { translations } from "../../lib/translations"
import styles from "./translations.module.scss"
import {
  applyConflictChoices,
  applyEdit,
  buildConflicts,
  buildEdits,
  buildTranslationRows,
  ConflictChoice,
  conflictKeysFrom,
  editsForKeys,
  editsWithoutKeys,
  effectiveValue,
  keysThatHideSections,
  PendingEdits,
  rejectedValueKeys,
  TranslationGridRow,
  TranslationIssue,
  validateEdits,
  withPendingEdits,
} from "../../lib/translationEditor"
import { TranslationConflictDialog } from "../../components/settings/TranslationConflictDialog"
import { TranslationWarningDialog } from "../../components/settings/TranslationWarningDialog"

// Above this the inline editor is too cramped to work in, so the textarea opens instead.
const INLINE_EDITOR_MAX_CHARACTERS = 60
// Matches the cap the API enforces on a translation value.
const MAX_VALUE_LENGTH = 5000
// Matches AgTable, so the two filter fields in Partners behave the same way.
const MINIMUM_FILTER_CHARACTERS = 2
const FILTER_DEBOUNCE_MS = 500
// AgTable re-runs its debounced filter effect, which resets to page one, whenever this changes.
const ignoreAgTableSearch = () => undefined
const ignoreAgTableSelection = () => undefined

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

  const authorized = enableTranslations && !!profile?.userRoles?.isAdmin

  const jurisdictions = useMemo(
    () =>
      (profile?.jurisdictions ?? []).filter((jurisdiction) =>
        jurisdiction.featureFlags?.some(
          (flag) => flag.name === FeatureFlagEnum.enableDbDrivenContent && flag.active
        )
      ),
    [profile?.jurisdictions]
  )
  const [jurisdictionId, setJurisdictionId] = useState("")
  const [language, setLanguage] = useState<LanguagesEnum>(LanguagesEnum.en)

  const selectedJurisdiction = jurisdictions.find(
    (jurisdiction) => jurisdiction.id === (jurisdictionId || jurisdictions[0]?.id)
  )
  const activeJurisdictionId = selectedJurisdiction?.id ?? ""

  const languageOptions = useMemo(
    () =>
      (selectedJurisdiction?.languages ?? [LanguagesEnum.en]).map((value) => ({
        value,
        label: t(`languages.${value}`),
      })),
    [selectedJurisdiction?.languages]
  )

  // Languages are per jurisdiction, so switching to one that does not offer the selected language
  // has to fall back rather than keep editing a language the jurisdiction has no option for.
  const activeLanguage = languageOptions.some((option) => option.value === language)
    ? language
    : languageOptions[0]?.value ?? LanguagesEnum.en

  const {
    data: overrides,
    loading,
    error,
    cacheKey,
  } = useRawTranslations({
    jurisdictionId: authorized ? activeJurisdictionId : "",
    site: SiteEnum.public,
    language: activeLanguage,
  })

  // Before these load every row looks unoverridden, so an edit would send a create and conflict.
  const overridesLoaded = overrides !== undefined

  // What the admin has typed but not saved, with the version each edit locks against.
  const [edits, setEdits] = useState<PendingEdits>({})
  // Keys a save could not write because someone changed them first.
  const [conflictKeys, setConflictKeys] = useState<string[]>([])
  const [warnings, setWarnings] = useState<{
    hidingKeys: string[]
    tokenIssues: TranslationIssue[]
  }>({ hidingKeys: [], tokenIssues: [] })
  const [warningRevertKey, setWarningRevertKey] = useState<string | null>(null)
  // What is typed in the filter field, which lags the value the rows are filtered by.
  const [filterInput, setFilterInput] = useState("")
  const gridApi = useRef<GridApi | null>(null)
  const captureGridApi = useCallback((api: React.SetStateAction<GridApi | null>) => {
    gridApi.current = typeof api === "function" ? api(gridApi.current) : api
  }, [])

  const applyFilter = useRef(
    debounce((value: string) => {
      tableOptions.filter.setFilterValue(value)
      tableOptions.pagination.setCurrentPage(1)
    }, FILTER_DEBOUNCE_MS)
  )
  const editCount = Object.keys(edits).length
  const hasUnsavedChanges = editCount > 0

  // Edits live only in component state until saved, so leaving the page discards them.
  useUnsavedChangesWarning(hasUnsavedChanges, t("translations.unsavedChangesWarning"))

  const rows = useMemo(
    () =>
      buildTranslationRows({
        englishBase: flattenTranslations(translations.general),
        languageBase:
          activeLanguage === LanguagesEnum.en
            ? undefined
            : flattenTranslations(translations[activeLanguage]),
        overrides: overrides ?? [],
      }),
    [activeLanguage, overrides]
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

  // Only the page on screen is merged, so an edit re-maps a handful of rows rather than all of them.
  const gridRows = useMemo(() => withPendingEdits(pagedRows, edits), [pagedRows, edits])

  const runRevert = useCallback(
    (key: string) =>
      revertOverride(() =>
        translationsService
          .deleteRawTranslation({
            jurisdictionId: activeJurisdictionId,
            site: SiteEnum.public,
            language: activeLanguage,
            key,
          })
          .then(() => {
            setEdits((previous) => {
              const next = { ...previous }
              delete next[key]
              return next
            })
            addToast(t("translations.alertReverted"), { variant: "success" })
          })
          .catch((error) => {
            addToast(t("errors.alert.badRequest"), { variant: "alert" })
            console.log(error)
          })
          .finally(() => {
            void mutate(cacheKey)
          })
      ),
    [
      activeJurisdictionId,
      activeLanguage,
      addToast,
      cacheKey,
      mutate,
      revertOverride,
      translationsService,
    ]
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
        // Locked during a save, since an edit made mid-request is written against a stale version.
        editable: overridesLoaded && !isSaving,
        // The default double-click gives no hint the cell is editable.
        singleClickEdit: true,
        cellClass: ({ data }: { data: TranslationGridRow }) =>
          data.editedValue !== null
            ? `${styles["editable-cell"]} ${styles["edited-cell"]}`
            : styles["editable-cell"],
        cellEditorSelector: ({ value }: { value: string }) => {
          const text = value ?? ""

          return text.length > INLINE_EDITOR_MAX_CHARACTERS || text.includes("\n")
            ? { component: "agLargeTextCellEditor", params: { maxLength: MAX_VALUE_LENGTH } }
            : { component: "agTextCellEditor", params: { maxLength: MAX_VALUE_LENGTH } }
        },
        valueGetter: ({ data }: { data: TranslationGridRow }) =>
          data.editedValue ?? effectiveValue(data) ?? "",
        // AgTable exposes no grid-level change callback, so edits are captured here.
        valueSetter: ({ data, newValue }: { data: TranslationGridRow; newValue: string }) => {
          setEdits((previous) => applyEdit(previous, data, newValue ?? ""))
          return true
        },
      },
      {
        headerName: t("t.status"),
        minWidth: 140,
        valueGetter: ({ data }: { data: TranslationGridRow }) => {
          if (data.editedValue !== null) return t("translations.statusEdited")
          if (data.overrideValue === null) return t("translations.statusFallback")
          return data.stale ? t("translations.statusStale") : t("translations.statusOverridden")
        },
      },
      {
        headerName: t("t.actions"),
        pinned: "right",
        maxWidth: 140,
        resizable: false,
        cellRendererFramework: ({ data }: { data: TranslationGridRow }) =>
          data.overrideValue === null ? null : (
            <Button
              variant="text"
              size="sm"
              // A revert racing a save on the same key leaves whichever refetch lands last.
              disabled={isReverting || isSaving}
              onClick={() => {
                // A key with no base renders only from its override, so removing it takes the
                // section off the site and is confirmed first.
                if (data.hasBase) {
                  void runRevert(data.key)
                  return
                }
                setWarnings({ hidingKeys: [data.key], tokenIssues: [] })
                setWarningRevertKey(data.key)
              }}
              id={`revert-${data.key}`}
            >
              {t("translations.revert")}
            </Button>
          ),
      },
    ],
    [isReverting, isSaving, overridesLoaded, runRevert]
  )

  const saveEdits = (pending: PendingEdits) => {
    const sentKeys = Object.keys(pending)

    return saveOverrides(() =>
      translationsService
        .updateRawTranslations({
          jurisdictionId: activeJurisdictionId,
          site: SiteEnum.public,
          language: activeLanguage,
          body: { edits: buildEdits(pending) },
        })
        .then(() => {
          // Only the keys that were sent are cleared. A cell that committed while the request was
          // in flight is not among them, so that edit survives instead of being discarded.
          setEdits((previous) => editsWithoutKeys(previous, sentKeys))
          setConflictKeys([])
          addToast(t("translations.alertSaved"), { variant: "success" })
        })
        .catch((error) => {
          const conflicts = conflictKeysFrom(error)
          if (conflicts.length) {
            // The rest of the batch was written, so only the named keys stay pending. The
            // refetch below brings in the values they now hold, for the resolution dialog.
            setEdits((previous) => ({
              ...editsWithoutKeys(previous, sentKeys),
              ...editsForKeys(pending, conflicts),
            }))
            setConflictKeys(conflicts)
            return
          }
          const rejected = rejectedValueKeys(error, sentKeys)
          if (rejected.length) {
            addToast(t("translations.alertValueRejected", { keys: rejected.join(", ") }), {
              variant: "alert",
            })
            return
          }
          addToast(t("errors.alert.badRequest"), { variant: "alert" })
          console.log(error)
        })
        .finally(() => {
          void mutate(cacheKey)
        })
    )
  }

  const handleSave = () => {
    const tokenIssues = validateEdits(edits, rows)
    const hidingKeys = keysThatHideSections(edits, rows)

    if (tokenIssues.length || hidingKeys.length) {
      setWarnings({ hidingKeys, tokenIssues })
      return
    }

    void saveEdits(edits)
  }

  const conflicts = useMemo(
    () => buildConflicts(conflictKeys, edits, rows),
    [conflictKeys, edits, rows]
  )

  const handleResolveConflicts = (choices: Record<string, ConflictChoice>) => {
    const kept = applyConflictChoices(edits, choices, rows)

    setConflictKeys([])
    setEdits(kept)
    if (Object.keys(kept).length) {
      void saveEdits(kept)
    }
  }

  if (!authorized) {
    void router.push("/unauthorized")
    return null
  }

  return (
    <Layout>
      <Head>
        <title>
          {`${t("t.settings")} - ${t("settings.translations")} - ${t("nav.siteTitlePartners")}`}
        </title>
      </Head>
      <NavigationHeader className="relative" title={t("t.settings")} />
      <TabView
        hideTabs={getEnabledSettingsTabCount(settingsTabsFeatureFlags, profile?.userRoles) <= 1}
        tabs={getSettingsTabs(
          SettingsIndexEnum.translations,
          v2Preferences,
          settingsTabsFeatureFlags,
          profile?.userRoles
        )}
      >
        <div className={styles["toolbar"]}>
          <div className={styles["scope-controls"]}>
            <Select
              id="translationsJurisdiction"
              name="translationsJurisdiction"
              label={t("t.jurisdiction")}
              defaultValue={activeJurisdictionId}
              disabled={jurisdictions.length < 2 || hasUnsavedChanges}
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
            <Select
              id="translationsLanguage"
              name="translationsLanguage"
              label={t("t.language")}
              key={activeJurisdictionId}
              defaultValue={activeLanguage}
              disabled={hasUnsavedChanges}
              options={languageOptions}
              inputProps={{
                onChange: (event: React.ChangeEvent<HTMLSelectElement>) => {
                  setLanguage(event.target.value as LanguagesEnum)
                  tableOptions.pagination.setCurrentPage(1)
                },
              }}
            />
          </div>
          <div className={styles["actions"]}>
            <Button
              variant="primary"
              size="sm"
              disabled={!hasUnsavedChanges || isSaving}
              onClick={handleSave}
              id="saveTranslations"
            >
              {hasUnsavedChanges ? t("translations.saveCount", { count: editCount }) : t("t.save")}
            </Button>
            <Button
              variant="secondary"
              size="sm"
              disabled={!hasUnsavedChanges || isSaving}
              onClick={() => setEdits({})}
              id="discardTranslations"
            >
              {t("t.cancel")}
            </Button>
          </div>
        </div>
        {error && (
          <AlertBox className="mb-4" type="alert">
            {t("translations.alertLoadFailed")}
          </AlertBox>
        )}
        {/* AgTable's own filter would sit between the hint and the grid, so it is disabled below. */}
        <div className={styles["filter"]}>
          <Field
            name="translationsFilter"
            // AgTable renders a second field with the same label and placeholder, hidden.
            dataTestId="translations-filter"
            label={t("t.filter")}
            readerOnly={true}
            placeholder={t("t.filter")}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              const value = event.target.value
              // Commits an open cell editor: ag-grid throws if the rows change under one.
              gridApi.current?.stopEditing()
              setFilterInput(value)
              applyFilter.current(value.length > MINIMUM_FILTER_CHARACTERS ? value : "")
            }}
          />
          {filterInput.length > 0 && filterInput.length <= MINIMUM_FILTER_CHARACTERS && (
            <AlertBox className={styles["filter-error"]} type="notice">
              {t("applications.table.searchError")}
            </AlertBox>
          )}
        </div>
        <p className={styles["editing-hint"]}>{t("translations.editingHint")}</p>
        <AgTable
          id="translations-table"
          pagination={{
            perPage,
            setPerPage: (value: React.SetStateAction<number>) => {
              tableOptions.pagination.setItemsPerPage(value)
              tableOptions.pagination.setCurrentPage(1)
            },
            currentPage,
            setCurrentPage: tableOptions.pagination.setCurrentPage,
          }}
          data={{
            items: gridRows,
            loading,
            totalItems: filteredRows.length,
            totalPages: Math.max(Math.ceil(filteredRows.length / perPage), 1),
          }}
          config={{
            columns: columnDefs,
            totalItemsLabel: t("translations.total"),
          }}
          search={{
            setSearch: ignoreAgTableSearch,
            showSearch: false,
          }}
          selectConfig={{
            setGridApi: captureGridApi,
            updateSelectedValues: ignoreAgTableSelection,
          }}
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
      <TranslationWarningDialog
        hidingKeys={warnings.hidingKeys}
        tokenIssues={warnings.tokenIssues}
        isLoading={isSaving || isReverting}
        onClose={() => {
          setWarnings({ hidingKeys: [], tokenIssues: [] })
          setWarningRevertKey(null)
        }}
        onConfirm={() => {
          setWarnings({ hidingKeys: [], tokenIssues: [] })
          if (warningRevertKey) {
            setWarningRevertKey(null)
            void runRevert(warningRevertKey)
            return
          }
          void saveEdits(edits)
        }}
      />
    </Layout>
  )
}

export default SettingsTranslations
