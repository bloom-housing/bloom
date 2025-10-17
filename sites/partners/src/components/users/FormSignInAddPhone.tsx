import React from "react"
import { t, PhoneField } from "@bloom-housing/ui-components"
import { Button, Card } from "@bloom-housing/ui-seeds"
import type { UseFormMethods } from "react-hook-form"
import { BloomCard, Form, FormSignInErrorBox, NetworkStatus } from "@bloom-housing/shared-helpers"
import styles from "./FormSignIn.module.scss"

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
    <BloomCard
      title={t("nav.signInMFA.addNumber")}
      subtitle={t("nav.signInMFA.addNumberSecondaryTitle")}
      iconSymbol="profile"
    >
      <Form id="sign-in-mfa" onSubmit={handleSubmit(onSubmit, onError)}>
        <FormSignInErrorBox
          errors={errors}
          networkStatus={networkError}
          errorMessageId={"add-phone"}
          className={styles["sign-in-error-container"]}
        />
        <Card.Section>
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
        </Card.Section>
        <Card.Footer>
          <Card.Section>
            <Button type="submit" variant="primary" id="request-mfa-code-and-add-phone">
              {t("nav.signInMFA.addPhoneNumber")}
            </Button>
          </Card.Section>
        </Card.Footer>
      </Form>
    </BloomCard>
  )
}

export { FormSignInAddPhone as default, FormSignInAddPhone }
