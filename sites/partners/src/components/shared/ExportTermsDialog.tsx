import React from "react"
import { Field, Form, t } from "@bloom-housing/ui-components"
import { useForm } from "react-hook-form"
import { Button, Dialog } from "@bloom-housing/ui-seeds"
import styles from "./ExportTermsDialog.module.scss"

export interface ExportTermsDialogProps {
  children: React.ReactNode
  dialogHeader: string
  id: string
  isOpen: boolean
  onClose: () => void
  onSubmit: () => void
  loadingState?: boolean
}

export const ExportTermsDialog = ({
  children,
  dialogHeader,
  isOpen,
  id,
  onClose,
  onSubmit,
  loadingState,
}: ExportTermsDialogProps) => {
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { register, handleSubmit, errors } = useForm()

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      ariaLabelledBy={`export-terms-modal-header-${id}`}
      ariaDescribedBy={`export-terms-modal-content-${id}`}
    >
      <Dialog.Header
        className={styles["export-terms-header"]}
        id={`export-terms-modal-header-${id}`}
      >
        {dialogHeader}
      </Dialog.Header>
      <Dialog.Content id={`export-terms-modal-content-${id}`}>
        <>{children}</>
      </Dialog.Content>
      <Form id="terms" onSubmit={handleSubmit(onSubmit)}>
        <Dialog.Content className={styles["export-terms-field"]}>
          <Field
            name="agree"
            type="checkbox"
            label={t(`authentication.terms.acceptExtended`)}
            register={register}
            validation={{ required: true }}
            error={!!errors.agree}
            errorMessage={t("errors.agreeError")}
            dataTestId="agree"
          />
        </Dialog.Content>
        <Dialog.Footer>
          <Button type="submit" variant="primary" id="terms" size="sm">
            {t("t.export")}
          </Button>
          <Button
            variant="secondary-outlined"
            size="sm"
            onClick={onClose}
            loadingMessage={loadingState ? t("t.loading") : undefined}
          >
            {t("t.cancel")}
          </Button>
        </Dialog.Footer>
      </Form>
    </Dialog>
  )
}
