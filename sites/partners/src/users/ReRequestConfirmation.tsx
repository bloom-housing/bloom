import React, { useContext } from "react"
import {
  AppearanceBorderType,
  AppearanceStyleType,
  AuthContext,
  Button,
  Field,
  Form,
  FormCard,
  t,
} from "@bloom-housing/ui-components"
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
    <FormCard>
      <div className="form-card__lead text-center border-b mx-0 px-5">
        <p className="mt-4 field-note">{t("users.requestResendExplanation")}</p>
      </div>

      <Form id="re-request-confirmation" onSubmit={handleSubmit(onSubmit)}>
        <div className="form-card__group is-borderless">
          <fieldset>
            <div className="mt-5">
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
            </div>
          </fieldset>
        </div>

        <div className="form-card__pager mt-8">
          <div className="form-card__pager-row primary">
            <Button
              type="submit"
              styleType={AppearanceStyleType.primary}
              className={"items-center"}
            >
              {t("users.requestResend")}
            </Button>
            <Button
              styleType={AppearanceStyleType.secondary}
              border={AppearanceBorderType.borderless}
              onClick={() => {
                clearErrors(), onClose(false)
              }}
            >
              {t("t.cancel")}
            </Button>
          </div>
        </div>
      </Form>
    </FormCard>
  )
}

export { ReRequestConfirmation as default, ReRequestConfirmation }
