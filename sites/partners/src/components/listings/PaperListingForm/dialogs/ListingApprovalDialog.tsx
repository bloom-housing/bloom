import React from "react"
import { ListingsStatusEnum } from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { Button, Dialog } from "@bloom-housing/ui-seeds"
import { t } from "@bloom-housing/ui-components"
import { SubmitFunction } from "../index"

export interface ListingApprovalDialogProps {
  isOpen: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  submitFormWithStatus: SubmitFunction
}

const ListingApprovalDialog = ({
  isOpen,
  setOpen,
  submitFormWithStatus,
}: ListingApprovalDialogProps) => {
  return (
    <Dialog
      isOpen={isOpen}
      onClose={() => setOpen(false)}
      ariaLabelledBy="listing-form-approval-dialog-header"
      ariaDescribedBy="listing-form-approval-dialog-content"
    >
      <Dialog.Header id="listing-form-approval-dialog-header">{t("t.areYouSure")}</Dialog.Header>
      <Dialog.Content id="listing-form-approval-dialog-content">
        {t("listings.approval.submitForApprovalDescription")}
      </Dialog.Content>
      <Dialog.Footer>
        <Button
          id="submitListingForApprovalButtonConfirm"
          type="button"
          variant="success"
          onClick={() => {
            setOpen(false)
            submitFormWithStatus("redirect", ListingsStatusEnum.pendingReview)
          }}
          size="sm"
        >
          {t("t.submit")}
        </Button>
        <Button
          type="button"
          onClick={() => {
            setOpen(false)
          }}
          size="sm"
        >
          {t("t.cancel")}
        </Button>
      </Dialog.Footer>
    </Dialog>
  )
}

export { ListingApprovalDialog as default }
