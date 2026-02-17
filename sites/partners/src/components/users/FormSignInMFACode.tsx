import React from "react"
import {
  Field,
  Form,
  t,
  FormSignInErrorBox,
  NetworkStatus,
  FormSignInControl,
} from "@bloom-housing/ui-components"
import { Button, Card } from "@bloom-housing/ui-seeds"
import { BloomCard } from "@bloom-housing/shared-helpers"

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
    <BloomCard
      iconSymbol="userCircle"
      title={t("nav.signInMFA.verifyTitle")}
      headingPriority={1}
      iconClass={"card-icon"}
      iconOutlined={true}
      headingClass="seeds-large-heading"
      subtitle={
        mfaType === RequestType.sms
          ? t("nav.signInMFA.haveSentCodeToPhone")
          : t("nav.signInMFA.haveSentCodeToEmail")
      }
    >
      <Form id="sign-in-mfa" onSubmit={handleSubmit(onSubmit, onError)}>
        <Card.Section>
          {networkError?.content?.error && (
            <div className={"seeds-m-be-6"}>
              <FormSignInErrorBox
                errors={errors}
                networkStatus={networkError}
                errorMessageId={"mfa-code"}
              />
            </div>
          )}
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
        </Card.Section>
        <Card.Section className={"primary-bg seeds-m-bs-section"}>
          <Button type="submit" variant="primary" id="verify-and-sign-in">
            {t("nav.signInMFA.signIn")}
          </Button>
        </Card.Section>
      </Form>
    </BloomCard>
  )
}

export { FormSignInMFACode as default, FormSignInMFACode }
