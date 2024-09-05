import React from "react"
import { ListingsStatusEnum } from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { Button, Dialog } from "@bloom-housing/ui-seeds"
import { t } from "@bloom-housing/ui-components"
import { SubmitFunction } from "../index"

export interface CopyListingDialogProps {
  isOpen: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  submitFormWithStatus: SubmitFunction
}

const CopyListingDialog = ({ isOpen, setOpen, submitFormWithStatus }: CopyListingDialogProps) => {
  return (
    <Dialog
      isOpen={isOpen}
      onClose={() => setOpen(false)}
      ariaLabelledBy="listing-form-copy-listing-dialog-header"
      ariaDescribedBy="listing-form-copy-listing-dialog-content"
    >
      <Dialog.Header id="listing-form-copy-listing-dialog-header">
        {t("t.areYouSure")}
      </Dialog.Header>
      <Dialog.Content id="listing-form-copy-listing-dialog-content">
        {t("listings.copyThisListing")}
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
          id={"copy-listing-modal-button"}
        >
          {t("listings.actions.copy")}
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

export { CopyListingDialog as default }
