import React from "react"
import { ListingStatus } from "@bloom-housing/backend-core"
import {
  AppearanceSizeType,
  AppearanceStyleType,
  Button,
  Form,
  Modal,
  t,
  Textarea,
} from "@bloom-housing/ui-components"
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
  const { register, getValues } = useForm<FormFields>()

  const onSubmit = () => {
    const formData = getValues()
    submitFormWithStatus(false, ListingStatus.changesRequested, {
      requestedChanges: formData.requestedChanges,
      requestedChangesDate: new Date(),
    })
  }

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
          styleType={AppearanceStyleType.success}
          onClick={() => {
            setModalIsOpen(false)
            onSubmit()
          }}
          size={AppearanceSizeType.small}
          dataTestId={"requestChangesButton"}
        >
          {t("listings.approval.requestChanges")}
        </Button>,
        <Button
          type="button"
          onClick={() => {
            setModalIsOpen(false)
          }}
          size={AppearanceSizeType.small}
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
        />
      </Form>
    </Modal>
  )
}

export { RequestChangesModal as default }
