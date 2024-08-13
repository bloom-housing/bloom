import React from "react"
import { ListingsStatusEnum } from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { Button, Dialog } from "@bloom-housing/ui-seeds"
import { t } from "@bloom-housing/ui-components"
import { SubmitFunction } from "../index"

export interface LiveConfirmationDialogProps {
  isOpen: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  submitFormWithStatus: SubmitFunction
}

const LiveConfirmationDialog = ({
  isOpen,
  setOpen,
  submitFormWithStatus,
}: LiveConfirmationDialogProps) => {
  return (
    <Dialog
      isOpen={isOpen}
      onClose={() => setOpen(false)}
      ariaLabelledBy="listing-form-live-confirmation-dialog-header"
      ariaDescribedBy="listing-form-live-confirmation-dialog-content"
    >
      <Dialog.Header id="listing-form-live-confirmation-dialog-header">
        {t("t.areYouSure")}
      </Dialog.Header>
      <Dialog.Content id="listing-form-live-confirmation-dialog-content">
        {t("listings.listingIsAlreadyLive")}
      </Dialog.Content>
      <Dialog.Footer>
        <Button
          id="saveAlreadyLiveListingButtonConfirm"
          type="button"
          variant="success"
          onClick={() => {
            setOpen(false)
            submitFormWithStatus("redirect", ListingsStatusEnum.active)
          }}
          size="sm"
        >
          {t("t.save")}
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

export { LiveConfirmationDialog as default }
