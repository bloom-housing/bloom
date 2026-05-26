import React from "react"
import { t } from "@bloom-housing/ui-components"
import { Button, Dialog } from "@bloom-housing/ui-seeds"

type PublishScheduledListingDialogProps = {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void | Promise<void>
}

const PublishScheduledListingDialog = ({
  isOpen,
  onClose,
  onConfirm,
}: PublishScheduledListingDialogProps) => {
  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      ariaLabelledBy="publish-scheduled-listing-dialog-header"
      ariaDescribedBy="publish-scheduled-listing-dialog-content"
    >
      <Dialog.Header id="publish-scheduled-listing-dialog-header">
        {t("t.areYouSure")}
      </Dialog.Header>
      <Dialog.Content id="publish-scheduled-listing-dialog-content">
        {t("listings.approval.publishScheduledDialogContent")}
      </Dialog.Content>
      <Dialog.Footer>
        <Button
          id="publishScheduledListingButtonConfirm"
          type="button"
          variant="success"
          size="sm"
          onClick={onConfirm}
        >
          {t("listings.actions.publish")}
        </Button>
        <Button type="button" onClick={onClose} size="sm">
          {t("t.cancel")}
        </Button>
      </Dialog.Footer>
    </Dialog>
  )
}

export default PublishScheduledListingDialog
