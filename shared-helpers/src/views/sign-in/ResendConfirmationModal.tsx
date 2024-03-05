import { Modal, t, Form, Field, emailRegex } from "@bloom-housing/ui-components"
import { Button } from "@bloom-housing/ui-seeds"
import React, { useEffect, useMemo } from "react"
import { useForm } from "react-hook-form"

export type ResendConfirmationModalProps = {
  isOpen: boolean
  initialEmailValue: string
  onClose: () => void
  onSubmit: (email: string) => void
  loadingMessage?: string
}

export type ResendConfirmationModalForm = {
  onSubmit: (email: string) => void
}

const ResendConfirmationModal = ({
  isOpen,
  initialEmailValue,
  loadingMessage,
  onClose,
  onSubmit,
}: ResendConfirmationModalProps) => {
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { register, errors, reset, getValues, trigger } = useForm({
    defaultValues: useMemo(() => {
      return {
        emailResend: initialEmailValue,
      }
    }, [initialEmailValue]),
  })

  useEffect(() => {
    reset({
      emailResend: initialEmailValue,
    })
  }, [initialEmailValue, reset])

  const onFormSubmit = async () => {
    const isValid = await trigger()
    if (!isValid) return

    const { emailResend } = getValues()
    onSubmit(emailResend)
  }

  return (
    <Modal
      open={isOpen}
      title={t("authentication.signIn.yourAccountIsNotConfirmed")}
      ariaDescription={t("authentication.createAccount.linkExpired")}
      onClose={() => {
        onClose()
        window.scrollTo(0, 0)
      }}
      actions={[
        <Button
          type="button"
          variant="primary"
          onClick={() => onFormSubmit()}
          loadingMessage={loadingMessage}
          size="sm"
        >
          {t("authentication.createAccount.resendTheEmail")}
        </Button>,
        <Button
          type="button"
          variant="alert"
          onClick={() => {
            onClose()
            window.scrollTo(0, 0)
          }}
          size="sm"
        >
          {t("t.cancel")}
        </Button>,
      ]}
    >
      <>
        <Form>
          <Field
            type="email"
            name="emailResend"
            label={t("authentication.createAccount.resendAnEmailTo")}
            placeholder="example@web.com"
            validation={{ required: true, pattern: emailRegex }}
            error={!!errors.emailResend}
            errorMessage={t("authentication.signIn.loginError")}
            register={register}
          />
        </Form>

        <p className="pt-4">{t("authentication.createAccount.resendEmailInfo")}</p>
      </>
    </Modal>
  )
}

export { ResendConfirmationModal as default, ResendConfirmationModal }
