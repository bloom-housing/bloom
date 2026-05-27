import React from "react"
import dayjs from "dayjs"
import utc from "dayjs/plugin/utc"
dayjs.extend(utc)
import { t } from "@bloom-housing/ui-components"
import { Button, Dialog } from "@bloom-housing/ui-seeds"

type AdminListingApprovalDialogProps = {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void | Promise<void>
  scheduledPublishAt?: Date | string | null
}

const AdminListingApprovalDialog = ({
  isOpen,
  onClose,
  onConfirm,
  scheduledPublishAt,
}: AdminListingApprovalDialogProps) => {
  const getAdminListingApprovalModalBody = (): string => {
    const hasValidScheduledAt =
      scheduledPublishAt != null && dayjs.utc(scheduledPublishAt).isValid()

    if (!hasValidScheduledAt) {
      return t("listings.approval.adminApproveNoScheduledDate")
    }

    const scheduledAtDate = dayjs.utc(scheduledPublishAt).format("MM/DD/YYYY")

    if (dayjs().startOf("day").isBefore(dayjs(scheduledAtDate).startOf("day"))) {
      return t("listings.approval.adminApproveScheduledFuture", {
        date: scheduledAtDate,
      })
    }

    return t("listings.approval.adminApproveScheduledPast")
  }

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      ariaLabelledBy="admin-listing-approval-dialog-header"
      ariaDescribedBy="admin-listing-approval-dialog-content"
    >
      <Dialog.Header id="admin-listing-approval-dialog-header">
        {t("listings.approval.adminApproveDialogTitle")}
      </Dialog.Header>
      <Dialog.Content id="admin-listing-approval-dialog-content">
        {getAdminListingApprovalModalBody()}
      </Dialog.Content>
      <Dialog.Footer>
        <Button
          id="adminListingApprovalButtonConfirm"
          type="button"
          variant="success"
          size="sm"
          onClick={onConfirm}
        >
          {t("listings.approval.approve")}
        </Button>
        <Button type="button" onClick={onClose} size="sm">
          {t("t.cancel")}
        </Button>
      </Dialog.Footer>
    </Dialog>
  )
}

export default AdminListingApprovalDialog
