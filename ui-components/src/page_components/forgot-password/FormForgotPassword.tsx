import React from "react"
import { useRouter } from "next/router"
import {
  AppearanceStyleType,
  Button,
  Field,
  Form,
  FormCard,
  Icon,
  t,
  AlertBox,
  SiteAlert,
  AlertNotice,
  ErrorMessage,
  emailRegex,
} from "@bloom-housing/ui-components"
import type { UseFormMethods } from "react-hook-form"
import type { NetworkErrorReset, NetworkErrorValue } from "@bloom-housing/shared-helpers"

export type FormForgotPasswordProps = {
  control: FormForgotPasswordControl
  onSubmit: (data: FormForgotPasswordValues) => void
  networkError: FormForgotPasswordNetworkError
}

export type FormForgotPasswordNetworkError = {
  error: NetworkErrorValue
  reset: NetworkErrorReset
}

export type FormForgotPasswordControl = {
  errors: UseFormMethods["errors"]
  handleSubmit: UseFormMethods["handleSubmit"]
  register: UseFormMethods["register"]
}

export type FormForgotPasswordValues = {
  email: string
}

const FormForgotPassword = ({
  onSubmit,
  networkError,
  control: { errors, register, handleSubmit },
}: FormForgotPasswordProps) => {
  const onError = () => {
    window.scrollTo(0, 0)
  }

  const router = useRouter()

  return (
    <FormCard>
      <div className="form-card__lead text-center border-b mx-0">
        <Icon size="2xl" symbol="profile" />
        <h2 className="form-card__title">{t("authentication.forgotPassword.sendEmail")}</h2>
      </div>

      {Object.entries(errors).length > 0 && !networkError.error && (
        <AlertBox type="alert" inverted closeable>
          {errors.authentication ? errors.authentication.message : t("errors.errorsToResolve")}
        </AlertBox>
      )}

      {!!networkError.error && Object.entries(errors).length === 0 && (
        <ErrorMessage id={"householdsize-error"} error={!!networkError.error}>
          <AlertBox type="alert" inverted onClose={() => networkError.reset()}>
            {networkError.error.title}
          </AlertBox>

          <AlertNotice title="" type="alert" inverted>
            {networkError.error.content}
          </AlertNotice>
        </ErrorMessage>
      )}

      <SiteAlert type="notice" dismissable />

      <div className="form-card__group pt-0 border-b">
        <Form id="sign-in" className="mt-10" onSubmit={handleSubmit(onSubmit, onError)}>
          <Field
            caps={true}
            name="email"
            label={t("t.email")}
            validation={{ required: true, pattern: emailRegex }}
            error={errors.email}
            errorMessage={errors.email ? t("authentication.signIn.loginError") : undefined}
            register={register}
          />

          <div className="text-center mt-6">
            <Button styleType={AppearanceStyleType.primary}>
              {t("authentication.forgotPassword.sendEmail")}
            </Button>
          </div>
          <div className="text-center mt-6">
            <a href="#" onClick={() => router.back()}>
              {t("t.cancel")}
            </a>
          </div>
        </Form>
      </div>
    </FormCard>
  )
}

export { FormForgotPassword as default, FormForgotPassword }
