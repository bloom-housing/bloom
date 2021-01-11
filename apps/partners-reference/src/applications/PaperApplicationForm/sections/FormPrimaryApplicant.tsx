import React, { useEffect } from "react"
import { useFormContext } from "react-hook-form"
import {
  t,
  GridSection,
  ViewItem,
  DOBField,
  Select,
  GridCell,
  Field,
  emailRegex,
  PhoneField,
  phoneNumberKeys,
  contactPreferencesKeys,
  FieldGroup,
} from "@bloom-housing/ui-components"
import { FormAddress } from "../FormAddress"

export enum FormPrimaryApplicantFields {
  FirstName = "application.applicant.firstName",
  MiddleName = "application.applicant.middleName",
  LastName = "application.applicant.lastName",
  DateOfBirth = "dateOfBirth",
  EmailAddress = "application.applicant.emailAddress",
  PhoneNumber = "phoneNumber",
  PhoneNumberType = "application.applicant.phoneNumberType",
  AdditionalPhoneNumber = "application.additionalPhoneNumber",
  AdditionalPhoneNumberType = "application.additionalPhoneNumberType",
  ContactPreferences = "application.contactPreferences",
  WorkInRegion = "application.applicant.workInRegion",
  Address = "application.applicant.address",
  AddressStreet = "application.applicant.address.street",
  AddressStreet2 = "application.applicant.address.street2",
  AddressCity = "application.applicant.address.city",
  AddressState = "application.applicant.address.state",
  AddressZip = "application.applicant.address.zip",
  MailToMailingAddress = "application.sendMailToMailingAddress",
  MailingAddress = "application.mailingAddress",
  MailingAddressStreet = "application.mailingAddress.street",
  MailingAddressStreet2 = "application.mailingAddress.street2",
  MailingAddressCity = "application.mailingAddress.city",
  MailingAddressState = "application.mailingAddress.state",
  MailingAddressZip = "application.mailingAddress.zip",
  WorkAddress = "application.applicant.workAddress",
  WorkAddressStreet = "application.applicant.workAddress.street",
  WorkAddressStreet2 = "application.applicant.workAddress.street2",
  WorkAddressCity = "application.applicant.workAddress.city",
  WorkAddressState = "application.applicant.workAddress.state",
  WorkAddressZip = "application.applicant.workAddress.zip",
}

export enum FormPrimaryApplicantWorkValues {
  Yes = "yes",
  No = "no",
}

const FormPrimaryApplicant = () => {
  const formMethods = useFormContext()

  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { register, watch, errors, control, setValue, clearErrors } = formMethods

  const contactPreferencesOptions = contactPreferencesKeys?.map((item) => ({
    id: item.id,
    label: t(`t.${item.id}`),
  }))

  const mailingAddressValue: boolean = watch("application.sendMailToMailingAddress")
  const workInRegionValue: "yes" | "no" = watch("application.applicant.workInRegion")
  const phoneValue: string = watch("phoneNumber")
  const additionalPhoneValue: string = watch("application.additionalPhoneNumber")

  // reset phone type field when phone is empty
  useEffect(() => {
    const fieldKey = FormPrimaryApplicantFields.PhoneNumberType
    if (!phoneValue?.length) {
      setValue(fieldKey, "")
      clearErrors(fieldKey)
    }
  }, [setValue, clearErrors, phoneValue])

  // reset additional phone type field when additional phone is empty
  useEffect(() => {
    const fieldKey = FormPrimaryApplicantFields.AdditionalPhoneNumberType
    if (!additionalPhoneValue?.length) {
      setValue(fieldKey, "")
      clearErrors(fieldKey)
    }
  }, [setValue, clearErrors, additionalPhoneValue])

  return (
    <GridSection title={t("application.household.primaryApplicant")} grid={false} separator>
      <GridSection columns={3}>
        <GridCell>
          <ViewItem label={t("application.name.firstName")}>
            <Field
              id={FormPrimaryApplicantFields.FirstName}
              name={FormPrimaryApplicantFields.FirstName}
              label={t("application.name.firstName")}
              placeholder={t("application.name.firstName")}
              register={register}
              readerOnly
            />
          </ViewItem>
        </GridCell>
        <GridCell>
          <ViewItem label={t("application.name.middleName")}>
            <Field
              id={FormPrimaryApplicantFields.MiddleName}
              name={FormPrimaryApplicantFields.MiddleName}
              label={t("application.name.middleNameOptional")}
              placeholder={t("application.name.middleNameOptional")}
              register={register}
              readerOnly
            />
          </ViewItem>
        </GridCell>
        <GridCell>
          <ViewItem label={t("application.name.lastName")}>
            <Field
              id={FormPrimaryApplicantFields.LastName}
              name={FormPrimaryApplicantFields.LastName}
              label={t("application.name.lastName")}
              placeholder={t("application.name.lastName")}
              register={register}
              readerOnly
            />
          </ViewItem>
        </GridCell>
        <GridCell>
          <ViewItem label={t("application.household.member.dateOfBirth")}>
            <DOBField
              id={FormPrimaryApplicantFields.DateOfBirth}
              name={FormPrimaryApplicantFields.DateOfBirth}
              register={register}
              error={errors?.dateOfBirth}
              watch={watch}
              atAge={true}
              label={t("application.name.yourDateOfBirth")}
              readerOnly
            />
          </ViewItem>
        </GridCell>
        <GridCell>
          <ViewItem label={t("t.email")}>
            <Field
              id={FormPrimaryApplicantFields.EmailAddress}
              name={FormPrimaryApplicantFields.EmailAddress}
              type="email"
              placeholder="example@web.com"
              label={t("application.name.yourEmailAddress")}
              readerOnly={true}
              validation={{ pattern: emailRegex }}
              error={errors.application?.applicant?.emailAddress}
              errorMessage={t("errors.emailAddressError")}
              register={register}
            />
          </ViewItem>
        </GridCell>
        <GridCell>
          <ViewItem label={t("t.phone")}>
            <PhoneField
              id={FormPrimaryApplicantFields.PhoneNumber}
              name={FormPrimaryApplicantFields.PhoneNumber}
              label={t("application.contact.yourPhoneNumber")}
              required={false}
              error={errors?.phoneNumber}
              errorMessage={t("errors.phoneNumberError")}
              control={control}
              controlClassName="control"
              readerOnly
            />
          </ViewItem>
        </GridCell>
        <GridCell>
          <ViewItem label={t("applications.table.phoneType")}>
            <Select
              id={FormPrimaryApplicantFields.PhoneNumberType}
              name={FormPrimaryApplicantFields.PhoneNumberType}
              placeholder={t("application.contact.phoneNumberTypes.prompt")}
              label={t("application.contact.phoneNumberTypes.prompt")}
              labelClassName="sr-only"
              error={errors.application?.applicant?.phoneNumberType}
              errorMessage={t("errors.phoneNumberTypeError")}
              register={register}
              controlClassName="control"
              options={phoneNumberKeys}
              keyPrefix="application.contact.phoneNumberTypes"
              validation={{ required: phoneValue?.length }}
              disabled={!phoneValue?.length}
            />
          </ViewItem>
        </GridCell>
        <GridCell>
          <ViewItem label={t("t.additionalPhone")}>
            <PhoneField
              id={FormPrimaryApplicantFields.AdditionalPhoneNumber}
              name={FormPrimaryApplicantFields.AdditionalPhoneNumber}
              label={t("application.contact.yourAdditionalPhoneNumber")}
              required={false}
              error={errors.application?.additionalPhoneNumber}
              errorMessage={t("errors.phoneNumberError")}
              control={control}
              controlClassName="control"
              readerOnly
            />
          </ViewItem>
        </GridCell>
        <GridCell>
          <ViewItem label={t("applications.table.additionalPhoneType")}>
            <Select
              id={FormPrimaryApplicantFields.AdditionalPhoneNumberType}
              name={FormPrimaryApplicantFields.AdditionalPhoneNumberType}
              error={errors.application?.additionalPhoneNumberType}
              errorMessage={t("errors.phoneNumberTypeError")}
              register={register}
              controlClassName="control"
              placeholder={t("application.contact.phoneNumberTypes.prompt")}
              label={t("application.contact.phoneNumberTypes.prompt")}
              labelClassName={"sr-only"}
              options={phoneNumberKeys}
              keyPrefix="application.contact.phoneNumberTypes"
              validation={{ required: additionalPhoneValue?.length }}
              disabled={!additionalPhoneValue?.length}
            />
          </ViewItem>
        </GridCell>

        <GridCell>
          <ViewItem label={t("application.contact.preferredContactType")}>
            <FieldGroup
              name={FormPrimaryApplicantFields.ContactPreferences}
              fields={contactPreferencesOptions}
              type="checkbox"
              register={register}
            />
          </ViewItem>
        </GridCell>

        <GridCell>
          <ViewItem label={t("application.add.workInRegion")}>
            <div className="flex items-center">
              <Field
                id={`${FormPrimaryApplicantFields.WorkInRegion}Yes`}
                name={FormPrimaryApplicantFields.WorkInRegion}
                className="m-0"
                type="radio"
                label={t("t.yes")}
                register={register}
                inputProps={{
                  value: FormPrimaryApplicantWorkValues.Yes,
                }}
              />

              <Field
                id={`${FormPrimaryApplicantFields.WorkInRegion}No`}
                name={FormPrimaryApplicantFields.WorkInRegion}
                className="m-0"
                type="radio"
                label={t("t.no")}
                register={register}
                inputProps={{
                  value: FormPrimaryApplicantWorkValues.No,
                }}
              />
            </div>
          </ViewItem>
        </GridCell>
      </GridSection>

      {FormAddress(
        t("application.details.residenceAddress"),
        FormPrimaryApplicantFields.Address,
        "residence",
        register
      )}

      {mailingAddressValue &&
        FormAddress(
          t("application.contact.mailingAddress"),
          FormPrimaryApplicantFields.MailingAddress,
          "mailing",
          register
        )}

      {workInRegionValue === FormPrimaryApplicantWorkValues.Yes &&
        FormAddress(
          t("application.contact.workAddress"),
          FormPrimaryApplicantFields.WorkAddress,
          "work",
          register
        )}
    </GridSection>
  )
}

export { FormPrimaryApplicant as default, FormPrimaryApplicant }
