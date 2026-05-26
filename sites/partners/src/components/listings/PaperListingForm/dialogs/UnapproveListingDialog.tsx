import React from "react"
import { t } from "@bloom-housing/ui-components"
import { Button, Dialog } from "@bloom-housing/ui-seeds"

type UnapproveListingDialogProps = {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void | Promise<void>
}

const UnapproveListingDialog = ({ isOpen, onClose, onConfirm }: UnapproveListingDialogProps) => {
  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      ariaLabelledBy="unapprove-listing-dialog-header"
      ariaDescribedBy="unapprove-listing-dialog-content"
    >
      <Dialog.Header id="unapprove-listing-dialog-header">{t("t.areYouSure")}</Dialog.Header>
      <Dialog.Content id="unapprove-listing-dialog-content">
        {t("listings.approval.unapproveDialogContent")}
      </Dialog.Content>
      <Dialog.Footer>
        <Button
          id="unapproveListingButtonConfirm"
          type="button"
          variant="alert-outlined"
          size="sm"
          onClick={onConfirm}
        >
          {t("listings.approval.unapprove")}
        </Button>
        <Button type="button" onClick={onClose} size="sm">
          {t("t.cancel")}
        </Button>
      </Dialog.Footer>
    </Dialog>
  )
}

export default UnapproveListingDialog
