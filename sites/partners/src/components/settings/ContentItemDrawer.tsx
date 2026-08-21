import React from "react"
import { t } from "@bloom-housing/ui-components"
import { Button, Drawer } from "@bloom-housing/ui-seeds"
import { ContentDraft, isStale } from "../../lib/contentEditor"
import { ContentFieldCard, ContentFieldType } from "./ContentFieldCard"
import styles from "./ContentItemDrawer.module.scss"

export type ItemField = { name: string; labelKey: string; type: ContentFieldType }

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
  if (!basePath) return null

  return (
    <Drawer isOpen onClose={onClose} ariaLabelledBy="content-item-drawer-header">
      <Drawer.Header id="content-item-drawer-header">{t(titleKey)}</Drawer.Header>
      <Drawer.Content>
        {fields.map((field) => {
          const path = `${basePath}.${field.name}`

          return (
            <ContentFieldCard
              key={field.name}
              className={styles["field"]}
              path={path}
              labelKey={field.labelKey}
              type={field.type}
              draft={draft}
              englishDraft={englishDraft}
              isEnglish={isEnglish}
              stale={isStale(staleFields, path)}
              direction={direction}
              resetKey={basePath}
              onChange={onChange}
            />
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
