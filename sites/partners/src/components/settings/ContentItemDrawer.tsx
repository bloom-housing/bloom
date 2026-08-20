import React from "react"
import { Field, t } from "@bloom-housing/ui-components"
import { Button, Drawer, FieldValue, Tag } from "@bloom-housing/ui-seeds"
import { useEditor } from "@tiptap/react"
import {
  ContentDraft,
  clearValueAt,
  fieldState,
  isStale,
  normalizeRichText,
  setValueAt,
  valueAt,
} from "../../lib/contentEditor"
import { EditorExtensions, TextEditor, TextEditorContent } from "../shared/TextEditor"
import styles from "./ContentItemDrawer.module.scss"

export type ItemField = { name: string; labelKey: string; type: "text" | "html" }

type ContentItemDrawerProps = {
  /** The item being edited, e.g. `faq.categories[applying].items[how]`, or null when closed. */
  basePath: string | null
  titleKey: string
  fields: ItemField[]
  draft: ContentDraft
  englishDraft: ContentDraft
  isEnglish: boolean
  staleFields?: string[]
  direction: "ltr" | "rtl"
  onChange: (draft: ContentDraft) => void
  onClose: () => void
}

/**
 * Edits one list item at a time, which is also what keeps the number of live rich-text editors to
 * one: `TextEditor` takes an editor its parent creates, and hooks cannot be created per row.
 * At most one field of an item is rich text.
 */
export const ContentItemDrawer = ({
  basePath,
  titleKey,
  fields,
  draft,
  englishDraft,
  isEnglish,
  staleFields,
  direction,
  onChange,
  onClose,
}: ContentItemDrawerProps) => {
  const htmlField = fields.find((field) => field.type === "html")
  const htmlPath = basePath && htmlField ? `${basePath}.${htmlField.name}` : null
  const htmlValue = htmlPath ? valueAt(draft, htmlPath) : undefined

  // Rebuilt with its content rather than seeded afterwards, so the character count reads the value
  // being edited. The key changes when the drawer opens on another item, or when the field switches
  // between falling back and holding a value.
  const seed = `${basePath ?? ""}|${htmlValue === undefined ? "fallback" : "value"}`
  const editor = useEditor(
    {
      extensions: EditorExtensions,
      immediatelyRender: false,
      content: typeof htmlValue === "string" ? htmlValue : "",
      onUpdate: ({ editor: instance }) => {
        if (htmlPath) onChange(setValueAt(draft, htmlPath, normalizeRichText(instance.getHTML())))
      },
    },
    [seed]
  )

  if (!basePath) return null

  return (
    <Drawer isOpen onClose={onClose} ariaLabelledBy="content-item-drawer-header">
      <Drawer.Header id="content-item-drawer-header">{t(titleKey)}</Drawer.Header>
      <Drawer.Content>
        {fields.map((field) => {
          const path = `${basePath}.${field.name}`
          const value = valueAt(draft, path)
          const englishValue = valueAt(englishDraft, path)
          const state = fieldState(value)

          return (
            <div key={field.name} className={styles["field"]}>
              <div className={styles["field-header"]}>
                <span className={styles["field-label"]}>{t(field.labelKey)}</span>
                {state === "fallback" && (
                  <Tag variant="secondary">
                    {isEnglish ? t("content.notSet") : t("content.usingEnglish")}
                  </Tag>
                )}
                {state === "hidden" && <Tag variant="secondary">{t("content.hidden")}</Tag>}
                {isStale(staleFields, path) && (
                  <Tag variant="highlight-warm">{t("content.stale")}</Tag>
                )}
              </div>

              {!isEnglish && (
                <FieldValue label={t("content.englishSource")}>
                  {field.type === "html" && typeof englishValue === "string" ? (
                    <TextEditorContent content={englishValue} />
                  ) : (
                    <span>{(englishValue as string) ?? t("content.notSet")}</span>
                  )}
                </FieldValue>
              )}

              {state === "fallback" ? (
                <Button
                  variant="primary-outlined"
                  size="sm"
                  onClick={() =>
                    onChange(
                      setValueAt(
                        draft,
                        path,
                        isEnglish || typeof englishValue !== "string" ? "" : englishValue
                      )
                    )
                  }
                >
                  {isEnglish ? t("content.setValue") : t("content.override")}
                </Button>
              ) : (
                <div className={styles["field-editor"]} dir={direction}>
                  {field.type === "html" && editor ? (
                    <>
                      <TextEditor
                        key={seed}
                        editor={editor}
                        label={t(field.labelKey)}
                        editorId={path}
                      />
                      <FieldValue label={t("content.preview")}>
                        <TextEditorContent content={(value as string) ?? ""} />
                      </FieldValue>
                    </>
                  ) : (
                    <Field
                      key={path}
                      id={path}
                      name={path}
                      label={t(field.labelKey)}
                      defaultValue={(value as string) ?? ""}
                      inputProps={{
                        onChange: (event: React.ChangeEvent<HTMLInputElement>) =>
                          onChange(setValueAt(draft, path, event.target.value)),
                      }}
                    />
                  )}
                  <Button
                    variant="text"
                    size="sm"
                    onClick={() => onChange(clearValueAt(draft, path))}
                  >
                    {isEnglish ? t("content.clear") : t("content.revertToEnglish")}
                  </Button>
                </div>
              )}
            </div>
          )
        })}
      </Drawer.Content>
      <Drawer.Footer>
        <Button variant="primary" onClick={onClose}>
          {t("t.done")}
        </Button>
      </Drawer.Footer>
    </Drawer>
  )
}
