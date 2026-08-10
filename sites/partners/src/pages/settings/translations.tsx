import React, { useCallback, useContext, useMemo, useState } from "react"
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
import { ColDef, ColGroupDef } from "ag-grid-community"
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
  TranslationGridRow,
  validateEdits,
  withPendingEdits,
} from "../../lib/translationEditor"
import { TranslationConflictDialog } from "../../components/settings/TranslationConflictDialog"
import { TranslationHideSectionDialog } from "../../components/settings/TranslationHideSectionDialog"

// Above this the inline editor is too cramped to work in, so the textarea opens instead.
const INLINE_EDITOR_MAX_CHARACTERS = 60

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
  // Keys a save could not write because someone changed them first.
  const [conflictKeys, setConflictKeys] = useState<string[]>([])
  // Keys awaiting confirmation because saving or reverting them would remove a section.
  const [hidingKeys, setHidingKeys] = useState<string[]>([])
  // Set alongside hidingKeys when the confirmation is for a revert rather than a save.
  const [hidingRevertKey, setHidingRevertKey] = useState<string | null>(null)
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

  // Only the page on screen is merged, so an edit re-maps a handful of rows rather than all of them.
  const gridRows = useMemo(() => withPendingEdits(pagedRows, edits), [pagedRows, edits])

  const runRevert = useCallback(
    (key: string) =>
      revertOverride(() =>
        translationsService
          .deleteRawTranslation({
            jurisdictionId: activeJurisdictionId,
            site: SiteEnum.public,
            language,
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
      addToast,
      cacheKey,
      language,
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
        // Inline editor commits on Enter; a long or multi-line value needs the textarea instead.
        cellEditorSelector: ({ value }: { value: string }) => {
          const text = value ?? ""

          return text.length > INLINE_EDITOR_MAX_CHARACTERS || text.includes("\n")
            ? { component: "agLargeTextCellEditor", params: { maxLength: 5000 } }
            : { component: "agTextCellEditor" }
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
                setHidingKeys([data.key])
                setHidingRevertKey(data.key)
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
          language,
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
          addToast(t("errors.alert.badRequest"), { variant: "alert" })
          console.log(error)
        })
        .finally(() => {
          void mutate(cacheKey)
        })
    )
  }

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
            setHidingRevertKey(null)
          }}
          onConfirm={() => {
            setHidingKeys([])
            if (hidingRevertKey) {
              setHidingRevertKey(null)
              void runRevert(hidingRevertKey)
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
