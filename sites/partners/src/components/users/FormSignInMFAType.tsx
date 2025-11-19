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

export type FormSignInMFAProps = {
  control: FormSignInControl
  onSubmit: (data: unknown) => void
  networkError: NetworkStatus
  emailOnClick: () => void
  smsOnClick: () => void
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

  const subTitle = process.env.showSmsMfa ? t("nav.signInMFA.verificationChoiceSecondaryTitle") : undefined

  return (
    <BloomCard title={t("nav.signInMFA.verificationChoiceMainTitle")} iconSymbol="profile">
      <Form id="sign-in-mfa" onSubmit={handleSubmit(onSubmit, onError)}>
        <FormSignInErrorBox
          errors={errors}
          networkStatus={networkError}
          errorMessageId={"mfa-type"}
          className={styles["sign-in-error-container"]}
        />

        {subTitle && (
          <Card.Section>
            <p>{subTitle}</p>
          </Card.Section>
        )}

        <Field
          name="mfaType"
          label={"MFA Type"}
          validation={{ required: true }}
          error={errors.mfaType}
          errorMessage={t("nav.signInMFA.noMFAType")}
          register={register}
          dataTestId="sign-in-mfaType-field"
          hidden={true}
        />

        <Card.Footer>
          <Card.Section>
            <Button
              type="submit"
              variant="primary-outlined"
              id="verify-by-email"
              onClick={emailOnClick}
            >
              {t("nav.signInMFA.verifyByEmail")}
            </Button>
          </Card.Section>
          {process.env.showSmsMfa && (
            <Card.Section>
              <Button
                type="submit"
                variant="primary-outlined"
                id="verify-by-phone"
                onClick={smsOnClick}
              >
                {t("nav.signInMFA.verifyByPhone")}
              </Button>
            </Card.Section>
          )}
        </Card.Footer>
      </Form>
    </BloomCard>
  )
}

export { FormSignInMFAType as default, FormSignInMFAType }
