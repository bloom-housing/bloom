import React from "react"
import { Field, t } from "@bloom-housing/ui-components"
import { Button, Card, FieldValue, Tag } from "@bloom-housing/ui-seeds"
import { useEditor } from "@tiptap/react"
import {
  ContentDraft,
  clearValueAt,
  fieldState,
  normalizeRichText,
  setValueAt,
  valueAt,
} from "../../lib/contentEditor"
import { EditorExtensions, TextEditor, TextEditorContent } from "../shared/TextEditor"
import styles from "./ContentFieldCard.module.scss"

export type ContentFieldType = "text" | "html"

type RichTextControlProps = {
  path: string
  labelKey: string
  value: string
  onEdit: (value: string) => void
}

const RichTextControl = ({ path, labelKey, value, onEdit }: RichTextControlProps) => {
  const editor = useEditor({
    extensions: EditorExtensions,
    immediatelyRender: false,
    content: value,
    onUpdate: ({ editor: instance }) => onEdit(normalizeRichText(instance.getHTML())),
  })

  if (!editor) return null

  return (
    <>
      <TextEditor editor={editor} label={t(labelKey)} editorId={path} />
      <div className={styles["preview"]}>
        <FieldValue label={t("content.preview")}>
          <TextEditorContent content={value} />
        </FieldValue>
      </div>
    </>
  )
}

type ContentFieldCardProps = {
  /** The field being edited, e.g. `contact.phone` or `faq.categories[applying].title`. */
  path: string
  labelKey: string
  type: ContentFieldType
  draft: ContentDraft
  englishDraft: ContentDraft
  isEnglish: boolean
  stale: boolean
  direction: "ltr" | "rtl"
  resetKey: string
  className?: string
  onChange: (draft: ContentDraft) => void
}

export const ContentFieldCard = ({
  path,
  labelKey,
  type,
  draft,
  englishDraft,
  isEnglish,
  stale,
  direction,
  resetKey,
  className,
  onChange,
}: ContentFieldCardProps) => {
  const value = valueAt(draft, path)
  const state = fieldState(value)
  const englishValue = valueAt(englishDraft, path)
  const stringValue = typeof value === "string" ? value : ""

  return (
    <Card className={className}>
      <Card.Section>
        <div className={styles["field-header"]}>
          {state === "fallback" && <span className={styles["field-label"]}>{t(labelKey)}</span>}
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
              {type === "html" && typeof englishValue === "string" ? (
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
            {type === "html" ? (
              <RichTextControl
                key={resetKey}
                path={path}
                labelKey={labelKey}
                value={stringValue}
                onEdit={(next) => onChange(setValueAt(draft, path, next))}
              />
            ) : (
              <Field
                key={resetKey}
                id={path}
                name={path}
                label={t(labelKey)}
                defaultValue={stringValue}
                inputProps={{
                  onChange: (event: React.ChangeEvent<HTMLInputElement>) =>
                    onChange(setValueAt(draft, path, event.target.value)),
                }}
              />
            )}
            <Button variant="text" size="sm" onClick={() => onChange(clearValueAt(draft, path))}>
              {isEnglish ? t("content.clear") : t("content.revertToEnglish")}
            </Button>
          </div>
        )}
      </Card.Section>
    </Card>
  )
}
