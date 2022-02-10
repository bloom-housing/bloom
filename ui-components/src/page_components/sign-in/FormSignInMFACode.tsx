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
import { FormSignInNetworkError, FormSignInControl } from "./FormSignIn"
import { EnumRequestMfaCodeMfaType } from "@bloom-housing/backend-core/types"

export type FormSignInMFACodeProps = {
  control: FormSignInControl
  onSubmit: (data: FormSignInMFACodeValues) => void
  networkError: FormSignInNetworkError
  mfaType: EnumRequestMfaCodeMfaType
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

  let subNote
  if (allowPhoneNumberEdit) {
    subNote = (
      <span className="field-sub-note">
        <p>
          {" "}
          {t("nav.signInMFA.sentTo", { phoneNumber })}{" "}
          <a onClick={() => goBackToPhone()}> {t("nav.signInMFA.editPhoneNumber")} </a>
        </p>
      </span>
    )
  }

  return (
    <FormCard>
      <div className="form-card__lead text-center border-b mx-0">
        <Icon size="2xl" symbol="profile" />
        <h2 className="form-card__title">{t("nav.signInMFA.verifyTitle")}</h2>
        <p className="form-card__sub-title">
          {mfaType === EnumRequestMfaCodeMfaType.sms
            ? t("nav.signInMFA.haveSentCodeToPhone")
            : t("nav.signInMFA.haveSentCodeToEmail")}
        </p>
      </div>
      <FormSignInErrorBox errors={errors} networkError={networkError} errorMessageId={"mfa-code"} />

      <SiteAlert type="notice" dismissable />
      <div className="form-card__group pt-0 border-b">
        <Form id="sign-in-mfa" className="mt-10" onSubmit={handleSubmit(onSubmit, onError)}>
          <Field
            caps={true}
            name="mfaCode"
            label={t("nav.signInMFA.code")}
            validation={{ required: true }}
            error={errors.mfaType}
            errorMessage={t("nav.signInMFA.noMFACode")}
            register={register}
            dataTestId="sign-in-mfa-code-field"
            helperElement={subNote}
          />
          <div className="text-center mt-6">
            <Button styleType={AppearanceStyleType.primary} data-test-id="verify-and-sign-in">
              {t("nav.signInMFA.signIn")}
            </Button>
          </div>
        </Form>
      </div>
    </FormCard>
  )
}

export { FormSignInMFACode as default, FormSignInMFACode }
