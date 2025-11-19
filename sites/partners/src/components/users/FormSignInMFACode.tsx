import React from "react"
import { Field, t } from "@bloom-housing/ui-components"
import { Button, Card } from "@bloom-housing/ui-seeds"
import {
  BloomCard,
  Form,
  FormSignInControl,
  FormSignInErrorBox,
  NetworkStatus,
} from "@bloom-housing/shared-helpers"
import styles from "./FormSignIn.module.scss"

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
      title={t("nav.signInMFA.verifyTitle")}
      subtitle={
        mfaType === RequestType.sms
          ? t("nav.signInMFA.haveSentCodeToPhone")
          : t("nav.signInMFA.haveSentCodeToEmail")
      }
      iconSymbol="profile"
    >
      <Form id="sign-in-mfa" onSubmit={handleSubmit(onSubmit, onError)}>
        <FormSignInErrorBox
          errors={errors}
          networkStatus={networkError}
          errorMessageId={"mfa-code"}
          className={styles["sign-in-error-container"]}
        />
        <Card.Section>
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
        <Card.Footer>
          <Card.Section>
            <Button type="submit" variant="primary" id="verify-and-sign-in">
              {t("nav.signInMFA.signIn")}
            </Button>
          </Card.Section>
        </Card.Footer>
      </Form>
    </BloomCard>
  )
}

export { FormSignInMFACode as default, FormSignInMFACode }
