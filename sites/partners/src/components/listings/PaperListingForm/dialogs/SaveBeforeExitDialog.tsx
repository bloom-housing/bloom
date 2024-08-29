import React from "react"
import { useRouter } from "next/router"
import { ListingsStatusEnum } from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { Button, Dialog } from "@bloom-housing/ui-seeds"
import { t } from "@bloom-housing/ui-components"
import { SubmitFunction } from "../index"

export interface SaveBeforeExitDialogProps {
  isOpen: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  submitFormWithStatus: SubmitFunction
  listingDetailURL: string
  currentListingStatus?: ListingsStatusEnum
}

const SaveBeforeExitDialog = ({
  isOpen,
  setOpen,
  currentListingStatus,
  submitFormWithStatus,
  listingDetailURL,
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
        {currentListingStatus ? t("t.saveChangesQuestion") : t("t.saveDraftQuestion")}
      </Dialog.Header>
      <Dialog.Content id="listing-save-before-exit-dialog-content">
        {t("t.saveChangesBeforeExit")}
      </Dialog.Content>
      <Dialog.Footer>
        <Button
          id="saveBeforeExitConfirm"
          type="button"
          variant="primary"
          onClick={() => {
            setOpen(false)
            submitFormWithStatus("confirm", currentListingStatus || ListingsStatusEnum.pending)
          }}
          size="sm"
        >
          {t("t.save")}
        </Button>
        <Button
          id="saveBeforeExitDiscard"
          type="button"
          variant="alert-outlined"
          onClick={() => {
            setOpen(false)
            void router.push(listingDetailURL)
          }}
          size="sm"
        >
          {t("t.discard")}
        </Button>
      </Dialog.Footer>
    </Dialog>
  )
}

export { SaveBeforeExitDialog as default }
