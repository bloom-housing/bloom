import React, { useContext, useEffect, useState, useMemo } from "react"
import { useForm } from "react-hook-form"
import { Alert, FormErrorMessage } from "@bloom-housing/ui-seeds"
import { Field, Form, PhoneField, Select, t } from "@bloom-housing/ui-components"
import { CardSection } from "@bloom-housing/ui-seeds/src/blocks/Card"
import {
  phoneNumberKeys,
  stateKeys,
  blankApplication,
  OnClientSide,
  PageView,
  pushGtmEvent,
  AuthContext,
  mergeDeep,
} from "@bloom-housing/shared-helpers"
import { FeatureFlagEnum } from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import FormsLayout from "../../../layouts/forms"
import { isFeatureFlagOn } from "../../../lib/helpers"
import { useFormConductor } from "../../../lib/hooks"
import {
  FoundAddress,
  findValidatedAddress,
  AddressValidationSelection,
} from "../../../components/applications/ValidateAddress"
import { UserStatus } from "../../../lib/constants"
import ApplicationFormLayout from "../../../layouts/application-form"
import styles from "../../../layouts/application-form.module.scss"

const ApplicationAddress = () => {
  const { profile } = useContext(AuthContext)
  const [verifyAddress, setVerifyAddress] = useState(false)
  const [foundAddress, setFoundAddress] = useState<FoundAddress>({})
  const [newAddressSelected, setNewAddressSelected] = useState(true)

  const { conductor, application, listing } = useFormConductor("primaryApplicantAddress")
  const currentPageSection = 1

  const enableFullTimeStudentQuestion = isFeatureFlagOn(
    conductor.config,
    FeatureFlagEnum.enableFullTimeStudentQuestion
  )
  const disableWorkInRegion = isFeatureFlagOn(conductor.config, FeatureFlagEnum.disableWorkInRegion)

  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { control, register, handleSubmit, setValue, watch, errors, trigger } = useForm<
    Record<string, any>
  >({
    defaultValues: {
      "applicant.phoneNumber": application.applicant.phoneNumber,
      "applicant.noPhone": application.applicant.noPhone,
      additionalPhone: application.additionalPhone,
      "applicant.phoneNumberType": application.applicant.phoneNumberType,
      sendMailToMailingAddress: application.sendMailToMailingAddress,
      ...(!disableWorkInRegion && {
        "applicant.workInRegion": application.applicant.workInRegion,
      }),
      ...(enableFullTimeStudentQuestion && {
        "applicant.fullTimeStudent": application.applicant.fullTimeStudent,
      }),
      "applicant.applicantAddress.state": application.applicant.applicantAddress.state,
    },
    shouldFocusError: false,
  })
  const onSubmit = async (data) => {
    const validation = await trigger()
    if (!validation) return

    if (!verifyAddress) {
      setFoundAddress({})
      setVerifyAddress(true)
      findValidatedAddress(data.applicant.applicantAddress, setFoundAddress, setNewAddressSelected)

      return // Skip rest of the submit process
    }

    mergeDeep(application, data)
    if (newAddressSelected && foundAddress.newAddress) {
      application.applicant.applicantAddress.street = foundAddress.newAddress.street
      application.applicant.applicantAddress.street2 = foundAddress.newAddress.street2
      application.applicant.applicantAddress.city = foundAddress.newAddress.city
      application.applicant.applicantAddress.zipCode = foundAddress.newAddress.zipCode
      application.applicant.applicantAddress.state = foundAddress.newAddress.state
      application.applicant.applicantAddress.longitude = foundAddress.newAddress.longitude
      application.applicant.applicantAddress.latitude = foundAddress.newAddress.latitude
    }

    if (application.applicant.noPhone) {
      application.applicant.phoneNumber = ""
      application.applicant.phoneNumberType = ""
    }
    if (!application.additionalPhone) {
      application.additionalPhoneNumber = ""
      application.additionalPhoneNumberType = ""
    }
    if (!application.sendMailToMailingAddress) {
      application.applicationsMailingAddress = blankApplication.applicationsMailingAddress
    }

    if (!application.applicant.workInRegion) {
      application.applicant.applicantWorkAddress = blankApplication.applicant.applicantAddress
    }

    conductor.sync()

    conductor.routeToNextOrReturnUrl()
  }
  const onError = () => {
    window.scrollTo(0, 0)
  }

  const noPhone: boolean = watch("applicant.noPhone")
  const phoneNumber: string = watch("applicant.phoneNumber")
  const phonePresent = () => {
    return phoneNumber && phoneNumber.replace(/[()\-_ ]/g, "").length > 0
  }
  const additionalPhone = watch("additionalPhone")
  const sendMailToMailingAddress = watch("sendMailToMailingAddress")
  const workInRegion = watch("applicant.workInRegion")
  const clientLoaded = OnClientSide()

  useEffect(() => {
    pushGtmEvent<PageView>({
      event: "pageView",
      pageTitle: "Application - Contact Address",
      status: profile ? UserStatus.LoggedIn : UserStatus.NotLoggedIn,
    })
  }, [profile])

  const backUrl = useMemo(() => {
    return verifyAddress ? window.location.pathname : conductor.determinePreviousUrl()
  }, [verifyAddress, conductor])

  return (
    <FormsLayout>
      <Form id="applications-address" onSubmit={handleSubmit(onSubmit, onError)}>
        <ApplicationFormLayout
          listingName={listing?.name}
          heading={
            verifyAddress
              ? foundAddress.invalid
                ? t("application.contact.couldntLocateAddress")
                : t("application.contact.verifyAddressTitle")
              : t("application.contact.title", { firstName: application.applicant.firstName })
          }
          progressNavProps={{
            currentPageSection: currentPageSection,
            completedSections: application.completedSections,
            labels: conductor.config.sections.map((label) => t(`t.${label}`)),
            mounted: OnClientSide(),
          }}
          backLink={{
            url: backUrl,
            onClickFxn: verifyAddress
              ? () => {
                  setVerifyAddress(false)
                }
              : undefined,
          }}
          conductor={conductor}
        >
          {Object.entries(errors).length > 0 && (
            <Alert
              className={styles["message-inside-card"]}
              variant="alert"
              fullwidth
              id={"application-alert-box"}
            >
              {t("errors.errorsToResolve")}
            </Alert>
          )}
          <div style={{ display: verifyAddress ? "none" : "block" }}>
            <CardSection divider={"inset"}>
              <fieldset>
                <legend className={"text__caps-spaced"}>
                  {t("application.contact.yourPhoneNumber")}
                </legend>
                <PhoneField
                  label={t("application.contact.number")}
                  required={true}
                  id="applicant.phoneNumber"
                  name="applicant.phoneNumber"
                  error={!noPhone ? errors.applicant?.phoneNumber : false}
                  errorMessage={t("errors.phoneNumberError")}
                  controlClassName="control"
                  control={control}
                  defaultValue={application.applicant.phoneNumber}
                  disabled={clientLoaded && noPhone}
                  dataTestId={"app-primary-phone-number"}
                  subNote={t("application.contact.number.subNote")}
                />
                <Select
                  id="applicant.phoneNumberType"
                  name="applicant.phoneNumberType"
                  placeholder={t("t.selectOne")}
                  label={t("application.contact.phoneNumberTypes.prompt")}
                  disabled={clientLoaded && noPhone}
                  validation={{ required: !noPhone }}
                  defaultValue={application.applicant.phoneNumberType}
                  error={!noPhone && errors.applicant?.phoneNumberType}
                  errorMessage={t("errors.phoneNumberTypeError")}
                  register={register}
                  controlClassName="control"
                  options={phoneNumberKeys}
                  keyPrefix="application.contact.phoneNumberTypes"
                  dataTestId={"app-primary-phone-number-type"}
                />

                <Field
                  type="checkbox"
                  id="noPhone"
                  name="applicant.noPhone"
                  label={t("application.contact.noPhoneNumber")}
                  primary={true}
                  register={register}
                  disabled={clientLoaded && phonePresent()}
                  inputProps={{
                    defaultChecked: application.applicant.noPhone,
                    onChange: (e) => {
                      if (e.target.checked) {
                        setValue("applicant.phoneNumberType", "")
                        setValue("additionalPhone", "")
                        setValue("additionalPhoneNumber", "")
                        setValue("additionalPhoneNumberType", "")
                      }
                    },
                  }}
                  dataTestId={"app-primary-no-phone"}
                  className={"mb-2"}
                />

                <Field
                  type="checkbox"
                  id="additionalPhone"
                  name="additionalPhone"
                  label={t("application.contact.additionalPhoneNumber")}
                  disabled={clientLoaded && noPhone}
                  primary={true}
                  register={register}
                  inputProps={{
                    defaultChecked: application.additionalPhone,
                    onChange: (e) => {
                      if (e.target.checked) {
                        setValue("additionalPhoneNumber", "")
                        setValue("additionalPhoneNumberType", "")
                      }
                    },
                  }}
                  dataTestId={"app-primary-additional-phone"}
                />

                {additionalPhone && (
                  <>
                    <PhoneField
                      id="additionalPhoneNumber"
                      name="additionalPhoneNumber"
                      label={t("application.contact.secondNumber")}
                      required={true}
                      error={errors.additionalPhoneNumber}
                      errorMessage={t("errors.phoneNumberError")}
                      control={control}
                      defaultValue={application.additionalPhoneNumber}
                      controlClassName="control"
                      dataTestId={"app-primary-additional-phone-number"}
                      subNote={t("application.contact.number.subNote")}
                    />
                    <Select
                      id="additionalPhoneNumberType"
                      name="additionalPhoneNumberType"
                      defaultValue={application.additionalPhoneNumberType}
                      validation={{ required: true }}
                      error={errors?.additionalPhoneNumberType}
                      errorMessage={t("errors.phoneNumberTypeError")}
                      register={register}
                      controlClassName="control"
                      label={t("application.contact.phoneNumberTypes.prompt")}
                      options={phoneNumberKeys}
                      keyPrefix="application.contact.phoneNumberTypes"
                      dataTestId={"app-primary-additional-phone-number-type"}
                    />
                  </>
                )}
              </fieldset>
            </CardSection>
            <CardSection divider={"inset"}>
              <fieldset>
                <legend
                  className={`text__caps-spaced ${errors.applicant?.address ? "text-alert" : ""}`}
                >
                  {t("application.contact.yourAddress")}
                </legend>

                <p className="field-note mb-4">
                  {t("application.contact.addressWhereYouCurrentlyLive")}
                </p>

                <Field
                  id="addressStreet"
                  name="applicant.applicantAddress.street"
                  label={t("application.contact.streetAddress")}
                  defaultValue={application.applicant.applicantAddress.street}
                  validation={{ required: true, maxLength: 64 }}
                  errorMessage={
                    errors.applicant?.address?.street?.type === "maxLength"
                      ? t("errors.maxLength", { length: 64 })
                      : t("errors.streetError")
                  }
                  error={errors.applicant?.applicantAddress?.street}
                  register={register}
                  dataTestId={"app-primary-address-street"}
                />

                <Field
                  id="addressStreet2"
                  name="applicant.applicantAddress.street2"
                  label={t("application.contact.apt")}
                  defaultValue={application.applicant.applicantAddress.street2}
                  register={register}
                  dataTestId={"app-primary-address-street2"}
                  error={errors.applicant?.applicantAddress?.street2}
                  validation={{ maxLength: 64 }}
                  errorMessage={t("errors.maxLength", { length: 64 })}
                />

                <div className="flex max-w-2xl">
                  <Field
                    id="addressCity"
                    name="applicant.applicantAddress.city"
                    label={t("application.contact.cityName")}
                    defaultValue={application.applicant.applicantAddress.city}
                    validation={{ required: true, maxLength: 64 }}
                    errorMessage={
                      errors.applicant?.address?.city?.type === "maxLength"
                        ? t("errors.maxLength", { length: 64 })
                        : t("errors.cityError")
                    }
                    error={errors.applicant?.applicantAddress?.city}
                    register={register}
                    dataTestId={"app-primary-address-city"}
                  />

                  <Select
                    id="addressState"
                    name="applicant.applicantAddress.state"
                    label={t("application.contact.state")}
                    validation={{ required: true, maxLength: 64 }}
                    error={errors.applicant?.applicantAddress?.state}
                    errorMessage={
                      errors.applicant?.applicantAddress?.state?.type === "maxLength"
                        ? t("errors.maxLength", { length: 64 })
                        : t("errors.stateError")
                    }
                    register={register}
                    controlClassName="control"
                    options={stateKeys}
                    keyPrefix="states"
                    dataTestId={"app-primary-address-state"}
                  />
                </div>
                <Field
                  id="addressZipCode"
                  name="applicant.applicantAddress.zipCode"
                  label={t("application.contact.zip")}
                  defaultValue={application.applicant.applicantAddress.zipCode}
                  validation={{ required: true, maxLength: 10 }}
                  errorMessage={
                    errors.applicant?.applicantAddress?.zipCode?.type === "maxLength"
                      ? t("errors.maxLength", { length: 10 })
                      : t("errors.zipCodeError")
                  }
                  error={errors.applicant?.applicantAddress?.zipCode}
                  register={register}
                  dataTestId={"app-primary-address-zip"}
                />
                <Field
                  type="checkbox"
                  id="sendMailToMailingAddress"
                  name="sendMailToMailingAddress"
                  label={t("application.contact.sendMailToMailingAddress")}
                  primary={true}
                  register={register}
                  inputProps={{
                    defaultChecked: application.sendMailToMailingAddress,
                  }}
                  dataTestId={"app-primary-send-to-mailing"}
                />
              </fieldset>
            </CardSection>

            {clientLoaded && (sendMailToMailingAddress || application.sendMailToMailingAddress) && (
              <CardSection divider={"inset"}>
                <fieldset>
                  <legend className="text__caps-spaced">
                    {t("application.contact.mailingAddress")}
                  </legend>

                  <p className="field-note mb-4">
                    {t("application.contact.provideAMailingAddress")}
                  </p>

                  <Field
                    id="mailingAddressStreet"
                    name="applicationsMailingAddress.street"
                    defaultValue={application.applicationsMailingAddress.street}
                    label={t("application.contact.streetAddress")}
                    validation={{ required: true, maxLength: 64 }}
                    error={errors.applicationsMailingAddress?.street}
                    errorMessage={
                      errors.applicationsMailingAddress?.street?.type === "maxLength"
                        ? t("errors.maxLength", { length: 64 })
                        : t("errors.streetError")
                    }
                    register={register}
                    dataTestId={"app-primary-mailing-address-street"}
                  />

                  <Field
                    id="mailingAddressStreet2"
                    name="applicationsMailingAddress.street2"
                    label={t("application.contact.apt")}
                    defaultValue={application.applicationsMailingAddress.street2}
                    register={register}
                    dataTestId={"app-primary-mailing-address-street2"}
                    validation={{ maxLength: 64 }}
                    error={errors.applicationsMailingAddress?.street2}
                    errorMessage={t("errors.maxLength", { length: 64 })}
                  />

                  <div className="flex max-w-2xl">
                    <Field
                      id="mailingAddressCity"
                      name="applicationsMailingAddress.city"
                      label={t("application.contact.city")}
                      defaultValue={application.applicationsMailingAddress.city}
                      validation={{ required: true, maxLength: 64 }}
                      error={errors.applicationsMailingAddress?.city}
                      errorMessage={
                        errors.applicationsMailingAddress?.city?.type === "maxLength"
                          ? t("errors.maxLength", { length: 64 })
                          : t("errors.cityError")
                      }
                      register={register}
                      dataTestId={"app-primary-mailing-address-city"}
                    />

                    <Select
                      id="mailingAddressState"
                      name="applicationsMailingAddress.state"
                      label={t("application.contact.state")}
                      defaultValue={application.applicationsMailingAddress.state}
                      validation={{ required: true, maxLength: 64 }}
                      errorMessage={
                        errors.applicationsMailingAddress?.state?.type === "maxLength"
                          ? t("errors.maxLength", { length: 64 })
                          : t("errors.stateError")
                      }
                      error={errors.applicationsMailingAddress?.state}
                      register={register}
                      controlClassName="control"
                      options={stateKeys}
                      keyPrefix="states"
                      dataTestId={"app-primary-mailing-address-state"}
                    />
                  </div>

                  <Field
                    id="mailingAddressZipCode"
                    name="applicationsMailingAddress.zipCode"
                    label={t("application.contact.zip")}
                    defaultValue={application.applicationsMailingAddress.zipCode}
                    validation={{ required: true, maxLength: 10 }}
                    error={errors.applicationsMailingAddress?.zipCode}
                    errorMessage={
                      errors.applicationsMailingAddress?.zipCode?.type === "maxLength"
                        ? t("errors.maxLength", { length: 10 })
                        : t("errors.zipCodeError")
                    }
                    register={register}
                    dataTestId={"app-primary-mailing-address-zip"}
                  />
                </fieldset>
              </CardSection>
            )}

            {!disableWorkInRegion && (
              <CardSection
                divider={"inset"}
                className={enableFullTimeStudentQuestion ? "" : "border-none"}
              >
                <fieldset>
                  <legend
                    className={`text__caps-spaced ${
                      errors?.applicant?.workInRegion ? "text-alert" : ""
                    }`}
                  >
                    {t("application.contact.doYouWorkIn", {
                      county:
                        listing?.listingsBuildingAddress?.county || listing?.jurisdictions?.name,
                    })}
                  </legend>

                  <p className="field-note mb-4">
                    {t("application.contact.doYouWorkInDescription")}
                  </p>

                  <Field
                    className="mb-1"
                    type="radio"
                    id="workInRegionYes"
                    name="applicant.workInRegion"
                    label={t("t.yes")}
                    register={register}
                    validation={{ required: true }}
                    error={errors?.applicant?.workInRegion}
                    inputProps={{
                      value: "yes",
                      defaultChecked: application.applicant.workInRegion == "yes",
                    }}
                    dataTestId={"app-primary-work-in-region-yes"}
                  />

                  <Field
                    className="mb-1"
                    type="radio"
                    id="workInRegionNo"
                    name="applicant.workInRegion"
                    label={t("t.no")}
                    register={register}
                    validation={{ required: true }}
                    error={errors?.applicant?.workInRegion}
                    inputProps={{
                      value: "no",
                      defaultChecked: application.applicant.workInRegion == "no",
                    }}
                    dataTestId={"app-primary-work-in-region-no"}
                  />
                  {errors?.applicant?.workInRegion && (
                    <FormErrorMessage id="applicant.workInRegion-error">
                      {t("errors.selectOption")}
                    </FormErrorMessage>
                  )}
                </fieldset>

                {(workInRegion == "yes" ||
                  (!workInRegion && application.applicant.workInRegion == "yes")) && (
                  <div className="form-card__group mx-0 px-0 mt-2">
                    <fieldset>
                      <legend className="text__caps-spaced">
                        {t("application.contact.workAddress")}
                      </legend>

                      <Field
                        id="applicantWorkAddressStreet"
                        name="applicant.applicantWorkAddress.street"
                        defaultValue={application.applicant.applicantWorkAddress.street}
                        validation={{ required: true, maxLength: 64 }}
                        error={errors.applicant?.applicantWorkAddress?.street}
                        errorMessage={
                          errors.applicant?.applicantWorkAddress?.street?.type === "maxLength"
                            ? t("errors.maxLength", { length: 64 })
                            : t("errors.streetError")
                        }
                        register={register}
                        dataTestId={"app-primary-work-address-street"}
                        label={t("application.contact.streetAddress")}
                      />

                      <Field
                        id="applicantWorkAddressStreet2"
                        name="applicant.applicantWorkAddress.street2"
                        label={t("application.contact.apt")}
                        defaultValue={application.applicant.applicantWorkAddress.street2}
                        register={register}
                        error={errors.applicant?.applicantWorkAddress?.street2}
                        validation={{ maxLength: 64 }}
                        errorMessage={"errors.maxLength"}
                        dataTestId={"app-primary-work-address-street2"}
                      />

                      <div className="flex max-w-2xl">
                        <Field
                          id="applicantWorkAddressCity"
                          name="applicant.applicantWorkAddress.city"
                          label={t("application.contact.city")}
                          defaultValue={application.applicant.applicantWorkAddress.city}
                          validation={{ required: true, maxLength: 64 }}
                          error={errors.applicant?.applicantWorkAddress?.city}
                          errorMessage={
                            errors.applicant?.applicantWorkAddress?.city?.type === "maxLength"
                              ? t("errors.maxLength", { length: 64 })
                              : t("errors.cityError")
                          }
                          register={register}
                          dataTestId={"app-primary-work-address-city"}
                        />

                        <Select
                          id="applicantWorkAddressState"
                          name="applicant.applicantWorkAddress.state"
                          label={t("application.contact.state")}
                          defaultValue={application.applicant.applicantWorkAddress.state}
                          validation={{ required: true, maxLength: 64 }}
                          error={errors.applicant?.applicantWorkAddress?.state}
                          errorMessage={
                            errors.applicant?.applicantWorkAddress?.state?.type === "maxLength"
                              ? t("errors.maxLength", { length: 64 })
                              : t("errors.stateError")
                          }
                          register={register}
                          controlClassName="control"
                          options={stateKeys}
                          keyPrefix="states"
                          dataTestId={"app-primary-work-address-state"}
                        />
                      </div>

                      <Field
                        id="applicantWorkAddressZipCode"
                        name="applicant.applicantWorkAddress.zipCode"
                        label={t("application.contact.zip")}
                        defaultValue={application.applicant.applicantWorkAddress.zipCode}
                        validation={{ required: true, maxLength: 10 }}
                        error={errors.applicant?.applicantWorkAddress?.zipCode}
                        errorMessage={
                          errors.applicant?.applicantWorkAddress?.zipCode?.type === "maxLength"
                            ? t("errors.maxLength", { length: 10 })
                            : t("errors.zipCodeError")
                        }
                        register={register}
                        dataTestId={"app-primary-work-address-zip"}
                      />
                    </fieldset>
                  </div>
                )}
              </CardSection>
            )}
            {enableFullTimeStudentQuestion && (
              <CardSection>
                <fieldset>
                  <legend
                    className={`text__caps-spaced ${
                      errors?.applicant?.fullTimeStudent ? "text-alert" : ""
                    }`}
                  >
                    {t("application.contact.fullTimeStudent")}
                  </legend>

                  <Field
                    className="mb-1"
                    type="radio"
                    id="fullTimeStudentYes"
                    name="applicant.fullTimeStudent"
                    label={t("t.yes")}
                    register={register}
                    validation={{ required: true }}
                    error={errors?.applicant?.fullTimeStudent}
                    inputProps={{
                      value: "yes",
                      defaultChecked: application.applicant.fullTimeStudent == "yes",
                    }}
                    dataTestId={"app-primary-full-time-student-yes"}
                  />

                  <Field
                    className="mb-1"
                    type="radio"
                    id="fullTimeStudentNo"
                    name="applicant.fullTimeStudent"
                    label={t("t.no")}
                    register={register}
                    validation={{ required: true }}
                    error={errors?.applicant?.fullTimeStudent}
                    inputProps={{
                      value: "no",
                      defaultChecked: application.applicant.fullTimeStudent == "no",
                    }}
                    dataTestId={"app-primary-full-time-student-no"}
                  />
                  {errors?.applicant?.fullTimeStudent && (
                    <FormErrorMessage id="applicant.fullTimeStudent-error">
                      {t("errors.selectOption")}
                    </FormErrorMessage>
                  )}
                </fieldset>
              </CardSection>
            )}
          </div>
          <CardSection>
            {verifyAddress && (
              <AddressValidationSelection
                {...{ foundAddress, newAddressSelected, setNewAddressSelected, setVerifyAddress }}
              />
            )}
          </CardSection>
        </ApplicationFormLayout>
      </Form>
    </FormsLayout>
  )
}

export default ApplicationAddress
