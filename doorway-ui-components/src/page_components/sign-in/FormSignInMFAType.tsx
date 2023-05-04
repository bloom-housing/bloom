import React from "react"
import {
  AppearanceStyleType,
  Button,
  Field,
  Form,
  FormCard,
  Icon,
  t,
  SiteAlert,
  FormSignInErrorBox,
} from "../../.."
import type { UseFormMethods } from "react-hook-form"
import { NetworkStatus } from "./FormSignIn"

export type FormSignInMFAProps = {
  control: FormSignInMFAControl
  onSubmit: (data: unknown) => void
  networkError: NetworkStatus
  emailOnClick: () => void
  smsOnClick: () => void
}

export type FormSignInMFAControl = {
  errors: UseFormMethods["errors"]
  handleSubmit: UseFormMethods["handleSubmit"]
  register: UseFormMethods["register"]
  setValue: UseFormMethods["setValue"]
}

const FormSignInMFAType = ({
  onSubmit,
  networkError,
  control: { errors, register, handleSubmit },
  emailOnClick,
  smsOnClick,
}: FormSignInMFAProps) => {
  const onError = () => {
    window.scrollTo(0, 0)
  }

  return (
    <FormCard>
      <div className="form-card__lead text-center">
        <Icon size="2xl" symbol="profile" className="form-card__header-icon" />
        <h2 className="form-card__title is-borderless">
          {t("nav.signInMFA.verificationChoiceMainTitle")}
        </h2>
        <p className="form-card__sub-title">
          {t("nav.signInMFA.verificationChoiceSecondaryTitle")}
        </p>
      </div>
      <FormSignInErrorBox
        errors={errors}
        networkStatus={networkError}
        errorMessageId={"mfa-type"}
      />

      <SiteAlert type="notice" dismissable />
      <div className="form-card__group pt-0">
        <Form id="sign-in-mfa" className="mt-10" onSubmit={handleSubmit(onSubmit, onError)}>
          <Field
            caps={true}
            name="mfaType"
            label={"MFA Type"}
            validation={{ required: true }}
            error={errors.mfaType}
            errorMessage={t("nav.signInMFA.noMFAType")}
            register={register}
            dataTestId="sign-in-mfaType-field"
            hidden={true}
          />

          <div className="text-center mt-6">
            <Button
              styleType={AppearanceStyleType.accentCool}
              data-testid="verify-by-email"
              onClick={emailOnClick}
            >
              {t("nav.signInMFA.verifyByEmail")}
            </Button>
          </div>
          <div className="text-center mt-6">
            <Button
              styleType={AppearanceStyleType.accentCool}
              data-testid="verify-by-phone"
              onClick={smsOnClick}
            >
              {t("nav.signInMFA.verifyByPhone")}
            </Button>
          </div>
        </Form>
      </div>
    </FormCard>
  )
}

export { FormSignInMFAType as default, FormSignInMFAType }
