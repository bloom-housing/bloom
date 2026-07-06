import React from "react"
import { ListingsStatusEnum } from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { Button, Dialog } from "@bloom-housing/ui-seeds"
import { t } from "@bloom-housing/ui-components"
import { SubmitFunction } from "../index"
import { getValidFutureScheduledDate } from "../../helpers"

export interface PublishListingDialogProps {
  isOpen: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  submitFormWithStatus: SubmitFunction
  enableAutopublish?: boolean
  scheduledPublishAt?: Date | string | null
}

const PublishListingDialog = ({
  isOpen,
  setOpen,
  submitFormWithStatus,
  enableAutopublish,
  scheduledPublishAt,
}: PublishListingDialogProps) => {
  const scheduledDate = enableAutopublish ? getValidFutureScheduledDate(scheduledPublishAt) : false

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
        {scheduledDate
          ? t("listings.approval.adminPublishWithScheduledDate", { date: scheduledDate })
          : t("listings.publishThisListing")}
      </Dialog.Content>
      <Dialog.Footer>
        <Button
          id="publishButtonConfirm"
          type="button"
          variant={scheduledDate ? "primary" : "success"}
          onClick={() => {
            setOpen(false)
            submitFormWithStatus(
              "redirect",
              scheduledDate ? ListingsStatusEnum.scheduled : ListingsStatusEnum.active
            )
          }}
          size="sm"
        >
          {scheduledDate ? t("t.submit") : t("listings.actions.publish")}
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
