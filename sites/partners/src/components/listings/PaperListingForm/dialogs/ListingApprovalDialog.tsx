import React from "react"
import dayjs from "dayjs"
import utc from "dayjs/plugin/utc"
dayjs.extend(utc)
import { ListingsStatusEnum } from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { Button, Dialog } from "@bloom-housing/ui-seeds"
import { t } from "@bloom-housing/ui-components"
import type { SubmitFunction } from "../index"

export interface ListingApprovalDialogProps {
  isOpen: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  submitFormWithStatus: SubmitFunction
  enableAutopublish?: boolean
  scheduledPublishAt?: Date | string | null
}

const ListingApprovalDialog = ({
  isOpen,
  setOpen,
  submitFormWithStatus,
  enableAutopublish,
  scheduledPublishAt,
}: ListingApprovalDialogProps) => {
  let content: string
  if (enableAutopublish) {
    if (scheduledPublishAt && dayjs.utc(scheduledPublishAt).isValid()) {
      content = t("listings.approval.submitForApprovalWithScheduledDate", {
        date: dayjs.utc(scheduledPublishAt).format("MM/DD/YYYY"),
      })
    } else {
      content = t("listings.approval.submitForApprovalNoScheduledDate")
    }
  } else {
    content = t("listings.approval.submitForApprovalDescription")
  }

  return (
    <Dialog
      isOpen={isOpen}
      onClose={() => setOpen(false)}
      ariaLabelledBy="listing-form-approval-dialog-header"
      ariaDescribedBy="listing-form-approval-dialog-content"
    >
      <Dialog.Header id="listing-form-approval-dialog-header">{t("t.areYouSure")}</Dialog.Header>
      <Dialog.Content id="listing-form-approval-dialog-content">{content}</Dialog.Content>
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
