import React from "react"
import { Button } from "@bloom-housing/ui-seeds"
import { Field, Form, t, AlertBox, AlertNotice, ErrorMessage } from "@bloom-housing/ui-components"
import { CardSection } from "@bloom-housing/ui-seeds/src/blocks/Card"
import { NetworkErrorReset, NetworkStatusContent } from "../../auth/catchNetworkError"
import type { UseFormMethods } from "react-hook-form"
import BloomCard from "../components/BloomCard"
import { emailRegex } from "../../utilities/regex"
import styles from "./FormForgotPassword.module.scss"
import { useRouter } from "next/router"

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

  const router = useRouter()

  return (
    <BloomCard title={t("authentication.forgotPassword.sendEmail")} customIcon={"profile"}>
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
            <div className={styles["forgot-password-footer"]}>
              <Button
                type="submit"
                variant="primary"
                className={styles["forgot-password-submit-button"]}
              >
                {t("authentication.forgotPassword.sendEmail")}
              </Button>

              <div className={styles["forgot-password-cancel-button"]}>
                <Button onClick={() => router.back()} variant="text">
                  {t("t.cancel")}
                </Button>
              </div>
            </div>
          </Form>
        </CardSection>
      </>
    </BloomCard>
  )
}

export { FormForgotPassword as default, FormForgotPassword }
