import React, { useContext, useState } from "react"
import { IdDTO } from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { Button, Dialog } from "@bloom-housing/ui-seeds"
import { Field, t } from "@bloom-housing/ui-components"
import { useForm } from "react-hook-form"
import { AuthContext, Form, MessageContext } from "@bloom-housing/shared-helpers"

export interface CopyListingDialogProps {
  isOpen: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  listingInfo: IdDTO
}

type CopyListingFormFields = {
  newListingName: string
  includeUnitData: boolean
}

const CopyListingDialog = ({ isOpen, setOpen, listingInfo }: CopyListingDialogProps) => {
  const { listingsService, loadProfile } = useContext(AuthContext)
  const [submitting, setSubmitting] = useState(false)
  const { addToast } = useContext(MessageContext)
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { register, errors, handleSubmit, clearErrors } = useForm<CopyListingFormFields>()

  const onSubmit = async (data: CopyListingFormFields) => {
    try {
      setSubmitting(true)
      const res = await listingsService.duplicate({
        body: {
          includeUnits: data.includeUnitData,
          name: data.newListingName,
          storedListing: {
            id: listingInfo.id,
          },
        },
      })
      setOpen(false)
      setSubmitting(false)
      loadProfile(`/listings/${res.id}`)
      addToast(t("listings.copy.success"), { variant: "success" })
    } catch (err) {
      console.error(err)
      setOpen(false)
      setSubmitting(false)
      addToast(
        t("account.settings.alerts.genericError", { contactEmail: t("resources.contactEmail") }),
        {
          variant: "alert",
        }
      )
    }
  }
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
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Dialog.Content id="listing-form-copy-listing-dialog-content">
          <span>{t("listings.copy.description")}</span>
          <Field
            name="newListingName"
            label={t("listings.listingName")}
            validation={{
              required: true,
              validate: (value) => value !== listingInfo.name,
            }}
            error={!!errors?.newListingName}
            errorMessage={t("errors.copy.listingNameError")}
            register={register}
            defaultValue={`${listingInfo.name} ${t("actions.copy")}`}
            inputProps={{
              onChange: () => clearErrors("newListingName"),
            }}
          />
          <Field
            name="includeUnitData"
            type="checkbox"
            label={t("listings.copy.unitData")}
            subNote={t("listings.copy.unitSubNote")}
            register={register}
            inputProps={{ defaultChecked: true }}
          />
        </Dialog.Content>
        <Dialog.Footer>
          <Button
            type="submit"
            variant="primary"
            size="sm"
            id={"copy-listing-modal-button"}
            loadingMessage={submitting && t("t.loading")}
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
      </Form>
    </Dialog>
  )
}

export { CopyListingDialog as default }
