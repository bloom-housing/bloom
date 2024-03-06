import React, { useContext } from "react"
import { Button } from "@bloom-housing/ui-seeds"
import {
  Field,
  Form,
  t,
  AlertBox,
  SiteAlert,
  AlertNotice,
  ErrorMessage,
  NavigationContext,
  emailRegex,
} from "@bloom-housing/ui-components"
import { CardSection } from "@bloom-housing/ui-seeds/src/blocks/Card"
import { NetworkErrorReset, NetworkStatusContent } from "../../auth/catchNetworkError"
import type { UseFormMethods } from "react-hook-form"
import BloomCard from "../components/BloomCard"

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
    <BloomCard title={t("authentication.forgotPassword.sendEmail")} iconSymbol={"profile"}>
      <>
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

        <CardSection>
          <Form id="sign-in" onSubmit={handleSubmit(onSubmit, onError)}>
            <Field
              name="email"
              label={t("t.email")}
              validation={{ required: true, pattern: emailRegex }}
              error={errors.email}
              errorMessage={errors.email ? t("authentication.signIn.loginError") : undefined}
              register={register}
              onChange={() => networkError.reset()}
              labelClassName={"text__caps-spaced"}
            />

            <Button type="submit" variant="primary">
              {t("authentication.forgotPassword.sendEmail")}
            </Button>

            <div className={"mt-4"}>
              <Button onClick={() => router.back()} variant="text">
                {t("t.cancel")}
              </Button>
            </div>
          </Form>
        </CardSection>
      </>
    </BloomCard>
  )
}

export { FormForgotPassword as default, FormForgotPassword }
