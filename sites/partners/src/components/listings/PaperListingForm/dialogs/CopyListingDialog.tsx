import React from "react"
import { ListingsStatusEnum } from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { Button, Dialog } from "@bloom-housing/ui-seeds"
import { Field, t } from "@bloom-housing/ui-components"
import { SubmitFunction } from "../index"

export interface CopyListingDialogProps {
  isOpen: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  listingName: string
  submitFormWithStatus: SubmitFunction
}

const CopyListingDialog = ({
  isOpen,
  setOpen,
  listingName,
  submitFormWithStatus,
}: CopyListingDialogProps) => {
  return (
    <Dialog
      isOpen={isOpen}
      onClose={() => setOpen(false)}
      ariaLabelledBy="listing-form-copy-listing-dialog-header"
      ariaDescribedBy="listing-form-copy-listing-dialog-content"
    >
      <Dialog.Header id="listing-form-copy-listing-dialog-header">
        {t("listings.copyListing")}
      </Dialog.Header>
      <Dialog.Content id="listing-form-copy-listing-dialog-content">
        <span>{t("listings.copy.description")}</span>
        <Field
          name="listingName"
          label={t("listings.listingName")}
          validation={{ required: true }}
          defaultValue={`${listingName} ${t("actions.copy")}`}
        ></Field>
        <Field
          name="unitData"
          type="checkbox"
          label={t("listings.copy.unitData")}
          subNote={t("listings.copy.unitSubNote")}
          inputProps={{ defaultChecked: true }}
        />
      </Dialog.Content>
      <Dialog.Footer>
        <Button
          type="button"
          variant="primary"
          onClick={() => {
            setOpen(false)
            submitFormWithStatus("redirect", ListingsStatusEnum.closed)
          }}
          size="sm"
          id={"copy-listing-modal-button"}
        >
          {t("actions.copy")}
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

export { CopyListingDialog as default }
