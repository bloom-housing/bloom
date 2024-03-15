import React from "react"
import {
  Field,
  Form,
  FormCard,
  t,
  SiteAlert,
  FormSignInErrorBox,
  NetworkStatus,
} from "@bloom-housing/ui-components"
import { Button, Icon } from "@bloom-housing/ui-seeds"
import type { UseFormMethods } from "react-hook-form"
import { CustomIconMap } from "@bloom-housing/shared-helpers"

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
        <Icon size="2xl">{CustomIconMap.profile}</Icon>
        <h2 className="form-card__title is-borderless">
          {t("nav.signInMFA.verificationChoiceMainTitle")}
        </h2>
        {process.env.showSmsMfa && (
          <p className="form-card__sub-title">
            {t("nav.signInMFA.verificationChoiceSecondaryTitle")}
          </p>
        )}
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
              type="submit"
              variant="primary-outlined"
              id="verify-by-email"
              onClick={emailOnClick}
            >
              {t("nav.signInMFA.verifyByEmail")}
            </Button>
          </div>
          {process.env.showSmsMfa && (
            <div className="text-center mt-6">
              <Button
                type="submit"
                variant="primary-outlined"
                id="verify-by-phone"
                onClick={smsOnClick}
              >
                {t("nav.signInMFA.verifyByPhone")}
              </Button>
            </div>
          )}
        </Form>
      </div>
    </FormCard>
  )
}

export { FormSignInMFAType as default, FormSignInMFAType }
