import React from "react"
import dayjs from "dayjs"
import utc from "dayjs/plugin/utc"
dayjs.extend(utc)
import { t } from "@bloom-housing/ui-components"
import { Button, Dialog } from "@bloom-housing/ui-seeds"
import { SubmitFunction } from "../index"
import { ListingsStatusEnum } from "@bloom-housing/shared-helpers/src/types/backend-swagger"

type SaveScheduledListingDialogProps = {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void | Promise<void>
  currentScheduledPublishAt?: Date | string | null
}

const SaveScheduledListingDialog = ({
  isOpen,
  onClose,
  onConfirm,
  currentScheduledPublishAt,
}: SaveScheduledListingDialogProps) => {
  const hasScheduledDate =
    currentScheduledPublishAt != null && dayjs.utc(currentScheduledPublishAt).isValid()

  const content = hasScheduledDate
    ? t("listings.approval.saveScheduledWithDate", {
        date: dayjs.utc(currentScheduledPublishAt).format("MM/DD/YYYY"),
      })
    : t("listings.approval.saveScheduledNoDate")

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      ariaLabelledBy="save-scheduled-listing-dialog-header"
      ariaDescribedBy="save-scheduled-listing-dialog-content"
    >
      <Dialog.Header id="save-scheduled-listing-dialog-header">{t("t.areYouSure")}</Dialog.Header>
      <Dialog.Content id="save-scheduled-listing-dialog-content">{content}</Dialog.Content>
      <Dialog.Footer>
        <Button
          id="saveScheduledListingButtonConfirm"
          type="button"
          variant="primary"
          size="sm"
          onClick={onConfirm}
        >
          {t("t.save")}
        </Button>
        <Button type="button" onClick={onClose} size="sm">
          {t("t.cancel")}
        </Button>
      </Dialog.Footer>
    </Dialog>
  )
}

export default SaveScheduledListingDialog
