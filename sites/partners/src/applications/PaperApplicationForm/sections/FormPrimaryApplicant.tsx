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
  FieldGroup,
  FormAddress,
} from "@bloom-housing/ui-components"
import { phoneNumberKeys, contactPreferencesKeys, stateKeys } from "../../../../shared"
import { YesNoAnswer } from "../../PaperApplicationForm/FormTypes"

const FormPrimaryApplicant = () => {
  const formMethods = useFormContext()

  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { register, watch, errors, control, setValue, clearErrors } = formMethods

  const contactPreferencesOptions = contactPreferencesKeys?.map((item) => ({
    id: item.id,
    label: t(`t.${item.id}`),
  }))

  const mailingAddressValue: boolean = watch("application.sendMailToMailingAddress")
  const workInRegionValue: YesNoAnswer = watch("application.applicant.workInRegion")
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
    <GridSection title={t("application.household.primaryApplicant")} grid={false} separator>
      <GridSection columns={3}>
        <GridCell>
          <ViewItem label={t("application.name.firstName")}>
            <Field
              id="application.applicant.firstName"
              name="application.applicant.firstName"
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
              id="application.applicant.middleName"
              name="application.applicant.middleName"
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
              id="application.applicant.lastName"
              name="application.applicant.lastName"
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
              id="dateOfBirth"
              name="dateOfBirth"
              register={register}
              error={errors?.dateOfBirth}
              errorMessage={t("errors.dateOfBirthErrorAge")}
              watch={watch}
              validateAge18={true}
              label={t("application.name.yourDateOfBirth")}
              readerOnly
            />
          </ViewItem>
        </GridCell>
        <GridCell>
          <ViewItem label={t("t.email")}>
            <Field
              id="application.applicant.emailAddress"
              name="application.applicant.emailAddress"
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
              id="phoneNumber"
              name="phoneNumber"
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
              id="application.applicant.phoneNumberType"
              name="application.applicant.phoneNumberType"
              placeholder={t("application.contact.phoneNumberTypes.prompt")}
              label={t("application.contact.phoneNumberTypes.prompt")}
              labelClassName="sr-only"
              error={errors.application?.applicant?.phoneNumberType}
              errorMessage={t("errors.phoneNumberTypeError")}
              register={register}
              controlClassName="control"
              options={phoneNumberKeys}
              keyPrefix="application.contact.phoneNumberTypes"
              validation={{ required: !!phoneValue?.length }}
              disabled={!phoneValue?.length}
            />
          </ViewItem>
        </GridCell>
        <GridCell>
          <ViewItem label={t("t.additionalPhone")}>
            <PhoneField
              id="application.additionalPhoneNumber"
              name="application.additionalPhoneNumber"
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
              id="application.additionalPhoneNumberType"
              name="application.additionalPhoneNumberType"
              error={errors.application?.additionalPhoneNumberType}
              errorMessage={t("errors.phoneNumberTypeError")}
              register={register}
              controlClassName="control"
              placeholder={t("application.contact.phoneNumberTypes.prompt")}
              label={t("application.contact.phoneNumberTypes.prompt")}
              labelClassName={"sr-only"}
              options={phoneNumberKeys}
              keyPrefix="application.contact.phoneNumberTypes"
              validation={{ required: !!additionalPhoneValue?.length }}
              disabled={!additionalPhoneValue?.length}
            />
          </ViewItem>
        </GridCell>

        <GridCell>
          <ViewItem label={t("application.contact.preferredContactType")}>
            <FieldGroup
              name="application.contactPreferences"
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
                id="application.applicant.workInRegionYes"
                name="application.applicant.workInRegion"
                className="m-0"
                type="radio"
                label={t("t.yes")}
                register={register}
                inputProps={{
                  value: YesNoAnswer.Yes,
                }}
              />

              <Field
                id="application.applicant.workInRegionNo"
                name="application.applicant.workInRegion"
                className="m-0"
                type="radio"
                label={t("t.no")}
                register={register}
                inputProps={{
                  value: YesNoAnswer.No,
                }}
              />
            </div>
          </ViewItem>
        </GridCell>
      </GridSection>

      <FormAddress
        subtitle={t("application.details.residenceAddress")}
        dataKey="application.applicant.address"
        enableMailCheckbox={true}
        register={register}
        stateKeys={stateKeys}
      />

      {mailingAddressValue && (
        <FormAddress
          subtitle={t("application.contact.mailingAddress")}
          dataKey="application.mailingAddress"
          register={register}
          stateKeys={stateKeys}
        />
      )}

      {workInRegionValue === YesNoAnswer.Yes && (
        <FormAddress
          subtitle={t("application.contact.workAddress")}
          dataKey="application.applicant.workAddress"
          register={register}
          stateKeys={stateKeys}
        />
      )}
    </GridSection>
  )
}

export { FormPrimaryApplicant as default, FormPrimaryApplicant }
