import React from "react"
import {
  EnumListingListingType,
  ListingsStatusEnum,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { Button, Dialog } from "@bloom-housing/ui-seeds"
import { t } from "@bloom-housing/ui-components"
import { SubmitFunction } from "../index"
import { getValidFutureScheduledDate, publishesLandUseToClosed } from "../../helpers"

export interface PublishListingDialogProps {
  isOpen: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  submitFormWithStatus: SubmitFunction
  enableAutopublish?: boolean
  enableLandUse?: boolean
  listingType?: EnumListingListingType
  listingStatus?: ListingsStatusEnum
  scheduledPublishAt?: Date | string | null
}

const PublishListingDialog = ({
  isOpen,
  setOpen,
  submitFormWithStatus,
  enableAutopublish,
  enableLandUse,
  listingType,
  listingStatus,
  scheduledPublishAt,
}: PublishListingDialogProps) => {
  const scheduledDate = enableAutopublish ? getValidFutureScheduledDate(scheduledPublishAt) : false
  const publishesToClosed =
    listingStatus !== ListingsStatusEnum.closed &&
    publishesLandUseToClosed({
      listingType,
      enableLandUse,
      enableAutopublish,
      scheduledPublishAt,
    })

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
          : publishesToClosed
          ? t("listings.approval.landUseNoScheduledDate")
          : t("listings.publishThisListing")}
      </Dialog.Content>
      <Dialog.Footer>
        <Button
          id="publishButtonConfirm"
          type="button"
          variant={scheduledDate || publishesToClosed ? "primary" : "success"}
          onClick={() => {
            setOpen(false)
            submitFormWithStatus(
              "redirect",
              scheduledDate
                ? ListingsStatusEnum.scheduled
                : publishesToClosed
                ? ListingsStatusEnum.closed
                : ListingsStatusEnum.active
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
