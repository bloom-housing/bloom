import React, { useContext } from "react"
import { Button, Dialog } from "@bloom-housing/ui-seeds"
import { Field, Form, FormCard, t } from "@bloom-housing/ui-components"
import { AuthContext } from "@bloom-housing/shared-helpers"
import { useForm } from "react-hook-form"

type FormFields = {
  email: string
}

type ReRequestConfirmationProps = {
  onClose: (toSet: boolean) => void
  clearExistingErrors: () => void
  setAlert: (toSet: boolean) => void
}

const ReRequestConfirmation = ({
  onClose,
  clearExistingErrors,
  setAlert,
}: ReRequestConfirmationProps) => {
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { register, errors, handleSubmit, clearErrors } = useForm<FormFields>()
  const { userService } = useContext(AuthContext)

  const onSubmit = async (data: FormFields) => {
    const body = {
      email: data.email,
      appUrl: window.location.origin,
    }

    try {
      await userService.resendPartnerConfirmation({
        body,
      })

      clearExistingErrors()
      setAlert(true)
      onClose(false)
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <>
      <Dialog.Header id="request-resend-dialog-header">
        {t("authentication.createAccount.errors.tokenExpired")}
      </Dialog.Header>
      <Form id="re-request-confirmation" onSubmit={handleSubmit(onSubmit)}>
        <Dialog.Content>
          <p id="request-resend-dialog-explanation">{t("users.requestResendExplanation")}</p>

          <fieldset>
            <Field
              name="email"
              id="email"
              label={t("t.email")}
              validation={{
                required: true,
              }}
              error={!!errors?.email}
              errorMessage={t("authentication.signIn.loginError")}
              register={register}
              className={"mb-1"}
            />
          </fieldset>
        </Dialog.Content>
        <Dialog.Footer>
          <Button type="submit" variant="primary" className={"items-center"}>
            {t("users.requestResend")}
          </Button>
          <Button
            variant="primary-outlined"
            onClick={() => {
              clearErrors(), onClose(false)
            }}
          >
            {t("t.cancel")}
          </Button>
        </Dialog.Footer>
      </Form>
    </>
  )
}

export { ReRequestConfirmation as default, ReRequestConfirmation }
