import React from "react"
import type { UseFormMethods } from "react-hook-form"
import {
  Form,
  t,
  PhoneField,
  FormSignInErrorBox,
  NetworkStatus,
} from "@bloom-housing/ui-components"
import { Button, Card } from "@bloom-housing/ui-seeds"
import { BloomCard } from "@bloom-housing/shared-helpers"

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
      iconSymbol="userCircle"
      title={t("nav.signInMFA.addNumber")}
      headingPriority={1}
      iconClass={"card-icon"}
      iconOutlined={true}
      headingClass="seeds-large-heading"
      subtitle={t("nav.signInMFA.addNumberSecondaryTitle")}
    >
      <Form id="sign-in-mfa" onSubmit={handleSubmit(onSubmit, onError)}>
        <Card.Section>
          {networkError?.content?.error && (
            <div className={"seeds-m-be-6"}>
              <FormSignInErrorBox
                errors={errors}
                networkStatus={networkError}
                errorMessageId={"add-phone"}
              />
            </div>
          )}
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
        <Card.Section className={"primary-bg seeds-m-bs-section"}>
          <Button type="submit" variant="primary" id="request-mfa-code-and-add-phone">
            {t("t.addPhoneNumber")}
          </Button>
        </Card.Section>
      </Form>
    </BloomCard>
  )
}

export { FormSignInAddPhone as default, FormSignInAddPhone }
