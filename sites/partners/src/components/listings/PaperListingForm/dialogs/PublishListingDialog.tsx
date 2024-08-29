import React from "react"
import { ListingsStatusEnum } from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { Button, Dialog } from "@bloom-housing/ui-seeds"
import { t } from "@bloom-housing/ui-components"
import { SubmitFunction } from "../index"

export interface PublishListingDialogProps {
  isOpen: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  submitFormWithStatus: SubmitFunction
}

const PublishListingDialog = ({
  isOpen,
  setOpen,
  submitFormWithStatus,
}: PublishListingDialogProps) => {
  return (
    <Dialog
      isOpen={!!isOpen}
      onClose={() => setOpen(false)}
      ariaLabelledBy="listing-form-publish-listing-dialog-header"
      ariaDescribedBy="listing-form-publish-listing-dialog-content"
    >
      <Dialog.Header id="listing-form-publish-listing-dialog-header">
        {t("t.areYouSure")}
      </Dialog.Header>
      <Dialog.Content id="listing-form-publish-listing-dialog-content">
        {t("listings.publishThisListing")}
      </Dialog.Content>
      <Dialog.Footer>
        <Button
          id="publishButtonConfirm"
          type="button"
          variant="success"
          onClick={() => {
            setOpen(false)
            submitFormWithStatus("redirect", ListingsStatusEnum.active)
          }}
          size="sm"
        >
          {t("listings.actions.publish")}
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

export { PublishListingDialog as default }
