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
} from "@bloom-housing/ui-components"
import type { UseFormMethods } from "react-hook-form"
import { FormSignInNetworkError } from "./FormSignIn"
import { EnumRequestMfaCodeMfaType } from "@bloom-housing/backend-core/types"

export type FormSignInMFAProps = {
  control: FormSignInMFAControl
  onSubmit: (data: FormSignInMFAValues) => void
  networkError: FormSignInNetworkError
}

export type FormSignInMFAControl = {
  errors: UseFormMethods["errors"]
  handleSubmit: UseFormMethods["handleSubmit"]
  register: UseFormMethods["register"]
  setValue: UseFormMethods["setValue"]
}

export type FormSignInMFAValues = {
  mfaType: EnumRequestMfaCodeMfaType
}

const FormSignInMFAType = ({
  onSubmit,
  networkError,
  control: { errors, register, handleSubmit, setValue },
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
      <FormSignInErrorBox errors={errors} networkError={networkError} errorMessageId={"mfa-type"} />

      <SiteAlert type="notice" dismissable />
      <div className="form-card__group pt-0 border-b">
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
              data-test-id="verify-by-email"
              onClick={() => setValue("mfaType", EnumRequestMfaCodeMfaType.email)}
            >
              {t("nav.signInMFA.verifyByEmail")}
            </Button>
          </div>
          <div className="text-center mt-6">
            <Button
              styleType={AppearanceStyleType.accentCool}
              data-test-id="verify-by-phone"
              onClick={() => setValue("mfaType", EnumRequestMfaCodeMfaType.sms)}
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
