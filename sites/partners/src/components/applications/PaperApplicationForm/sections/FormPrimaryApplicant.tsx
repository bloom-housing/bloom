import React, { useEffect } from "react"
import { useFormContext } from "react-hook-form"
import {
  t,
  DOBField,
  Select,
  Field,
  PhoneField,
  FieldGroup,
  FormAddress,
} from "@bloom-housing/ui-components"
import { Grid } from "@bloom-housing/ui-seeds"
import {
  phoneNumberKeys,
  contactPreferencesKeys,
  stateKeys,
  emailRegex,
} from "@bloom-housing/shared-helpers"
import SectionWithGrid from "../../../shared/SectionWithGrid"

const FormPrimaryApplicant = () => {
  const formMethods = useFormContext()

  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { register, watch, errors, control, setValue, clearErrors } = formMethods

  const contactPreferencesOptions = contactPreferencesKeys?.map((item) => ({
    id: item.id,
    label: t(`t.${item.id}`),
  }))

  const mailingAddressValue: boolean = watch("application.sendMailToMailingAddress")
  const phoneValue: string = watch("phoneNumber")
  const additionalPhoneValue: string = watch("application.additionalPhoneNumber")

  // reset phone type field when phone is empty
  useEffect(() => {
    const fieldKey = "application.applicant.phoneNumberType"
    if (!phoneValue?.length) {
      setValue(fieldKey, "")
      clearErrors(fieldKey)
    }
  }, [setValue, clearErrors, phoneValue])

  // reset additional phone type field when additional phone is empty
  useEffect(() => {
    const fieldKey = "application.additionalPhoneNumberType"
    if (!additionalPhoneValue?.length) {
      setValue(fieldKey, "")
      clearErrors(fieldKey)
    }
  }, [setValue, clearErrors, additionalPhoneValue])

  return (
    <>
      <hr className="spacer-section-above spacer-section" />
      <SectionWithGrid heading={t("application.household.primaryApplicant")}>
        <Grid.Row columns={3}>
          <Grid.Cell>
            <Field
              id="application.applicant.firstName"
              name="application.applicant.firstName"
              label={t("application.name.firstName")}
              placeholder={t("application.name.firstName")}
              register={register}
            />
          </Grid.Cell>
          <Grid.Cell>
            <Field
              id="application.applicant.middleName"
              name="application.applicant.middleName"
              label={t("application.name.middleNameOptional")}
              placeholder={t("application.name.middleNameOptional")}
              register={register}
            />
          </Grid.Cell>
          <Grid.Cell>
            <Field
              id="application.applicant.lastName"
              name="application.applicant.lastName"
              label={t("application.name.lastName")}
              placeholder={t("application.name.lastName")}
              register={register}
            />
          </Grid.Cell>
          <Grid.Cell>
            <DOBField
              id="dateOfBirth"
              name="dateOfBirth"
              register={register}
              error={errors?.dateOfBirth}
              errorMessage={t("errors.dateOfBirthErrorAge")}
              watch={watch}
              validateAge18={true}
              label={t("application.household.member.dateOfBirth")}
            />
          </Grid.Cell>
          <Grid.Cell>
            <Field
              id="application.applicant.emailAddress"
              name="application.applicant.emailAddress"
              type="email"
              placeholder="example@web.com"
              label={t("t.email")}
              validation={{ pattern: emailRegex }}
              error={errors.application?.applicant?.emailAddress}
              errorMessage={t("errors.emailAddressError")}
              register={register}
            />
          </Grid.Cell>
          <Grid.Cell>
            <PhoneField
              id="phoneNumber"
              name="phoneNumber"
              label={t("t.phone")}
              required={false}
              error={errors?.phoneNumber}
              errorMessage={t("errors.phoneNumberError")}
              control={control}
              controlClassName="control"
            />
          </Grid.Cell>
          <Grid.Cell>
            <Select
              id="application.applicant.phoneNumberType"
              name="application.applicant.phoneNumberType"
              placeholder={t("application.contact.phoneNumberTypes.prompt")}
              label={t("application.contact.phoneNumberTypes.prompt")}
              error={errors.application?.applicant?.phoneNumberType}
              errorMessage={t("errors.phoneNumberTypeError")}
              register={register}
              controlClassName="control"
              options={phoneNumberKeys}
              keyPrefix="application.contact.phoneNumberTypes"
              validation={{ required: !!phoneValue?.length }}
              disabled={!phoneValue?.length}
            />
          </Grid.Cell>
          <Grid.Cell>
            <PhoneField
              id="application.additionalPhoneNumber"
              name="application.additionalPhoneNumber"
              label={t("t.additionalPhone")}
              required={false}
              error={errors.application?.additionalPhoneNumber}
              errorMessage={t("errors.phoneNumberError")}
              control={control}
              controlClassName="control"
            />
          </Grid.Cell>
          <Grid.Cell>
            <Select
              id="application.additionalPhoneNumberType"
              name="application.additionalPhoneNumberType"
              error={errors.application?.additionalPhoneNumberType}
              errorMessage={t("errors.phoneNumberTypeError")}
              register={register}
              controlClassName="control"
              placeholder={t("application.contact.phoneNumberTypes.prompt")}
              label={t("applications.table.additionalPhoneType")}
              options={phoneNumberKeys}
              keyPrefix="application.contact.phoneNumberTypes"
              validation={{ required: !!additionalPhoneValue?.length }}
              disabled={!additionalPhoneValue?.length}
            />
          </Grid.Cell>

          <Grid.Cell>
            <FieldGroup
              name="application.contactPreferences"
              fields={contactPreferencesOptions}
              type="checkbox"
              register={register}
              groupLabel={t("application.contact.preferredContactType")}
            />
          </Grid.Cell>
        </Grid.Row>

        <FormAddress
          subtitle={t("application.details.residenceAddress")}
          dataKey="application.applicant.applicantAddress"
          enableMailCheckbox={true}
          register={register}
          stateKeys={stateKeys}
        />

        {mailingAddressValue && (
          <FormAddress
            subtitle={t("application.contact.mailingAddress")}
            dataKey="application.applicationsMailingAddress"
            register={register}
            stateKeys={stateKeys}
          />
        )}
      </SectionWithGrid>
    </>
  )
}

export { FormPrimaryApplicant as default, FormPrimaryApplicant }
