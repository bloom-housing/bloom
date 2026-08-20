import React, { useContext, useMemo, useState } from "react"
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
  addListItem,
  addTextSection,
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
  newItemId,
  normalizeRichText,
  removeListItem,
  removeTextSection,
  restoreListItem,
  rowFor,
  setValueAt,
  textSections,
  tombstoneListItem,
  valueAt,
} from "../../lib/contentEditor"
import { ContentConflictDialog } from "../../components/settings/ContentConflictDialog"
import { ContentItemDrawer, ItemField } from "../../components/settings/ContentItemDrawer"
import { ContentList } from "../../components/settings/ContentList"
import { ContentWarningDialog } from "../../components/settings/ContentWarningDialog"
import { EditorExtensions, TextEditor, TextEditorContent } from "../../components/shared/TextEditor"
import styles from "./content.module.scss"

type FieldConfig = { path: string; labelKey: string; type: "text" | "html" }

type ListConfig = {
  listPath: string
  labelKey: string
  addLabelKey: string
  item: { titleKey: string; displayField: string; fields: ItemField[] }
  /** A list each item holds, such as the questions inside a FAQ category. */
  nested?: {
    field: string
    labelKey: string
    addLabelKey: string
    item: { titleKey: string; displayField: string; fields: ItemField[] }
  }
}

type DocumentConfig = {
  key: ContentDocument
  fields?: FieldConfig[]
  lists?: ListConfig[]
  /** Positional rich text, which a language row replaces whole rather than merging by id. */
  textSections?: { path: string; labelKey: string; addLabelKey: string }
}

const DOCUMENTS: DocumentConfig[] = [
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
  {
    key: "faq",
    lists: [
      {
        listPath: "faq.categories",
        labelKey: "content.faqCategories",
        addLabelKey: "content.addCategory",
        item: {
          titleKey: "content.faqCategory",
          displayField: "title",
          fields: [{ name: "title", labelKey: "content.faqCategoryTitle", type: "text" }],
        },
        nested: {
          field: "items",
          labelKey: "content.faqItems",
          addLabelKey: "content.addQuestion",
          item: {
            titleKey: "content.faqItem",
            displayField: "question",
            fields: [
              { name: "question", labelKey: "content.faqQuestion", type: "text" },
              { name: "answerHtml", labelKey: "content.faqAnswer", type: "html" },
            ],
          },
        },
      },
    ],
  },
  {
    key: "resources",
    fields: [
      {
        path: "resources.contactCard.departmentTitle",
        labelKey: "content.resourcesDepartment",
        type: "text",
      },
      {
        path: "resources.contactCard.description",
        labelKey: "content.resourcesDescription",
        type: "text",
      },
      { path: "resources.contactCard.email", labelKey: "content.resourcesEmail", type: "text" },
    ],
    lists: [
      {
        listPath: "resources.resourceSections",
        labelKey: "content.resourceSections",
        addLabelKey: "content.addSection",
        item: {
          titleKey: "content.resourceSection",
          displayField: "sectionTitle",
          fields: [
            { name: "sectionTitle", labelKey: "content.sectionTitle", type: "text" },
            { name: "sectionSubtitle", labelKey: "content.sectionSubtitle", type: "text" },
          ],
        },
        nested: {
          field: "cards",
          labelKey: "content.resourceCards",
          addLabelKey: "content.addCard",
          item: {
            titleKey: "content.resourceCard",
            displayField: "title",
            fields: [
              { name: "title", labelKey: "content.cardTitle", type: "text" },
              { name: "href", labelKey: "content.cardLink", type: "text" },
              { name: "contentHtml", labelKey: "content.cardContent", type: "html" },
            ],
          },
        },
      },
    ],
  },
  {
    key: "footer",
    textSections: {
      path: "footer.textSectionsHtml",
      labelKey: "content.footerTextSections",
      addLabelKey: "content.addTextSection",
    },
    fields: [
      { path: "footer.logo.logoSrc", labelKey: "content.logoSrc", type: "text" },
      { path: "footer.logo.logoAltText", labelKey: "content.logoAlt", type: "text" },
      { path: "footer.logo.logoUrl", labelKey: "content.logoUrl", type: "text" },
    ],
    lists: [
      {
        listPath: "footer.links",
        labelKey: "content.footerLinks",
        addLabelKey: "content.addLink",
        item: {
          titleKey: "content.footerLink",
          displayField: "text",
          fields: [
            { name: "text", labelKey: "content.linkText", type: "text" },
            { name: "href", labelKey: "content.linkHref", type: "text" },
          ],
        },
      },
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
  const [resetCount, setResetCount] = useState(0)
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

  // The editor is rebuilt with its content rather than having content set afterwards, so the
  // character count reads the loaded value instead of an empty document. The key changes only when
  // a field switches between falling back and holding a value.
  const seedKeyFor = (path: string) =>
    `${scope}|${resetCount}|${fieldState(valueAt(draft, path)) === "fallback" ? "fallback" : "value"
    }`
  const contentFor = (path: string) => {
    const value = valueAt(draft, path)
    return typeof value === "string" ? value : ""
  }

  const privacySeed = seedKeyFor("disclaimers.privacyHtml")
  const privacyEditor = useEditor(
    {
      extensions: EditorExtensions,
      immediatelyRender: false,
      content: contentFor("disclaimers.privacyHtml"),
      onUpdate: ({ editor }) =>
        editField("disclaimers.privacyHtml", normalizeRichText(editor.getHTML())),
    },
    [privacySeed]
  )

  const disclaimerSeed = seedKeyFor("disclaimers.disclaimerHtml")
  const disclaimerEditor = useEditor(
    {
      extensions: EditorExtensions,
      immediatelyRender: false,
      content: contentFor("disclaimers.disclaimerHtml"),
      onUpdate: ({ editor }) =>
        editField("disclaimers.disclaimerHtml", normalizeRichText(editor.getHTML())),
    },
    [disclaimerSeed]
  )

  const addressSeed = seedKeyFor("contact.addressHtml")
  const addressEditor = useEditor(
    {
      extensions: EditorExtensions,
      immediatelyRender: false,
      content: contentFor("contact.addressHtml"),
      onUpdate: ({ editor }) =>
        editField("contact.addressHtml", normalizeRichText(editor.getHTML())),
    },
    [addressSeed]
  )

  const editors: Record<string, { editor: Editor | null; seed: string }> = {
    "disclaimers.privacyHtml": { editor: privacyEditor, seed: privacySeed },
    "disclaimers.disclaimerHtml": { editor: disclaimerEditor, seed: disclaimerSeed },
    "contact.addressHtml": { editor: addressEditor, seed: addressSeed },
  }

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

  const [drawer, setDrawer] = useState<{
    basePath: string
    titleKey: string
    fields: ItemField[]
  } | null>(null)

  const addItem = (listPath: string, item: { titleKey: string; fields: ItemField[] }) => {
    const id = newItemId()
    setDraft((current) => addListItem(current, listPath, { id }))
    setDrawer({ basePath: `${listPath}[${id}]`, titleKey: item.titleKey, fields: item.fields })
  }

  const removeItem = (listPath: string, id: string) => {
    setDraft((current) =>
      isEnglish ? removeListItem(current, listPath, id) : tombstoneListItem(current, listPath, id)
    )
  }

  const restoreItem = (listPath: string, id: string) => {
    setDraft((current) => restoreListItem(current, listPath, id))
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
    const paths = DOCUMENTS.flatMap((entry) => (entry.fields ?? []).map((field) => field.path))
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

  const activeDocument = DOCUMENTS.find((entry) => entry.key === document)
  const activeFields = activeDocument?.fields ?? []

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
          <div className={styles["actions"]}>
            <Button
              variant="primary-outlined"
              disabled={!hasUnsavedChanges || isSaving}
              onClick={() => {
                setDraftState(null)
                setDrawer(null)
                setResetCount((count) => count + 1)
              }}
            >
              {t("content.discardChanges")}
            </Button>
            <Button
              variant="primary"
              disabled={!hasUnsavedChanges || loading}
              loadingMessage={isSaving && t("t.loading")}
              onClick={handleSave}
            >
              {t("t.save")}
            </Button>
          </div>
        </div>

        {loading && <p className={styles["status"]}>{t("t.loading")}</p>}

        {!loading &&
          activeFields.map((field) => {
            const value = valueAt(draft, field.path)
            const state = fieldState(value)
            const englishValue = valueAt(englishDraft, field.path)
            const stale = isStale(languageRow?.staleFields, field.path)
            const editorEntry = editors[field.path]

            return (
              <Card key={field.path} className={styles["field-card"]}>
                <Card.Section>
                  <div className={styles["field-header"]}>
                    {state === "fallback" && (
                      <span className={styles["field-label"]}>{t(field.labelKey)}</span>
                    )}
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
                      {field.type === "html" && editorEntry?.editor ? (
                        <>
                          <TextEditor
                            key={editorEntry.seed}
                            editor={editorEntry.editor}
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
                          key={`${activeJurisdictionId}-${activeLanguage}-${resetCount}-${field.path}`}
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
        {!loading &&
          activeDocument?.textSections &&
          (() => {
            const config = activeDocument.textSections
            const sections = textSections(valueAt(draft, config.path))

            return (
              <Card className={styles["field-card"]}>
                <Card.Section>
                  <div className={styles["field-header"]}>
                    <span className={styles["field-label"]}>{t(config.labelKey)}</span>
                    <Button
                      variant="primary-outlined"
                      size="sm"
                      onClick={() => setDraft((current) => addTextSection(current, config.path))}
                    >
                      {t(config.addLabelKey)}
                    </Button>
                  </div>
                  {!isEnglish && (
                    <p className={styles["note"]}>{t("content.positionalListNote")}</p>
                  )}
                  {sections.length === 0 && <p>{t("content.emptyList")}</p>}
                  {sections.map((section, index) => (
                    <div key={index} className={styles["section-row"]} dir={direction}>
                      <TextEditorContent content={section} />
                      <div>
                        <Button
                          variant="text"
                          size="sm"
                          onClick={() =>
                            setDrawer({
                              basePath: config.path,
                              titleKey: config.labelKey,
                              fields: [
                                {
                                  name: String(index),
                                  labelKey: "content.textSection",
                                  type: "html",
                                },
                              ],
                            })
                          }
                        >
                          {t("t.edit")}
                        </Button>
                        <Button
                          variant="text"
                          size="sm"
                          onClick={() =>
                            setDraft((current) => removeTextSection(current, config.path, index))
                          }
                        >
                          {t("t.delete")}
                        </Button>
                      </div>
                    </div>
                  ))}
                </Card.Section>
              </Card>
            )
          })()}

        {!loading &&
          (activeDocument?.lists ?? []).map((list) => (
            <ContentList
              key={list.listPath}
              listPath={list.listPath}
              labelKey={list.labelKey}
              addLabelKey={list.addLabelKey}
              displayField={list.item.displayField}
              draft={draft}
              englishDraft={englishDraft}
              isEnglish={isEnglish}
              staleFields={languageRow?.staleFields}
              onEdit={(itemPath) =>
                setDrawer({
                  basePath: itemPath,
                  titleKey: list.item.titleKey,
                  fields: list.item.fields,
                })
              }
              onAdd={() => addItem(list.listPath, list.item)}
              onRemove={(id) => removeItem(list.listPath, id)}
              onRestore={(id) => restoreItem(list.listPath, id)}
            >
              {list.nested
                ? (row) => {
                  const nested = list.nested
                  const nestedPath = `${list.listPath}[${row.id}].${nested.field}`
                  return (
                    <div className={styles["nested-list"]}>
                      <ContentList
                        listPath={nestedPath}
                        labelKey={nested.labelKey}
                        addLabelKey={nested.addLabelKey}
                        displayField={nested.item.displayField}
                        draft={draft}
                        englishDraft={englishDraft}
                        isEnglish={isEnglish}
                        staleFields={languageRow?.staleFields}
                        onEdit={(itemPath) =>
                          setDrawer({
                            basePath: itemPath,
                            titleKey: nested.item.titleKey,
                            fields: nested.item.fields,
                          })
                        }
                        onAdd={() => addItem(nestedPath, nested.item)}
                        onRemove={(id) => removeItem(nestedPath, id)}
                        onRestore={(id) => restoreItem(nestedPath, id)}
                      />
                    </div>
                  )
                }
                : undefined}
            </ContentList>
          ))}
      </TabView>

      <ContentItemDrawer
        basePath={drawer?.basePath ?? null}
        titleKey={drawer?.titleKey ?? "content.document"}
        fields={drawer?.fields ?? []}
        draft={draft}
        englishDraft={englishDraft}
        isEnglish={isEnglish}
        staleFields={languageRow?.staleFields}
        direction={direction}
        onChange={(next) => setDraft(() => next)}
        onClose={() => setDrawer(null)}
      />

      <ContentConflictDialog
        isOpen={conflict}
        isLoading={isSaving}
        onClose={() => setConflict(false)}
        onDiscard={() => {
          setConflict(false)
          setDraftState(null)
          setResetCount((count) => count + 1)
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
