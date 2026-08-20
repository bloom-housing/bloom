import React from "react"
import { t } from "@bloom-housing/ui-components"
import { Button, Dialog } from "@bloom-housing/ui-seeds"

type ContentConflictDialogProps = {
  isOpen: boolean
  isLoading: boolean
  onClose: () => void
  onDiscard: () => void
  onOverwrite: () => void
}

/**
 * A content save replaces the whole row, which makes a conflict row-level instead of per field: someone
 * else saved this language since it was loaded. The admin either keeps their work and writes over
 * that save, or drops it and reloads.
 */
export const ContentConflictDialog = ({
  isOpen,
  isLoading,
  onClose,
  onDiscard,
  onOverwrite,
}: ContentConflictDialogProps) => (
  <Dialog
    isOpen={isOpen}
    onClose={onClose}
    ariaLabelledBy="content-conflict-header"
    ariaDescribedBy="content-conflict-description"
  >
    <Dialog.Header id="content-conflict-header">{t("content.conflictTitle")}</Dialog.Header>
    <Dialog.Content>
      <p id="content-conflict-description">{t("content.conflictDescription")}</p>
    </Dialog.Content>
    <Dialog.Footer>
      <Button variant="primary" onClick={onOverwrite} loadingMessage={isLoading && t("t.loading")}>
        {t("content.conflictOverwrite")}
      </Button>
      <Button variant="primary-outlined" onClick={onDiscard} disabled={isLoading}>
        {t("content.conflictDiscard")}
      </Button>
    </Dialog.Footer>
  </Dialog>
)
