import React from "react"
import {
  Field,
  Form,
  FormCard,
  Icon,
  t,
  FormSignInErrorBox,
  NetworkStatus,
  FormSignInControl,
} from "@bloom-housing/ui-components"
import { Button } from "@bloom-housing/ui-seeds"

export enum RequestType {
  email = "email",
  sms = "sms",
}

export type FormSignInMFACodeProps = {
  control: FormSignInControl
  onSubmit: (data: FormSignInMFACodeValues) => void
  networkError: NetworkStatus
  mfaType: RequestType
  allowPhoneNumberEdit: boolean
  phoneNumber: string
  goBackToPhone: () => void
}

export type FormSignInMFACodeValues = {
  mfaCode: string
}

const FormSignInMFACode = ({
  onSubmit,
  networkError,
  control: { errors, register, handleSubmit },
  mfaType,
  allowPhoneNumberEdit,
  phoneNumber,
  goBackToPhone,
}: FormSignInMFACodeProps) => {
  const onError = () => {
    window.scrollTo(0, 0)
  }

  let note
  if (allowPhoneNumberEdit) {
    note = (
      <>
        {t("nav.signInMFA.sentTo", { phoneNumber })}{" "}
        <Button variant="text" className="font-semibold" onClick={() => goBackToPhone()}>
          {" "}
          {t("nav.signInMFA.editPhoneNumber")}{" "}
        </Button>
      </>
    )
  }

  return (
    <FormCard>
      <div className="form-card__lead text-center">
        <Icon size="2xl" symbol="profile" className="form-card__header-icon" />
        <h2 className="form-card__title is-borderless">{t("nav.signInMFA.verifyTitle")}</h2>
        <p className="form-card__sub-title">
          {mfaType === RequestType.sms
            ? t("nav.signInMFA.haveSentCodeToPhone")
            : t("nav.signInMFA.haveSentCodeToEmail")}
        </p>
      </div>
      <FormSignInErrorBox
        errors={errors}
        networkStatus={networkError}
        errorMessageId={"mfa-code"}
      />

      <div className="form-card__group pt-0">
        <Form id="sign-in-mfa" className="mt-10" onSubmit={handleSubmit(onSubmit, onError)}>
          <Field
            caps={true}
            name="mfaCode"
            label={t("nav.signInMFA.code")}
            validation={{ required: true }}
            error={errors.mfaCode}
            errorMessage={t("nav.signInMFA.noMFACode")}
            register={register}
            dataTestId="sign-in-mfa-code-field"
            note={note}
          />
          <div className="text-center mt-10">
            <Button type="submit" variant="primary" id="verify-and-sign-in">
              {t("nav.signInMFA.signIn")}
            </Button>
          </div>
        </Form>
      </div>
    </FormCard>
  )
}

export { FormSignInMFACode as default, FormSignInMFACode }
