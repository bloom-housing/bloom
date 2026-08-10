import React, { useContext, useEffect, useMemo, useState } from "react"
import { useRouter } from "next/router"
import Head from "next/head"
import { AlertBox, Field, Select, t, useMutate } from "@bloom-housing/ui-components"
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
import { ColDef, ColGroupDef, Column } from "ag-grid-community"
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
  buildEdits,
  buildTranslationRows,
  conflictKeysFrom,
  editsForKeys,
  effectiveValue,
  isChanged,
  keysThatHideSections,
  PendingEdits,
  TranslationEditorRow,
  validateEdits,
} from "../../lib/translationEditor"
import {
  ConflictChoice,
  TranslationConflictDialog,
} from "../../components/settings/TranslationConflictDialog"
import { TranslationHideSectionDialog } from "../../components/settings/TranslationHideSectionDialog"

// Rough: one character out only changes which editor opens.
const APPROXIMATE_CHARACTER_WIDTH = 7
const CELL_PADDING = 34
const DEFAULT_VALUE_COLUMN_WIDTH = 220

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
    error,
    cacheKey,
  } = useRawTranslations({
    jurisdictionId: activeJurisdictionId,
    site: SiteEnum.public,
    language,
  })

  // Before these load every row looks unoverridden, so an edit would send a create and conflict.
  const overridesLoaded = overrides !== undefined

  // What the admin has typed but not saved, with the version each edit locks against.
  const [edits, setEdits] = useState<PendingEdits>({})
  // A revert waits here until it is either confirmed or found not to need confirming.
  const [pendingRevertKey, setPendingRevertKey] = useState<string | null>(null)
  const [revertKey, setRevertKey] = useState<string | null>(null)
  // Keys a save could not write because someone changed them first.
  const [conflictKeys, setConflictKeys] = useState<string[]>([])
  const editCount = Object.keys(edits).length
  const hasUnsavedChanges = editCount > 0

  // Edits live only in component state until saved, so leaving the page discards them.
  useUnsavedChangesWarning(hasUnsavedChanges, t("translations.unsavedChangesWarning"))

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
        editable: overridesLoaded,
        // The default double-click gives no hint the cell is editable.
        singleClickEdit: true,
        cellClass: ({ data }: { data: TranslationEditorRow }) =>
          edits[data.key] !== undefined
            ? `${styles["editable-cell"]} ${styles["edited-cell"]}`
            : styles["editable-cell"],
        // Inline editor commits on Enter; a truncated or multi-line value needs the textarea.
        cellEditorSelector: ({ value, column }: { value: string; column?: Column }) => {
          const text = value ?? ""
          const width = column?.getActualWidth?.() ?? DEFAULT_VALUE_COLUMN_WIDTH
          const visibleCharacters = (width - CELL_PADDING) / APPROXIMATE_CHARACTER_WIDTH

          return text.length > visibleCharacters || text.includes("\n")
            ? { component: "agLargeTextCellEditor", params: { maxLength: 5000 } }
            : { component: "agTextCellEditor" }
        },
        valueGetter: ({ data }: { data: TranslationEditorRow }) =>
          edits[data.key]?.value ?? effectiveValue(data) ?? "",
        // AgTable exposes no grid-level change callback, so edits are captured here.
        valueSetter: ({ data, newValue }: { data: TranslationEditorRow; newValue: string }) => {
          const value = newValue ?? ""

          setEdits((previous) => {
            const next = { ...previous }
            if (!isChanged(data, value)) {
              delete next[data.key]
            } else {
              // First edit wins on the version, so a later refresh cannot widen the lock.
              const existing = previous[data.key]
              next[data.key] = { value, version: existing ? existing.version : data.updatedAt }
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
          if (edits[data.key] !== undefined) return t("translations.statusEdited")
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
              // Recorded rather than deleted here, so this memo cannot capture a stale language.
              onClick={() => setPendingRevertKey(data.key)}
              id={`revert-${data.key}`}
            >
              {t("translations.revert")}
            </Button>
          ),
      },
    ],
    [edits, isReverting, overridesLoaded]
  )

  const saveEdits = (pending: PendingEdits) =>
    saveOverrides(() =>
      translationsService
        .updateRawTranslations({
          jurisdictionId: activeJurisdictionId,
          site: SiteEnum.public,
          language,
          body: { edits: buildEdits(pending) },
        })
        .then(() => {
          setEdits({})
          setConflictKeys([])
          addToast(t("translations.alertSaved"), { variant: "success" })
        })
        .catch((error) => {
          const conflicts = conflictKeysFrom(error)
          if (conflicts.length) {
            // The rest of the batch was written, so only the named keys stay pending. The
            // refetch below brings in the values they now hold, for the resolution dialog.
            setEdits(editsForKeys(pending, conflicts))
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

  // Keys awaiting confirmation because saving or reverting them would remove a section.
  const [hidingKeys, setHidingKeys] = useState<string[]>([])

  const handleSave = () => {
    const issues = validateEdits(edits, rows)
    if (issues.length) {
      addToast(
        t("translations.alertTokenError", {
          keys: issues.map((issue) => issue.key).join(", "),
        }),
        { variant: "alert" }
      )
      return
    }

    const hiding = keysThatHideSections(edits, rows)
    if (hiding.length) {
      setHidingKeys(hiding)
      return
    }

    void saveEdits(edits)
  }

  const conflicts = useMemo(() => {
    const rowsByKey = new Map(rows.map((row) => [row.key, row]))
    return conflictKeys.map((key) => {
      const row = rowsByKey.get(key)
      return {
        key,
        mine: edits[key]?.value ?? "",
        theirs: row ? effectiveValue(row) ?? "" : "",
      }
    })
  }, [conflictKeys, edits, rows])

  const handleResolveConflicts = (choices: Record<string, ConflictChoice>) => {
    // They have seen the other write and chosen to replace it, so re-lock against the version the
    // row holds now. Anything resolved the other way is dropped, leaving the stored value alone.
    const rowsByKey = new Map(rows.map((row) => [row.key, row]))
    const kept = Object.entries(edits).reduce((remaining, [key, edit]) => {
      if (choices[key] !== "theirs") {
        remaining[key] = { value: edit.value, version: rowsByKey.get(key)?.updatedAt ?? null }
      }
      return remaining
    }, {} as PendingEdits)

    setConflictKeys([])
    setEdits(kept)
    if (Object.keys(kept).length) {
      void saveEdits(kept)
    }
  }

  // Reverting a key with no base takes its section off the site, so that case is confirmed first.
  useEffect(() => {
    if (!pendingRevertKey) return

    if (rows.find((row) => row.key === pendingRevertKey && !row.hasBase)) {
      setHidingKeys([pendingRevertKey])
      return
    }
    setRevertKey(pendingRevertKey)
    setPendingRevertKey(null)
  }, [pendingRevertKey, rows])

  // Runs the delete for whichever key was confirmed, using the current scope.
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
          setEdits((previous) => {
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
        <div className={styles["toolbar"]}>
          <div className={styles["scope-controls"]}>
            {/* Always shown, since the jurisdiction being edited cannot be inferred otherwise. */}
            <Select
              id="translationsJurisdiction"
              name="translationsJurisdiction"
              label={t("t.jurisdiction")}
              defaultValue={activeJurisdictionId}
              // Switching scope would silently discard edits typed against the old one.
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
            label={t("t.filter")}
            readerOnly={true}
            placeholder={t("t.filter")}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              tableOptions.filter.setFilterValue(event.target.value)
              tableOptions.pagination.setCurrentPage(1)
            }}
          />
        </div>
        <p className={styles["editing-hint"]}>{t("translations.editingHint")}</p>
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
            showSearch: false,
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
      {hidingKeys.length > 0 && (
        <TranslationHideSectionDialog
          keys={hidingKeys}
          isLoading={isSaving || isReverting}
          onClose={() => {
            setHidingKeys([])
            setPendingRevertKey(null)
          }}
          onConfirm={() => {
            setHidingKeys([])
            if (pendingRevertKey) {
              setRevertKey(pendingRevertKey)
              setPendingRevertKey(null)
              return
            }
            void saveEdits(edits)
          }}
        />
      )}
    </Layout>
  )
}

export default SettingsTranslations
