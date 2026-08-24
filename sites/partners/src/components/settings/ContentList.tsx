import React from "react"
import { t } from "@bloom-housing/ui-components"
import { Button, Card, Heading, Tag } from "@bloom-housing/ui-seeds"
import { ContentDraft, ListRow, isStaleWithin, listRows, valueAt } from "../../lib/contentEditor"
import styles from "./ContentList.module.scss"

export type ContentListProps = {
  /** Where the list lives, e.g. `faq.categories` or `faq.categories[applying].items`. */
  listPath: string
  labelKey: string
  addLabelKey: string
  displayField: string
  draft: ContentDraft
  englishDraft: ContentDraft
  isEnglish: boolean
  staleFields?: string[]
  onEdit: (itemPath: string) => void
  onAdd: () => void
  onRemove: (id: string) => void
  onRestore: (id: string) => void
  /** Rendered under each row, for a list that holds another list. */
  children?: (row: ListRow) => React.ReactNode
}

const displayText = (row: ListRow, field: string) => {
  const value = (row.override?.[field] ?? row.english?.[field]) as string | undefined
  if (!value) return t("content.untitledItem")
  // A rich-text field would otherwise show its markup in the row.
  return value.replace(/<[^>]*>/g, " ").trim() || t("content.untitledItem")
}

export const ContentList = ({
  listPath,
  labelKey,
  addLabelKey,
  displayField,
  draft,
  englishDraft,
  isEnglish,
  staleFields,
  onEdit,
  onAdd,
  onRemove,
  onRestore,
  children,
}: ContentListProps) => {
  const rows = listRows(valueAt(englishDraft, listPath), valueAt(draft, listPath))

  return (
    <Card className={styles["list"]}>
      <Card.Section>
        <div className={styles["header"]}>
          <Heading size="md">{t(labelKey)}</Heading>
          <Button variant="primary-outlined" size="sm" onClick={onAdd}>
            {t(addLabelKey)}
          </Button>
        </div>

        {rows.length === 0 && <p className={styles["empty"]}>{t("content.emptyList")}</p>}

        {rows.map((row) => {
          const itemPath = `${listPath}[${row.id}]`
          const stale = isStaleWithin(staleFields, itemPath)

          return (
            <div key={row.id} className={styles["row"]}>
              <div className={styles["row-main"]}>
                <span className={row.deleted ? styles["deleted-text"] : undefined}>
                  {displayText(row, displayField)}
                </span>
                {row.deleted && <Tag variant="secondary">{t("content.removedForLanguage")}</Tag>}
                {!row.deleted && !isEnglish && !row.english && (
                  <Tag variant="secondary">{t("content.languageOnly")}</Tag>
                )}
                {!row.deleted && !isEnglish && row.english && !row.override && (
                  <Tag variant="secondary">{t("content.usingEnglish")}</Tag>
                )}
                {stale && <Tag variant="highlight-warm">{t("content.stale")}</Tag>}
              </div>
              <div className={styles["row-actions"]}>
                {row.deleted ? (
                  <Button variant="text" size="sm" onClick={() => onRestore(row.id)}>
                    {t("content.restore")}
                  </Button>
                ) : (
                  <>
                    <Button variant="text" size="sm" onClick={() => onEdit(itemPath)}>
                      {t("t.edit")}
                    </Button>
                    <Button variant="text" size="sm" onClick={() => onRemove(row.id)}>
                      {isEnglish ? t("t.delete") : t("content.removeForLanguage")}
                    </Button>
                  </>
                )}
              </div>
              {!row.deleted && children?.(row)}
            </div>
          )
        })}
      </Card.Section>
    </Card>
  )
}
