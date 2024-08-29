import React from "react"
import { ListingsStatusEnum } from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { Button, Dialog } from "@bloom-housing/ui-seeds"
import { t } from "@bloom-housing/ui-components"
import { SubmitFunction } from "../index"

export interface CloseListingDialogProps {
  isOpen: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  submitFormWithStatus: SubmitFunction
}

const CloseListingDialog = ({ isOpen, setOpen, submitFormWithStatus }: CloseListingDialogProps) => {
  return (
    <Dialog
      isOpen={isOpen}
      onClose={() => setOpen(false)}
      ariaLabelledBy="listing-form-close-listing-dialog-header"
      ariaDescribedBy="listing-form-close-listing-dialog-content"
    >
      <Dialog.Header id="listing-form-close-listing-dialog-header">
        {t("t.areYouSure")}
      </Dialog.Header>
      <Dialog.Content id="listing-form-close-listing-dialog-content">
        {t("listings.closeThisListing")}
      </Dialog.Content>
      <Dialog.Footer>
        <Button
          type="button"
          variant="secondary"
          onClick={() => {
            setOpen(false)
            submitFormWithStatus("redirect", ListingsStatusEnum.closed)
          }}
          size="sm"
        >
          {t("listings.actions.close")}
        </Button>
        <Button
          type="button"
          variant="primary-outlined"
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

export { CloseListingDialog as default }
