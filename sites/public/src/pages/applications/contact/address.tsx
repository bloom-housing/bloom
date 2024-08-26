import React, { useContext, useEffect, useState, useMemo } from "react"
import { useForm } from "react-hook-form"
import { Alert, FormErrorMessage } from "@bloom-housing/ui-seeds"
import {
  Field,
  FieldGroup,
  Form,
  mergeDeep,
  PhoneField,
  Select,
  t,
} from "@bloom-housing/ui-components"
import { CardSection } from "@bloom-housing/ui-seeds/src/blocks/Card"
import {
  contactPreferencesKeys,
  phoneNumberKeys,
  stateKeys,
  blankApplication,
  OnClientSide,
  PageView,
  pushGtmEvent,
  AuthContext,
} from "@bloom-housing/shared-helpers"
import FormsLayout from "../../../layouts/forms"
import { disableContactFormOption } from "../../../lib/helpers"
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
  const clientLoaded = OnClientSide()

  const contactPreferencesOptions = contactPreferencesKeys?.map((item) => ({
    id: item.id,
    label: t(`t.${item.id}`),
    defaultChecked: application?.contactPreferences?.includes(item.id) || false,
    disabled: disableContactFormOption(item.id, noPhone, application.applicant.noEmail),
  }))

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

            <CardSection divider={"inset"}>
              <fieldset>
                <legend
                  className={`text__caps-spaced ${errors?.contactPreferences ? "text-alert" : ""}`}
                >
                  {t("application.contact.contactPreference")}
                </legend>
                <FieldGroup
                  name="contactPreferences"
                  fields={contactPreferencesOptions}
                  type="checkbox"
                  validation={{ required: true }}
                  error={errors?.contactPreferences}
                  errorMessage={t("errors.selectAtLeastOne")}
                  register={register}
                  dataTestId={"app-primary-contact-preference"}
                />
              </fieldset>
            </CardSection>
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
