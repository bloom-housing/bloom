import React, { useContext } from "react"
import {
  AppearanceStyleType,
  Button,
  Field,
  Form,
  FormCard,
  t,
  AlertBox,
  SiteAlert,
  AlertNotice,
  ErrorMessage,
  NavigationContext,
  emailRegex,
} from "@bloom-housing/ui-components"
import { Icon } from "@bloom-housing/ui-seeds"
import { faCircleUser } from "@fortawesome/free-solid-svg-icons"
import { NetworkErrorReset, NetworkStatusContent } from "../../auth/catchNetworkError"
import type { UseFormMethods } from "react-hook-form"

export type FormForgotPasswordProps = {
  control: FormForgotPasswordControl
  onSubmit: (data: FormForgotPasswordValues) => void
  networkError: FormForgotPasswordNetworkError
}

export type FormForgotPasswordNetworkError = {
  error: NetworkStatusContent
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

  const { router } = useContext(NavigationContext)

  return (
    <FormCard>
      <div className="form-card__lead text-center border-b mx-0">
        <Icon size="xl" icon={faCircleUser} />
        <h1 className="form-card__title">{t("authentication.forgotPassword.sendEmail")}</h1>
      </div>

      {Object.entries(errors).length > 0 && !networkError.error && (
        <AlertBox type="alert" inverted closeable>
          {errors.authentication ? errors.authentication.message : t("errors.errorsToResolve")}
        </AlertBox>
      )}

      {!!networkError.error?.error && Object.entries(errors).length === 0 && (
        <ErrorMessage id={"forgotpasswordemail-error"} error={!!networkError.error}>
          <AlertBox type="alert" inverted onClose={() => networkError.reset()}>
            {networkError.error.title}
          </AlertBox>

          <AlertNotice title="" type="alert" inverted>
            {networkError.error.description}
          </AlertNotice>
        </ErrorMessage>
      )}

      <SiteAlert type="notice" dismissable />

      <div className="form-card__group pt-0">
        <Form id="sign-in" className="mt-10" onSubmit={handleSubmit(onSubmit, onError)}>
          <Field
            caps={true}
            name="email"
            label={t("t.email")}
            validation={{ required: true, pattern: emailRegex }}
            error={errors.email}
            errorMessage={errors.email ? t("authentication.signIn.loginError") : undefined}
            register={register}
            onChange={() => networkError.reset()}
          />
          <section>
            <div className="text-center mt-6">
              <Button styleType={AppearanceStyleType.primary}>
                {t("authentication.forgotPassword.sendEmail")}
              </Button>
            </div>
            <div className="text-center mt-6">
              <Button onClick={() => router.back()} unstyled={true}>
                {t("t.cancel")}
              </Button>
            </div>
          </section>
        </Form>
      </div>
    </FormCard>
  )
}

export { FormForgotPassword as default, FormForgotPassword }
