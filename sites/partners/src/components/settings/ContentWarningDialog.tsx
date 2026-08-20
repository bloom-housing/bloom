import React from "react"
import { t } from "@bloom-housing/ui-components"
import { Button, Dialog } from "@bloom-housing/ui-seeds"

type ContentWarningDialogProps = {
  hidingPaths: string[]
  isLoading: boolean
  onClose: () => void
  onConfirm: () => void
}

export const ContentWarningDialog = ({
  hidingPaths,
  isLoading,
  onClose,
  onConfirm,
}: ContentWarningDialogProps) => (
  <Dialog
    isOpen={hidingPaths.length > 0}
    onClose={onClose}
    ariaLabelledBy="content-warning-header"
    ariaDescribedBy="content-warning-description"
  >
    <Dialog.Header id="content-warning-header">{t("content.hideWarningTitle")}</Dialog.Header>
    <Dialog.Content>
      <div id="content-warning-description">
        <p className="pb-2">{t("content.hideWarningDescription")}</p>
        <ul className="list-disc pl-6">
          {hidingPaths.map((path) => (
            <li key={path}>{path}</li>
          ))}
        </ul>
      </div>
    </Dialog.Content>
    <Dialog.Footer>
      <Button variant="primary" onClick={onConfirm} loadingMessage={isLoading && t("t.loading")}>
        {t("t.save")}
      </Button>
      <Button variant="primary-outlined" onClick={onClose} disabled={isLoading}>
        {t("t.cancel")}
      </Button>
    </Dialog.Footer>
  </Dialog>
)
