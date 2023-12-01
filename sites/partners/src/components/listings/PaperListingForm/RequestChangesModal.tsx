import React from "react"
import { ListingStatus } from "@bloom-housing/backend-core"
import { Form, Modal, t, Textarea } from "@bloom-housing/ui-components"
import { Button } from "@bloom-housing/ui-seeds"
import { useForm } from "react-hook-form"
import { FormListing } from "../../../lib/listings/formTypes"

type FormFields = {
  requestedChanges: string
}

type RequestChangesModalProps = {
  defaultValue: string
  modalIsOpen: boolean
  setModalIsOpen: React.Dispatch<React.SetStateAction<boolean>>
  submitFormWithStatus: (
    confirm?: boolean,
    status?: ListingStatus,
    newData?: Partial<FormListing>
  ) => void
}

const RequestChangesModal = ({
  defaultValue,
  modalIsOpen,
  setModalIsOpen,
  submitFormWithStatus,
}: RequestChangesModalProps) => {
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { register, getValues, errors, trigger, clearErrors } = useForm<FormFields>()

  return (
    <Modal
      open={modalIsOpen}
      title={t("t.areYouSure")}
      ariaDescription={t("listings.approval.requestChangesDescription")}
      onClose={() => setModalIsOpen(false)}
      actions={[
        <Button
          id="requestChangesButtonConfirm"
          type="button"
          variant="success"
          onClick={async () => {
            const validation = await trigger()
            if (validation) {
              const formData = getValues()
              submitFormWithStatus(false, ListingStatus.changesRequested, {
                requestedChanges: formData.requestedChanges,
                requestedChangesDate: new Date(),
              })
            }
          }}
          size="sm"
        >
          {t("listings.approval.requestChanges")}
        </Button>,
        <Button
          type="button"
          variant="primary-outlined"
          onClick={() => {
            setModalIsOpen(false)
          }}
          size="sm"
        >
          {t("t.cancel")}
        </Button>,
      ]}
    >
      <Form id={"request-changes"} onSubmit={() => false}>
        <div className={"pb-4 text-gray-700"}>
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
    </Modal>
  )
}

export { RequestChangesModal as default }
