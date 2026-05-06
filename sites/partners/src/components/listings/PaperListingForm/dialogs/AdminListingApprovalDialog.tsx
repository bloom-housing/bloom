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

    const scheduledAt = dayjs.utc(scheduledPublishAt)

    if (dayjs.utc().isBefore(scheduledAt.startOf("day"))) {
      return t("listings.approval.adminApproveScheduledFuture", {
        date: scheduledAt.format("MM/DD/YYYY"),
      })
    }

    return t("listings.approval.adminApproveScheduledPast")
  }

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      ariaLabelledBy="admin-approve-listing-dialog-header"
      ariaDescribedBy="admin-approve-listing-dialog-content"
    >
      <Dialog.Header id="admin-approve-listing-dialog-header">
        {t("listings.approval.adminApproveDialogTitle")}
      </Dialog.Header>
      <Dialog.Content id="admin-approve-listing-dialog-content">
        {getAdminListingApprovalModalBody()}
      </Dialog.Content>
      <Dialog.Footer>
        <Button
          id="adminApproveListingConfirm"
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
