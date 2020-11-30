import React, { useState, useCallback, useEffect } from "react"
// import { useRouter } from "next/router"
import {
  t,
  GridSection,
  ViewItem,
  GridCell,
  DOBField,
  Field,
  emailRegex,
  PhoneField,
  Select,
  contactPreferencesKeys,
  FieldGroup,
  Button,
  Form,
  AlertBox,
  BlankApplicationFields,
} from "@bloom-housing/ui-components"
import { useForm } from "react-hook-form"
import { phoneNumberKeys, stateKeys } from "@bloom-housing/ui-components/src/helpers/formOptions"

type Props = {
  isEditable?: boolean
}

const ApplicationForm = ({ isEditable }: Props) => {
  const [errorAlert, setErrorAlert] = useState(false)
  const contactPreferencesOptions = contactPreferencesKeys?.map((item) => ({
    id: item.id,
    label: t(`application.form.options.contact.${item.id}`),
  }))

  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { register, watch, control, handleSubmit, errors, setValue, clearErrors } = useForm()

  const mailingAddressValue: boolean = watch("application.sendMailToMailingAddress")
  const workInRegionValue: boolean = watch("application.applicant.workInRegion")
  const phoneValue: string = watch("application.phoneNumber")
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

  const onSubmit = (data) => {
    setErrorAlert(false)

    const noPhone = data?.application?.phoneNumber?.length ? false : true
    const noEmail = data?.application?.applicant?.emailAddress?.length ? false : true

    const response = {
      ...BlankApplicationFields,
      noPhone,
      noEmail,
    }

    console.log("Submit SUCCESS", response)
  }

  const onError = (error) => {
    setErrorAlert(true)
    console.log("Submit ERROR", error)
  }

  const ApplicationAddress = useCallback(
    (subtitle: string, dataKey: string) => {
      return (
        <GridSection subtitle={subtitle}>
          <GridCell span={2}>
            <ViewItem label={t("application.contact.streetAddress")}>
              <Field
                id={`${dataKey}.street`}
                name={`${dataKey}.street`}
                label={t("application.contact.streetAddress")}
                placeholder={t("application.contact.streetAddress")}
                register={register}
                readerOnly
              />
            </ViewItem>
          </GridCell>
          <GridCell>
            <ViewItem label={t("application.contact.apt")}>
              <Field
                id={`${dataKey}.street2`}
                name={`${dataKey}.street2`}
                label={t("application.contact.apt")}
                placeholder={t("application.contact.apt")}
                register={register}
                readerOnly
              />
            </ViewItem>
          </GridCell>

          <GridCell>
            <ViewItem label={t("application.contact.city")}>
              <Field
                id={`${dataKey}.city`}
                name={`${dataKey}.city`}
                label={t("application.contact.cityName")}
                placeholder={t("application.contact.cityName")}
                register={register}
                readerOnly
              />
            </ViewItem>
          </GridCell>

          <GridCell className="md:grid md:grid-cols-2 md:gap-8" span={2}>
            <ViewItem label={t("application.contact.state")} className="mb-0">
              <Select
                id={`${dataKey}.state`}
                name={`${dataKey}.state`}
                label={t("application.contact.state")}
                labelClassName="sr-only"
                register={register}
                controlClassName="control"
                options={stateKeys}
                keyPrefix="application.form.options.states"
              />
            </ViewItem>

            <ViewItem label={t("application.contact.zip")}>
              <Field
                id={`${dataKey}.zipCode`}
                name={`${dataKey}.zipCode`}
                label={t("application.contact.zip")}
                placeholder={t("application.contact.zipCode")}
                register={register}
                readerOnly
              />
            </ViewItem>
          </GridCell>
        </GridSection>
      )
    },
    [register]
  )

  return (
    <>
      <section className="bg-primary-lighter">
        {errorAlert && (
          <AlertBox onClose={() => setErrorAlert(false)} closeable>
            {t("application.add.applicationAddError")}
          </AlertBox>
        )}
        <Form id="application-form" onSubmit={handleSubmit(onSubmit, onError)}>
          <div className="flex flex-row flex-wrap mx-auto px-5 mt-5 max-w-screen-xl">
            <div className="info-card md:w-9/12">
              <GridSection title={t("application.household.primaryApplicant")} grid={false}>
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
                        id="application.applicant.dateOfBirth"
                        name="application.applicant.dateOfBirth"
                        register={register}
                        error={errors.application?.applicant?.dateOfBirth}
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
                        id="application.applicant.emailAddress"
                        name="application.applicant.emailAddress"
                        type="email"
                        placeholder="example@web.com"
                        label={t("application.name.yourEmailAddress")}
                        readerOnly={true}
                        validation={{ pattern: emailRegex }}
                        error={errors.application?.applicant?.emailAddress}
                        errorMessage={t("application.name.emailAddressError")}
                        register={register}
                      />
                    </ViewItem>
                  </GridCell>
                  <GridCell>
                    <ViewItem label={t("t.phone")}>
                      <PhoneField
                        id="application.phoneNumber"
                        name="application.phoneNumber"
                        label={t("application.contact.yourPhoneNumber")}
                        required={false}
                        error={errors.application?.phoneNumber}
                        errorMessage={t("application.contact.phoneNumberError")}
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
                        errorMessage={t("application.contact.phoneNumberTypeError")}
                        register={register}
                        controlClassName="control"
                        options={phoneNumberKeys}
                        keyPrefix="application.contact.phoneNumberTypes"
                        validation={{ required: phoneValue?.length > 0 }}
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
                        errorMessage={t("application.contact.phoneNumberError")}
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
                        errorMessage={t("application.contact.phoneNumberTypeError")}
                        register={register}
                        controlClassName="control"
                        placeholder={t("application.contact.phoneNumberTypes.prompt")}
                        label={t("application.contact.phoneNumberTypes.prompt")}
                        labelClassName={"sr-only"}
                        options={phoneNumberKeys}
                        keyPrefix="application.contact.phoneNumberTypes"
                        validation={{ required: additionalPhoneValue?.length > 0 }}
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
                    <ViewItem>
                      <Field
                        id="application.sendMailToMailingAddress"
                        name="application.sendMailToMailingAddress"
                        type="checkbox"
                        label="I have mailing address"
                        register={register}
                      />

                      <Field
                        id="application.applicant.workInRegion"
                        name="application.applicant.workInRegion"
                        type="checkbox"
                        label="I work in region"
                        register={register}
                      />
                    </ViewItem>
                  </GridCell>
                </GridSection>

                {ApplicationAddress(
                  t("application.details.residenceAddress"),
                  "application.applicant.address"
                )}

                {mailingAddressValue &&
                  ApplicationAddress(
                    t("application.contact.mailingAddress"),
                    "application.mailingAddress"
                  )}

                {workInRegionValue &&
                  ApplicationAddress(
                    t("application.contact.workAddress"),
                    "application.applicant.workAddress"
                  )}
              </GridSection>
            </div>

            <div className="md:w-3/12">
              <ul className="status-messages">
                <li className="status-message">
                  <div className="status-message__note text-center">
                    <Button
                      onClick={() => {
                        //
                      }}
                    >
                      Submit
                    </Button>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </Form>
      </section>
    </>
  )
}

export default ApplicationForm
