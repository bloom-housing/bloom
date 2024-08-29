import React from "react"
import { Form, t, Textarea } from "@bloom-housing/ui-components"
import { Button, Dialog } from "@bloom-housing/ui-seeds"
import { useForm } from "react-hook-form"
import { FormListing } from "../../../../lib/listings/formTypes"
import { ListingsStatusEnum } from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { SubmitFunction } from "../index"

type FormFields = {
  requestedChanges: string
}

type RequestChangesModalProps = {
  defaultValue: string
  modalIsOpen: boolean
  setModalIsOpen: React.Dispatch<React.SetStateAction<boolean>>
  submitFormWithStatus: SubmitFunction
}

const RequestChangesDialog = ({
  defaultValue,
  modalIsOpen,
  setModalIsOpen,
  submitFormWithStatus,
}: RequestChangesModalProps) => {
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { register, getValues, errors, trigger, clearErrors } = useForm<FormFields>()

  return (
    <Dialog
      isOpen={modalIsOpen}
      onClose={() => setModalIsOpen(false)}
      ariaLabelledBy="request-changes-dialog-header"
      ariaDescribedBy="request-changes-dialog-content"
    >
      <Dialog.Header id="request-changes-dialog-header">{t("t.areYouSure")}</Dialog.Header>
      <Dialog.Content>
        <Form id={"request-changes"} onSubmit={() => false}>
          <div className={"pb-4 text-gray-700"} id="request-changes-dialog-content">
            {t("listings.approval.requestChangesDescription")}
          </div>
          <Textarea
            label={t("listings.approval.requestSummary")}
            name={"requestedChanges"}
            id={"requestedChanges"}
            dataTestId={"requestedChanges"}
            fullWidth={true}
            register={register}
            defaultValue={defaultValue}
            maxLength={2000}
            validation={{ required: true }}
            errorMessage={!!errors?.requestedChanges && t("errors.requiredFieldError")}
            inputProps={{
              onChange: () => clearErrors("requestedChanges"),
            }}
          />
        </Form>
      </Dialog.Content>
      <Dialog.Footer>
        <Button
          id="requestChangesButtonConfirm"
          type="button"
          variant="success"
          onClick={async () => {
            const validation = await trigger()
            if (validation) {
              const formData = getValues()
              submitFormWithStatus("redirect", ListingsStatusEnum.changesRequested, {
                requestedChanges: formData.requestedChanges,
                requestedChangesDate: new Date(),
              })
            }
          }}
          size="sm"
        >
          {t("listings.approval.requestChanges")}
        </Button>
        <Button
          type="button"
          variant="primary-outlined"
          onClick={() => {
            setModalIsOpen(false)
          }}
          size="sm"
        >
          {t("t.cancel")}
        </Button>
      </Dialog.Footer>
    </Dialog>
  )
}

export { RequestChangesDialog as default }
