import { t, Form, Field } from "@bloom-housing/ui-components"
import { Button, Dialog } from "@bloom-housing/ui-seeds"
import React, { useCallback, useEffect, useMemo } from "react"
import { useForm } from "react-hook-form"
import { emailRegex } from "../../utilities/regex"

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

  const closeCallback = useCallback(() => {
    onClose()
    window.scrollTo(0, 0)
  }, [onClose])

  return (
    <Dialog
      isOpen={isOpen}
      onClose={closeCallback}
      ariaLabelledBy="resend-confirmation-dialog-header"
    >
      <Dialog.Header id="resend-confirmation-dialog-header">
        {t("authentication.signIn.yourAccountIsNotConfirmed")}
      </Dialog.Header>
      <Dialog.Content>
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
            labelClassName={"text__caps-spaced"}
          />
        </Form>

        <p className="pt-4">{t("authentication.createAccount.resendEmailInfo")}</p>
      </Dialog.Content>
      <Dialog.Footer>
        <Button
          type="button"
          variant="primary"
          onClick={() => onFormSubmit()}
          loadingMessage={loadingMessage}
          size="sm"
        >
          {t("authentication.createAccount.resendTheEmail")}
        </Button>
        <Button type="button" variant="alert" onClick={closeCallback} size="sm">
          {t("t.cancel")}
        </Button>
      </Dialog.Footer>
    </Dialog>
  )
}

export { ResendConfirmationModal as default, ResendConfirmationModal }
