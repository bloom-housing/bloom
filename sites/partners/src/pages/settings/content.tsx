import React, { useContext, useEffect, useMemo, useState } from "react"
import { useRouter } from "next/router"
import Head from "next/head"
import { Field, Select, t, useMutate } from "@bloom-housing/ui-components"
import { Button, Card, FieldValue, Tag } from "@bloom-housing/ui-seeds"
import { Editor, useEditor } from "@tiptap/react"
import { useSWRConfig } from "swr"
import { AuthContext, MessageContext } from "@bloom-housing/shared-helpers"
import {
  FeatureFlagEnum,
  LanguagesEnum,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { TabView } from "@bloom-housing/shared-helpers/src/views/components/TabView"
import Layout from "../../layouts"
import { NavigationHeader } from "../../components/shared/NavigationHeader"
import {
  getEnabledSettingsTabCount,
  getSettingsTabs,
  SettingsIndexEnum,
} from "../../components/settings/SettingsViewHelpers"
import { useJurisdictionContent, useUnsavedChangesWarning } from "../../lib/hooks"
import {
  buildUpdate,
  clearValueAt,
  ContentDocument,
  ContentDraft,
  draftFromRow,
  fieldState,
  hasDraftChanges,
  isConflict,
  isStale,
  pathsThatHideContent,
  rowFor,
  setValueAt,
  valueAt,
} from "../../lib/contentEditor"
import { ContentConflictDialog } from "../../components/settings/ContentConflictDialog"
import { ContentWarningDialog } from "../../components/settings/ContentWarningDialog"
import { EditorExtensions, TextEditor, TextEditorContent } from "../../components/shared/TextEditor"
import styles from "./content.module.scss"

type FieldConfig = { path: string; labelKey: string; type: "text" | "html" }

const DOCUMENTS: { key: ContentDocument; fields: FieldConfig[] }[] = [
  {
    key: "disclaimers",
    fields: [
      { path: "disclaimers.privacyHtml", labelKey: "content.privacyHtml", type: "html" },
      { path: "disclaimers.disclaimerHtml", labelKey: "content.disclaimerHtml", type: "html" },
    ],
  },
  {
    key: "contact",
    fields: [
      { path: "contact.phone", labelKey: "content.contactPhone", type: "text" },
      { path: "contact.email", labelKey: "content.contactEmail", type: "text" },
      { path: "contact.addressHtml", labelKey: "content.contactAddress", type: "html" },
      { path: "contact.hours", labelKey: "content.contactHours", type: "text" },
    ],
  },
]

const RIGHT_TO_LEFT_LANGUAGES = [LanguagesEnum.ar, LanguagesEnum.fa]

const SettingsContent = () => {
  const router = useRouter()
  const { mutate } = useSWRConfig()
  const { addToast } = useContext(MessageContext)
  const { mutate: saveContent, isLoading: isSaving } = useMutate()
  const { profile, jurisdictionContentService, doJurisdictionsHaveFeatureFlagOn } =
    useContext(AuthContext)

  const enableProperties = doJurisdictionsHaveFeatureFlagOn(FeatureFlagEnum.enableProperties)
  const atLeastOneJurisdictionEnablesPreferences = !doJurisdictionsHaveFeatureFlagOn(
    FeatureFlagEnum.disableListingPreferences,
    null,
    true
  )
  const v2Preferences = doJurisdictionsHaveFeatureFlagOn(FeatureFlagEnum.enableV2MSQ)
  const enableAgencies = doJurisdictionsHaveFeatureFlagOn(FeatureFlagEnum.enableHousingAdvocate)
  const enableDbDrivenContent = doJurisdictionsHaveFeatureFlagOn(
    FeatureFlagEnum.enableDbDrivenContent
  )
  const settingsTabsFeatureFlags = {
    enablePreferences: atLeastOneJurisdictionEnablesPreferences,
    enableProperties,
    enableAgencies,
    enableTranslations: enableDbDrivenContent,
    enableContent: enableDbDrivenContent,
  }

  const authorized = enableDbDrivenContent && !!profile?.userRoles?.isAdmin

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
  const [document, setDocument] = useState<ContentDocument>("disclaimers")
  const [draftState, setDraftState] = useState<{ scope: string; draft: ContentDraft } | null>(null)
  const [conflict, setConflict] = useState(false)
  const [hidingPaths, setHidingPaths] = useState<string[]>([])

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

  const activeLanguage = languageOptions.some((option) => option.value === language)
    ? language
    : languageOptions[0]?.value ?? LanguagesEnum.en

  const {
    data: rows,
    loading,
    cacheKey,
  } = useJurisdictionContent(authorized ? activeJurisdictionId : "")

  const languageRow = rowFor(rows, activeLanguage)
  const englishRow = rowFor(rows, LanguagesEnum.en)
  const savedDraft = useMemo(() => draftFromRow(languageRow), [languageRow])
  const englishDraft = useMemo(() => draftFromRow(englishRow), [englishRow])
  const isEnglish = activeLanguage === LanguagesEnum.en
  const direction = RIGHT_TO_LEFT_LANGUAGES.includes(activeLanguage) ? "rtl" : "ltr"
  const scope = `${activeJurisdictionId}|${activeLanguage}|${String(languageRow?.updatedAt ?? "")}`
  const draft = draftState?.scope === scope ? draftState.draft : savedDraft
  const setDraft = (apply: (current: ContentDraft) => ContentDraft) =>
    setDraftState((current) => ({
      scope,
      draft: apply(current?.scope === scope ? current.draft : savedDraft),
    }))

  const hasUnsavedChanges = hasDraftChanges(draft, savedDraft)
  useUnsavedChangesWarning(hasUnsavedChanges, t("content.unsavedChangesWarning"))

  const privacyEditor = useEditor({
    extensions: EditorExtensions,
    immediatelyRender: false,
    onUpdate: ({ editor }) => editField("disclaimers.privacyHtml", editor.getHTML()),
  })
  const disclaimerEditor = useEditor({
    extensions: EditorExtensions,
    immediatelyRender: false,
    onUpdate: ({ editor }) => editField("disclaimers.disclaimerHtml", editor.getHTML()),
  })
  const addressEditor = useEditor({
    extensions: EditorExtensions,
    immediatelyRender: false,
    onUpdate: ({ editor }) => editField("contact.addressHtml", editor.getHTML()),
  })
  const editors: Record<string, Editor | null> = {
    "disclaimers.privacyHtml": privacyEditor,
    "disclaimers.disclaimerHtml": disclaimerEditor,
    "contact.addressHtml": addressEditor,
  }

  // Loading a scope, reverting a field, or discarding a conflict all replace what the editor should
  // show.
  useEffect(() => {
    Object.entries(editors).forEach(([path, editor]) => {
      const value = valueAt(draft, path)
      if (editor && typeof value === "string" && value !== editor.getHTML()) {
        editor.commands.setContent(value, { emitUpdate: false })
      }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draft, activeJurisdictionId, activeLanguage])

  const changeScope = (apply: () => void) => {
    apply()
    setConflict(false)
  }

  const overrideField = (path: string) => {
    const englishValue = valueAt(englishDraft, path)
    setDraft((current) =>
      setValueAt(
        current ?? {},
        path,
        isEnglish || typeof englishValue !== "string" ? "" : englishValue
      )
    )
  }

  const revertField = (path: string) => {
    setDraft((current) => clearValueAt(current, path))
  }

  const editField = (path: string, value: string) => {
    setDraft((current) => setValueAt(current, path, value))
  }

  const runSave = (toSave: ContentDraft) =>
    saveContent(() =>
      jurisdictionContentService
        .updateJurisdictionContent({
          jurisdictionId: activeJurisdictionId,
          language: activeLanguage,
          body: buildUpdate(toSave, languageRow?.updatedAt),
        })
        .then(() => {
          setConflict(false)
          addToast(t("content.alertSaved"), { variant: "success" })
        })
        .catch((error) => {
          if (isConflict(error)) {
            setConflict(true)
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
    const paths = DOCUMENTS.flatMap((entry) => entry.fields.map((field) => field.path))
    const hiding = pathsThatHideContent(draft, englishDraft, paths)
    if (hiding.length) {
      setHidingPaths(hiding)
      return
    }
    void runSave(draft)
  }

  if (!authorized) {
    void router.push("/unauthorized")
    return null
  }

  const activeFields = DOCUMENTS.find((entry) => entry.key === document)?.fields ?? []

  return (
    <Layout>
      <Head>
        <title>
          {`${t("t.settings")} - ${t("settings.content")} - ${t("nav.siteTitlePartners")}`}
        </title>
      </Head>
      <NavigationHeader className="relative" title={t("t.settings")} />
      <TabView
        hideTabs={getEnabledSettingsTabCount(settingsTabsFeatureFlags, profile?.userRoles) <= 1}
        tabs={getSettingsTabs(
          SettingsIndexEnum.content,
          v2Preferences,
          settingsTabsFeatureFlags,
          profile?.userRoles
        )}
      >
        <div className={styles["toolbar"]}>
          <div className={styles["scope-controls"]}>
            <Select
              id="contentJurisdiction"
              name="contentJurisdiction"
              label={t("t.jurisdiction")}
              defaultValue={activeJurisdictionId}
              disabled={jurisdictions.length < 2 || hasUnsavedChanges}
              options={jurisdictions.map((jurisdiction) => ({
                value: jurisdiction.id,
                label: jurisdiction.name,
              }))}
              inputProps={{
                onChange: (event: React.ChangeEvent<HTMLSelectElement>) => {
                  changeScope(() => setJurisdictionId(event.target.value))
                },
              }}
            />
            <Select
              id="contentLanguage"
              name="contentLanguage"
              label={t("t.language")}
              key={activeJurisdictionId}
              defaultValue={activeLanguage}
              disabled={hasUnsavedChanges}
              options={languageOptions}
              inputProps={{
                onChange: (event: React.ChangeEvent<HTMLSelectElement>) => {
                  changeScope(() => setLanguage(event.target.value as LanguagesEnum))
                },
              }}
            />
            <Select
              id="contentDocument"
              name="contentDocument"
              label={t("content.document")}
              defaultValue={document}
              options={DOCUMENTS.map((entry) => ({
                value: entry.key,
                label: t(`content.document${entry.key[0].toUpperCase()}${entry.key.slice(1)}`),
              }))}
              inputProps={{
                onChange: (event: React.ChangeEvent<HTMLSelectElement>) => {
                  setDocument(event.target.value as ContentDocument)
                },
              }}
            />
          </div>
          <Button
            variant="primary"
            disabled={!hasUnsavedChanges || loading}
            loadingMessage={isSaving && t("t.loading")}
            onClick={handleSave}
          >
            {t("t.save")}
          </Button>
        </div>

        {loading && <p className={styles["status"]}>{t("t.loading")}</p>}

        {!loading &&
          activeFields.map((field) => {
            const value = valueAt(draft, field.path)
            const state = fieldState(value)
            const englishValue = valueAt(englishDraft, field.path)
            const stale = isStale(languageRow?.staleFields, field.path)
            const editor = editors[field.path]

            return (
              <Card key={field.path} className={styles["field-card"]}>
                <Card.Section>
                  <div className={styles["field-header"]}>
                    <span className={styles["field-label"]}>{t(field.labelKey)}</span>
                    {state === "fallback" && (
                      <Tag variant="secondary">
                        {isEnglish ? t("content.notSet") : t("content.usingEnglish")}
                      </Tag>
                    )}
                    {state === "hidden" && <Tag variant="secondary">{t("content.hidden")}</Tag>}
                    {stale && <Tag variant="highlight-warm">{t("content.stale")}</Tag>}
                  </div>

                  {!isEnglish && (
                    <div className={styles["english-source"]}>
                      <FieldValue label={t("content.englishSource")}>
                        {field.type === "html" && typeof englishValue === "string" ? (
                          <TextEditorContent content={englishValue} />
                        ) : (
                          <span>{(englishValue as string) ?? t("content.notSet")}</span>
                        )}
                      </FieldValue>
                    </div>
                  )}

                  {state === "fallback" ? (
                    <Button
                      variant="primary-outlined"
                      size="sm"
                      onClick={() => overrideField(field.path)}
                    >
                      {isEnglish ? t("content.setValue") : t("content.override")}
                    </Button>
                  ) : (
                    <div className={styles["field-editor"]} dir={direction}>
                      {field.type === "html" && editor ? (
                        <>
                          <TextEditor
                            editor={editor}
                            label={t(field.labelKey)}
                            editorId={field.path}
                          />
                          <div className={styles["preview"]}>
                            <FieldValue label={t("content.preview")}>
                              <TextEditorContent content={(value as string) ?? ""} />
                            </FieldValue>
                          </div>
                        </>
                      ) : (
                        <Field
                          key={`${activeJurisdictionId}-${activeLanguage}-${field.path}`}
                          id={field.path}
                          name={field.path}
                          label={t(field.labelKey)}
                          defaultValue={(value as string) ?? ""}
                          inputProps={{
                            onChange: (event: React.ChangeEvent<HTMLInputElement>) =>
                              editField(field.path, event.target.value),
                          }}
                        />
                      )}
                      <Button variant="text" size="sm" onClick={() => revertField(field.path)}>
                        {isEnglish ? t("content.clear") : t("content.revertToEnglish")}
                      </Button>
                    </div>
                  )}
                </Card.Section>
              </Card>
            )
          })}
      </TabView>

      <ContentConflictDialog
        isOpen={conflict}
        isLoading={isSaving}
        onClose={() => setConflict(false)}
        onDiscard={() => {
          setConflict(false)
          setDraftState(null)
          void mutate(cacheKey)
        }}
        onOverwrite={() => {
          void runSave(draft)
        }}
      />

      <ContentWarningDialog
        hidingPaths={hidingPaths}
        isLoading={isSaving}
        onClose={() => setHidingPaths([])}
        onConfirm={() => {
          setHidingPaths([])
          void runSave(draft)
        }}
      />
    </Layout>
  )
}

export default SettingsContent
