import React, { useState, useCallback, useEffect, useMemo } from "react"
// import { useRouter } from "next/router"
import {
  t,
  GridSection,
  StatusAside,
  StatusMessages,
  ViewItem,
  GridCell,
  DOBField,
  Field,
  emailRegex,
  PhoneField,
  Select,
  contactPreferencesKeys,
  altContactRelationshipKeys,
  ethnicityKeys,
  raceKeys,
  genderKeys,
  sexualOrientation,
  howDidYouHear,
  FieldGroup,
  Button,
  LinkButton,
  Form,
  AlertBox,
  AppearanceStyleType,
} from "@bloom-housing/ui-components"
import { useForm } from "react-hook-form"
import { phoneNumberKeys, stateKeys } from "@bloom-housing/ui-components/src/helpers/formOptions"

type Props = {
  isEditable?: boolean
}

type AddressType = "residence" | "work" | "mailing"

const ApplicationForm = ({ isEditable }: Props) => {
  const [errorAlert, setErrorAlert] = useState(false)

  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { register, watch, control, handleSubmit, errors, setValue, clearErrors } = useForm()

  const mailingAddressValue: boolean = watch("application.sendMailToMailingAddress")
  const workInRegionValue: "yes" | "no" = watch("application.applicant.workInRegion")
  const phoneValue: string = watch("application.phoneNumber")
  const alternatePhoneValue: string = watch("application.alternateContactPhone")
  const additionalPhoneValue: string = watch("application.additionalPhoneNumber")
  const incomePeriodValue: string = watch("application.incomePeriod")

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

  // reset alternate phone type field when phone is empty
  useEffect(() => {
    const fieldKey = "application.alternateContact.phoneNumberType"
    if (!alternatePhoneValue?.length) {
      setValue(fieldKey, "")
      clearErrors(fieldKey)
    }
  }, [setValue, clearErrors, alternatePhoneValue])

  const onSubmit = (data) => {
    setErrorAlert(false)

    const noPhone = data?.application?.phoneNumber?.length ? false : true
    const noEmail = data?.application?.applicant?.emailAddress?.length ? false : true

    const response = {
      noPhone,
      noEmail,
    }

    console.log("Submit SUCCESS", response, data)
  }

  const onError = (error) => {
    setErrorAlert(true)
    console.log("Submit ERROR", error)
  }

  const contactPreferencesOptions = contactPreferencesKeys?.map((item) => item.id)
  const altContactRelationshipOptions = ["", ...altContactRelationshipKeys]
  const howDidYouHearOptions = useMemo(() => {
    return howDidYouHear?.map((item) => ({
      id: item.id,
      label: t(`application.review.demographics.howDidYouHearOptions.${item.id}`),
      register,
    }))
  }, [register])

  const ApplicationAddress = useCallback(
    (subtitle: string, dataKey: string, type: AddressType) => {
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

          {type === "residence" && (
            <GridCell span={2}>
              <Field
                id="application.sendMailToMailingAddress"
                name="application.sendMailToMailingAddress"
                type="checkbox"
                label={t("application.contact.sendMailToMailingAddress")}
                register={register}
              />
            </GridCell>
          )}
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
                      <Select
                        id="contactPreferences"
                        name="contactPreferences"
                        label={t("application.contact.preferredContactType")}
                        labelClassName="sr-only"
                        register={register}
                        controlClassName="control"
                        options={contactPreferencesOptions}
                        keyPrefix="application.form.options.contact"
                      />
                    </ViewItem>
                  </GridCell>

                  <GridCell>
                    <ViewItem label={t("application.add.workInRegion")}>
                      <div className="flex h-12 items-center">
                        <Field
                          id="application.applicant.workInRegionYes"
                          name="application.applicant.workInRegion"
                          className="m-0"
                          type="radio"
                          label={t("t.yes")}
                          register={register}
                          inputProps={{
                            value: "yes",
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
                            value: "no",
                          }}
                        />
                      </div>
                    </ViewItem>
                  </GridCell>
                </GridSection>

                {ApplicationAddress(
                  t("application.details.residenceAddress"),
                  "application.applicant.address",
                  "residence"
                )}

                {mailingAddressValue &&
                  ApplicationAddress(
                    t("application.contact.mailingAddress"),
                    "application.mailingAddress",
                    "mailing"
                  )}

                {workInRegionValue === "yes" &&
                  ApplicationAddress(
                    t("application.contact.workAddress"),
                    "application.applicant.workAddress",
                    "work"
                  )}
              </GridSection>

              <GridSection
                title={t("application.alternateContact.type.label")}
                columns={3}
                separator
              >
                <GridCell>
                  <ViewItem label={t("application.name.firstName")}>
                    <Field
                      id="application.alternateContact.firstName"
                      name="application.alternateContact.firstName"
                      label={t("application.name.firstName")}
                      placeholder={t("application.name.firstName")}
                      register={register}
                      readerOnly
                    />
                  </ViewItem>
                </GridCell>

                <GridCell>
                  <ViewItem label={t("application.name.lastName")}>
                    <Field
                      id="application.alternateContact.lastName"
                      name="application.alternateContact.lastName"
                      placeholder={t("application.name.lastName")}
                      register={register}
                      label={t("application.name.lastName")}
                      readerOnly
                    />
                  </ViewItem>
                </GridCell>

                <GridCell>
                  <ViewItem label={t("t.relationship")}>
                    <Select
                      id="application.alternateContact.relationship"
                      name="application.alternateContact.relationship"
                      label={t("t.relationship")}
                      labelClassName="sr-only"
                      register={register}
                      controlClassName="control"
                      options={altContactRelationshipOptions}
                      keyPrefix="application.alternateContact.type.options"
                    />
                  </ViewItem>
                </GridCell>

                <GridCell>
                  <ViewItem label={t("application.details.agency")}>
                    <Field
                      id="application.alternateContact.agency"
                      name="application.alternateContact.agency"
                      label={t("application.details.agency")}
                      placeholder={t(
                        "application.alternateContact.name.caseManagerAgencyFormPlaceHolder"
                      )}
                      register={register}
                      readerOnly
                    />
                  </ViewItem>
                </GridCell>

                <GridCell>
                  <ViewItem label={t("t.email")}>
                    <Field
                      id="application.alternateContact.emailAddress"
                      name="application.alternateContact.emailAddress"
                      type="email"
                      placeholder="example@web.com"
                      label={t("t.email")}
                      validation={{ pattern: emailRegex }}
                      error={errors.application?.alternateContact?.emailAddress}
                      errorMessage={t("application.name.emailAddressError")}
                      register={register}
                      readerOnly
                    />
                  </ViewItem>
                </GridCell>

                <GridCell>
                  <ViewItem label={t("t.phone")}>
                    <PhoneField
                      id="application.alternateContactPhone"
                      name="application.alternateContactPhone"
                      required={false}
                      error={errors.application?.alternateContactPhone}
                      errorMessage={t("application.contact.phoneNumberError")}
                      control={control}
                      controlClassName="control"
                      label={t("t.phone")}
                      readerOnly
                    />
                  </ViewItem>
                </GridCell>
              </GridSection>

              <GridSection title={t("application.review.householdDetails")} columns={1} separator>
                <GridCell>
                  <ViewItem label={t("application.details.adaPriorities")}>
                    <fieldset className="mt-4">
                      <Field
                        id="application.accessibility.mobility"
                        name="application.accessibility.mobility"
                        type="checkbox"
                        label={t("application.add.mobility")}
                        register={register}
                      />

                      <Field
                        id="application.accessibility.vision"
                        name="application.accessibility.vision"
                        type="checkbox"
                        label={t("application.add.vision")}
                        register={register}
                      />

                      <Field
                        id="application.accessibility.hearing"
                        name="application.accessibility.hearing"
                        type="checkbox"
                        label={t("application.add.hearing")}
                        register={register}
                      />
                    </fieldset>
                  </ViewItem>
                </GridCell>
              </GridSection>

              <GridSection title={t("application.details.preferences")} columns={1} separator>
                <GridCell>
                  <ViewItem
                    label={`${t("application.details.liveOrWorkIn")} ${t(
                      "application.details.countyName"
                    )}`}
                  >
                    <fieldset className="mt-4">
                      <Field
                        id="application.preferences.liveIn"
                        name="application.preferences.liveIn"
                        type="checkbox"
                        label={`${t("application.add.preferences.liveIn")} ${t(
                          "application.details.countyName"
                        )}`}
                        register={register}
                        inputProps={{
                          onChange: () => {
                            setValue("application.preferences.none", false)
                          },
                        }}
                      />

                      <Field
                        id="application.preferences.workIn"
                        name="application.preferences.workIn"
                        type="checkbox"
                        label={`${t("application.add.preferences.workIn")} ${t(
                          "application.details.countyName"
                        )}`}
                        register={register}
                        inputProps={{
                          onChange: () => {
                            setValue("application.preferences.none", false)
                          },
                        }}
                      />

                      <Field
                        id="application.preferences.none"
                        name="application.preferences.none"
                        type="checkbox"
                        label={t("application.add.preferences.optedOut")}
                        register={register}
                        inputProps={{
                          onChange: () => {
                            setValue("application.preferences.liveIn", false)
                            setValue("application.preferences.workIn", false)
                          },
                        }}
                      />
                    </fieldset>
                  </ViewItem>
                </GridCell>
              </GridSection>

              <GridSection title={t("application.details.householdIncome")} grid={false} separator>
                <GridSection columns={3}>
                  <GridCell>
                    <ViewItem label={t("application.add.incomePeriod")}>
                      <div className="flex h-12 items-center">
                        <Field
                          id="application.incomePeriodYear"
                          name="application.incomePeriod"
                          className="m-0"
                          type="radio"
                          label={t("application.financial.income.perYear")}
                          register={register}
                          inputProps={{
                            value: "perYear",
                            onChange: () => {
                              setValue("application.incomeMonth", "")
                              setValue("application.incomeYear", "")
                            },
                          }}
                        />

                        <Field
                          id="application.incomePeriodMonth"
                          name="application.incomePeriod"
                          className="m-0"
                          type="radio"
                          label={t("application.financial.income.perMonth")}
                          register={register}
                          inputProps={{
                            value: "perMonth",
                            onChange: () => {
                              setValue("application.incomeMonth", "")
                              setValue("application.incomeYear", "")
                            },
                          }}
                        />
                      </div>
                    </ViewItem>
                  </GridCell>
                </GridSection>

                <GridSection columns={3}>
                  <GridCell>
                    <ViewItem label={t("application.details.annualIncome")}>
                      <Field
                        id="application.incomeMonth"
                        type="number"
                        name="application.incomeMonth"
                        label={t("application.details.annualIncome")}
                        placeholder={t("t.enterAmount")}
                        register={register}
                        disabled={incomePeriodValue !== "perYear"}
                        readerOnly
                      />
                    </ViewItem>
                  </GridCell>

                  <GridCell>
                    <ViewItem label={t("application.details.monthlyIncome")}>
                      <Field
                        id="application.incomeYear"
                        type="number"
                        name="application.incomeYear"
                        label={t("application.details.annualIncome")}
                        placeholder={t("t.enterAmount")}
                        register={register}
                        disabled={incomePeriodValue !== "perMonth"}
                        readerOnly
                      />
                    </ViewItem>
                  </GridCell>

                  <GridCell>
                    <ViewItem label={t("application.details.vouchers")}>
                      <Select
                        id="application.incomeVouchers"
                        name="application.incomeVouchers"
                        placeholder={t("application.form.general.defaultSelectPlaceholder")}
                        label={t("application.details.vouchers")}
                        labelClassName="sr-only"
                        register={register}
                        controlClassName="control"
                        options={["yes", "no"]}
                        keyPrefix="t"
                      />
                    </ViewItem>
                  </GridCell>
                </GridSection>
              </GridSection>

              <GridSection
                title={t("application.add.demographicsInformation")}
                columns={3}
                separator
              >
                <GridCell>
                  <ViewItem label={t("application.add.ethnicity")}>
                    <Select
                      id="application.demographics.ethnicity"
                      name="application.demographics.ethnicity"
                      placeholder={t("application.form.general.defaultSelectPlaceholder")}
                      label={t("application.add.ethnicity")}
                      labelClassName="sr-only"
                      register={register}
                      controlClassName="control"
                      options={ethnicityKeys}
                      keyPrefix="application.review.demographics.ethnicityOptions"
                    />
                  </ViewItem>
                </GridCell>

                <GridCell>
                  <ViewItem label={t("application.add.race")}>
                    <Select
                      id="application.demographics.race"
                      name="application.demographics.race"
                      placeholder={t("application.form.general.defaultSelectPlaceholder")}
                      label={t("application.add.race")}
                      labelClassName="sr-only"
                      register={register}
                      controlClassName="control"
                      options={raceKeys}
                      keyPrefix="application.review.demographics.raceOptions"
                    />
                  </ViewItem>
                </GridCell>

                <GridCell>
                  <ViewItem label={t("application.add.gender")}>
                    <Select
                      id="application.demographics.gender"
                      name="application.demographics.gender"
                      placeholder={t("application.form.general.defaultSelectPlaceholder")}
                      label={t("application.add.gender")}
                      labelClassName="sr-only"
                      register={register}
                      controlClassName="control"
                      options={genderKeys}
                      keyPrefix="application.review.demographics.genderOptions"
                    />
                  </ViewItem>
                </GridCell>

                <GridCell>
                  <ViewItem label={t("application.add.sexualOrientation")}>
                    <Select
                      id="application.demographics.sexualOrientation"
                      name="application.demographics.sexualOrientation"
                      placeholder={t("application.form.general.defaultSelectPlaceholder")}
                      label={t("application.add.sexualOrientation")}
                      labelClassName="sr-only"
                      register={register}
                      controlClassName="control"
                      options={sexualOrientation}
                      keyPrefix="application.review.demographics.sexualOrientationOptions"
                    />
                  </ViewItem>
                </GridCell>

                <GridCell span={2}>
                  <ViewItem label={t("application.add.howDidYouHearAboutUs")}>
                    <FieldGroup
                      type="checkbox"
                      name="application.demographics.howDidYouHear"
                      fields={howDidYouHearOptions}
                      register={register}
                      fieldGroupClassName="grid grid-cols-2 mt-4"
                    />
                  </ViewItem>
                </GridCell>
              </GridSection>

              <GridSection title={t("application.review.terms.title")} separator>
                <GridCell>
                  <ViewItem label={t("application.details.signatureOnTerms")}>
                    <div className="flex h-12 items-center">
                      <Field
                        id="application.acceptedTermsYes"
                        name="application.acceptedTerms"
                        className="m-0"
                        type="radio"
                        label={t("t.yes")}
                        register={register}
                        inputProps={{
                          value: "yes",
                        }}
                      />

                      <Field
                        id="application.acceptedTermsNo"
                        name="application.acceptedTerms"
                        className="m-0"
                        type="radio"
                        label={t("t.no")}
                        register={register}
                        inputProps={{
                          value: "no",
                        }}
                      />
                    </div>
                  </ViewItem>
                </GridCell>
              </GridSection>
            </div>

            <aside className="md:w-3/12 md:pl-6">
              <StatusAside
                columns={1}
                actions={[
                  <GridCell>
                    <Button
                      type={AppearanceStyleType.primary}
                      fullWidth
                      onClick={() => {
                        //
                      }}
                    >
                      Submit
                    </Button>
                  </GridCell>,
                  <GridCell>
                    <Button
                      type={AppearanceStyleType.secondary}
                      fullWidth
                      onClick={() => {
                        //
                      }}
                    >
                      Submit &amp; New
                    </Button>
                  </GridCell>,
                  <GridCell className="flex">
                    <LinkButton unstyled fullWidth className="bg-opacity-0" href="/applications">
                      Cancel
                    </LinkButton>
                  </GridCell>,
                ]}
              >
                <StatusMessages lastTimestamp="Whatever" />
              </StatusAside>
            </aside>
          </div>
        </Form>
      </section>
    </>
  )
}

export default ApplicationForm
