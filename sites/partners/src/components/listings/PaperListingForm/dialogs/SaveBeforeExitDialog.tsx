import React from "react"
import { useRouter } from "next/router"
import { ListingsStatusEnum } from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { Button, Dialog } from "@bloom-housing/ui-seeds"
import { t } from "@bloom-housing/ui-components"
import { SubmitFunction } from "../index"

export interface SaveBeforeExitDialogProps {
  isOpen: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  currentListingStatus: ListingsStatusEnum
  submitFormWithStatus: SubmitFunction
  listingDetailURL: string
}

const SaveBeforeExitDialog = ({
  isOpen,
  setOpen,
  currentListingStatus,
  submitFormWithStatus,
  listingDetailURL
}: SaveBeforeExitDialogProps) => {
  const router = useRouter()

  return (
    <Dialog
      isOpen={isOpen}
      onClose={() => setOpen(false)}
      ariaLabelledBy="listing-save-before-exit-dialog-header"
      ariaDescribedBy="listing-save-before-exit-dialog-content"
    >
      <Dialog.Header id="listing-save-before-exit-dialog-header">
        {t("t.areYouSure")}
      </Dialog.Header>
      <Dialog.Content id="listing-save-before-exit-dialog-content">
        Save stuff, yo dawg.
      </Dialog.Content>
      <Dialog.Footer>
        <Button
          id="saveBeforeExitConfirm"
          type="button"
          variant="success"
          onClick={() => {
            setOpen(false)
            submitFormWithStatus("redirect", currentListingStatus)
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
            router.push(listingDetailURL)
          }}
          size="sm"
        >
          {t("t.cancel")}
        </Button>
      </Dialog.Footer>
    </Dialog>
  )
}

export { SaveBeforeExitDialog as default }
