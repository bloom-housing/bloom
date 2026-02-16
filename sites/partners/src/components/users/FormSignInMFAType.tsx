import React from "react"
import type { UseFormMethods } from "react-hook-form"
import { Field, Form, t, FormSignInErrorBox, NetworkStatus } from "@bloom-housing/ui-components"
import { Button, Card } from "@bloom-housing/ui-seeds"
import { BloomCard } from "@bloom-housing/shared-helpers"

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
    <BloomCard
      iconSymbol="userCircle"
      title={t("nav.signInMFA.verificationChoiceMainTitle")}
      headingPriority={1}
      iconClass={"card-icon"}
      iconOutlined={true}
      headingClass="seeds-large-heading"
      subtitle={t("nav.signInMFA.verificationChoiceSecondaryTitle")}
    >
      <Form id="sign-in-mfa" onSubmit={handleSubmit(onSubmit, onError)}>
        <Card.Section>
          {(Object.keys(errors).length > 0 || networkError?.content?.error) && (
            <div className={"seeds-m-be-6"}>
              <FormSignInErrorBox
                errors={errors}
                networkStatus={networkError}
                errorMessageId={"mfa-type"}
              />
            </div>
          )}

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
            className="sr-only"
          />

          <Button
            type="submit"
            variant="primary-outlined"
            id="verify-by-email"
            onClick={emailOnClick}
          >
            {t("nav.signInMFA.verifyByEmail")}
          </Button>
          {process.env.showSmsMfa && (
            <div className={"seeds-m-bs-4"}>
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
        </Card.Section>
      </Form>
    </BloomCard>
  )
}

export { FormSignInMFAType as default, FormSignInMFAType }
