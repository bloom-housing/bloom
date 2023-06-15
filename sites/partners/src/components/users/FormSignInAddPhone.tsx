import React from "react"
import {
  AppearanceStyleType,
  Button,
  Form,
  FormCard,
  Icon,
  t,
  PhoneField,
  FormSignInErrorBox,
  NetworkStatus,
} from "@bloom-housing/ui-components"
import type { UseFormMethods } from "react-hook-form"
import { SiteAlert } from "@bloom-housing/shared-helpers"

export type FormSignInAddPhoneProps = {
  control: FormSignInAddPhoneControl
  onSubmit: (data: FormSignInAddPhoneValues) => void
  networkError: NetworkStatus
  phoneNumber: string
}

export type FormSignInAddPhoneControl = {
  errors: UseFormMethods["errors"]
  handleSubmit: UseFormMethods["handleSubmit"]
  control: UseFormMethods["control"]
}

export type FormSignInAddPhoneValues = {
  phoneNumber: string
}

const FormSignInAddPhone = ({
  onSubmit,
  networkError,
  control,
  phoneNumber,
}: FormSignInAddPhoneProps) => {
  const onError = () => {
    window.scrollTo(0, 0)
  }
  const { errors, handleSubmit } = control
  return (
    <FormCard>
      <div className="form-card__lead text-center">
        <Icon size="2xl" symbol="profile" className="form-card__header-icon" />
        <h2 className="form-card__title is-borderless">{t("nav.signInMFA.addNumber")}</h2>
        <p className="form-card__sub-title">{t("nav.signInMFA.addNumberSecondaryTitle")}</p>
      </div>
      <FormSignInErrorBox
        errors={errors}
        networkStatus={networkError}
        errorMessageId={"add-phone"}
      />

      <SiteAlert type="notice" dismissable />
      <div className="form-card__group pt-0">
        <Form id="sign-in-mfa" className="mt-10" onSubmit={handleSubmit(onSubmit, onError)}>
          <PhoneField
            label={t("nav.signInMFA.phoneNumber")}
            caps={true}
            required={true}
            id="phoneNumber"
            name="phoneNumber"
            error={errors.phoneNumber}
            errorMessage={t("errors.phoneNumberError")}
            controlClassName="control"
            control={control.control}
            dataTestId={"sign-in-phone-number-field"}
            defaultValue={phoneNumber}
          />

          <div className="text-center mt-10">
            <Button
              styleType={AppearanceStyleType.primary}
              data-testid="request-mfa-code-and-add-phone"
            >
              {t("nav.signInMFA.addPhoneNumber")}
            </Button>
          </div>
        </Form>
      </div>
    </FormCard>
  )
}

export { FormSignInAddPhone as default, FormSignInAddPhone }
