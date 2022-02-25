import React, { useContext } from "react"
import {
  AppearanceStyleType,
  Button,
  Field,
  Form,
  FormCard,
  Icon,
  LinkButton,
  t,
  FormSignInErrorBox,
} from "@bloom-housing/ui-components"
import type { UseFormMethods } from "react-hook-form"
import { NavigationContext } from "../../config/NavigationContext"
import type { NetworkErrorReset, NetworkErrorValue } from "../forgot-password/FormForgotPassword"

export type NetworkErrorDetermineError = (status: number, error: Error) => void

export type FormSignInProps = {
  control: FormSignInControl
  onSubmit: (data: FormSignInValues) => void
  networkError: FormSignInNetworkError
  showRegisterBtn?: boolean
}

export type FormSignInNetworkError = {
  error: NetworkErrorValue
  reset: NetworkErrorReset
}

export type FormSignInControl = {
  errors: UseFormMethods["errors"]
  handleSubmit: UseFormMethods["handleSubmit"]
  register: UseFormMethods["register"]
}

export type FormSignInValues = {
  email: string
  password: string
}

const FormSignIn = ({
  onSubmit,
  networkError,
  showRegisterBtn,
  control: { errors, register, handleSubmit },
}: FormSignInProps) => {
  const onError = () => {
    window.scrollTo(0, 0)
  }
  const { LinkComponent } = useContext(NavigationContext)

  return (
    <FormCard>
      <div className="form-card__lead text-center">
        <Icon size="2xl" symbol="profile" />
        <h2 className="form-card__title">{t(`nav.signIn`)}</h2>
      </div>
      <FormSignInErrorBox
        errors={errors}
        networkError={networkError}
        errorMessageId={"main-sign-in"}
      />
      <div className="form-card__group pt-0 border-b">
        <Form id="sign-in" className="mt-10" onSubmit={handleSubmit(onSubmit, onError)}>
          <Field
            caps={true}
            name="email"
            label={t("t.email")}
            validation={{ required: true }}
            error={errors.email}
            errorMessage={t("authentication.signIn.enterLoginEmail")}
            register={register}
            dataTestId="sign-in-email-field"
          />

          <aside className="float-right text-tiny font-semibold">
            <LinkComponent href="/forgot-password">
              <a>{t("authentication.signIn.forgotPassword")}</a>
            </LinkComponent>
          </aside>

          <Field
            caps={true}
            name="password"
            label={t("authentication.createAccount.password")}
            validation={{ required: true }}
            error={errors.password}
            errorMessage={t("authentication.signIn.enterLoginPassword")}
            register={register}
            type="password"
            dataTestId="sign-in-password-field"
          />

          <div className="text-center mt-6">
            <Button styleType={AppearanceStyleType.primary} data-test-id="sign-in-button">
              {t("nav.signIn")}
            </Button>
          </div>
        </Form>
      </div>
      {showRegisterBtn && (
        <div className="form-card__group text-center">
          <h2 className="mb-6">{t("authentication.createAccount.noAccount")}</h2>

          <LinkButton href="/create-account">{t("account.createAccount")}</LinkButton>
        </div>
      )}
    </FormCard>
  )
}

export { FormSignIn as default, FormSignIn }
