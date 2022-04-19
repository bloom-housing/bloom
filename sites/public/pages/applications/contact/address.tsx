/*
1.3 - Contact
Primary applicant contact information
https://github.com/bloom-housing/bloom/issues/256
*/
import {
  AppearanceStyleType,
  AlertBox,
  Button,
  ErrorMessage,
  Field,
  Form,
  FormCard,
  mergeDeep,
  FieldGroup,
  ProgressNav,
  t,
  AuthContext,
} from "@bloom-housing/ui-components"
import FormsLayout from "../../../layouts/forms"
import { useContext, useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { Select } from "@bloom-housing/ui-components/src/forms/Select"
import { PhoneField } from "@bloom-housing/ui-components/src/forms/PhoneField"
import {
  contactPreferencesKeys,
  phoneNumberKeys,
  stateKeys,
  blankApplication,
  OnClientSide,
  PageView,
  pushGtmEvent,
} from "@bloom-housing/shared-helpers"
import FormBackLink from "../../../src/forms/applications/FormBackLink"
import { useFormConductor } from "../../../lib/hooks"
import {
  FoundAddress,
  findValidatedAddress,
  AddressValidationSelection,
} from "../../../src/forms/applications/ValidateAddress"
import { UserStatus } from "../../../lib/constants"

const ApplicationAddress = () => {
  const { profile } = useContext(AuthContext)
  const [verifyAddress, setVerifyAddress] = useState(false)
  const [foundAddress, setFoundAddress] = useState<FoundAddress>({})
  const [newAddressSelected, setNewAddressSelected] = useState(true)

  const { conductor, application, listing } = useFormConductor("primaryApplicantAddress")
  const currentPageSection = 1

  /* Form Handler */
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { control, register, handleSubmit, setValue, watch, errors } = useForm<Record<string, any>>(
    {
      defaultValues: {
        "applicant.phoneNumber": application.applicant.phoneNumber,
        "applicant.noPhone": application.applicant.noPhone,
        additionalPhone: application.additionalPhone,
        "applicant.phoneNumberType": application.applicant.phoneNumberType,
        sendMailToMailingAddress: application.sendMailToMailingAddress,
        "applicant.workInRegion": application.applicant.workInRegion,
        "applicant.address.state": application.applicant.address.state,
      },
      shouldFocusError: false,
    }
  )
  const onSubmit = (data) => {
    if (!verifyAddress) {
      setFoundAddress({})
      setVerifyAddress(true)
      findValidatedAddress(data.applicant.address, setFoundAddress, setNewAddressSelected)

      return // Skip rest of the submit process
    }

    mergeDeep(application, data)

    if (newAddressSelected && foundAddress.newAddress) {
      application.applicant.address.street = foundAddress.newAddress.street
      application.applicant.address.city = foundAddress.newAddress.city
      application.applicant.address.zipCode = foundAddress.newAddress.zipCode
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
      application.mailingAddress = blankApplication.mailingAddress
    }
    if (!application.applicant.workInRegion) {
      application.applicant.workAddress = blankApplication.applicant.workAddress
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
    return phoneNumber.replace(/[()\-_ ]/g, "").length > 0
  }
  const additionalPhone = watch("additionalPhone")
  const sendMailToMailingAddress = watch("sendMailToMailingAddress")
  const workInRegion = watch("applicant.workInRegion")
  const clientLoaded = OnClientSide()

  const contactPreferencesOptions = contactPreferencesKeys?.map((item) => ({
    id: item.id,
    label: t(`t.${item.id}`),
    defaultChecked: application?.contactPreferences?.includes(item.id) || false,
    disabled:
      ((item.id === "phone" || item.id === "text") && noPhone) ||
      (item.id === "email" && application.applicant.noEmail),
  }))

  useEffect(() => {
    pushGtmEvent<PageView>({
      event: "pageView",
      pageTitle: "Application - Contact Address",
      status: profile ? UserStatus.LoggedIn : UserStatus.NotLoggedIn,
    })
  }, [profile])

  return (
    <FormsLayout>
      <FormCard header={listing?.name}>
        <ProgressNav
          currentPageSection={currentPageSection}
          completedSections={application.completedSections}
          labels={conductor.config.sections.map((label) => t(`t.${label}`))}
          mounted={OnClientSide()}
        />
      </FormCard>
      <FormCard>
        <FormBackLink
          url={conductor.determinePreviousUrl()}
          onClick={() => conductor.setNavigatedBack(true)}
        />

        <div className="form-card__lead border-b">
          <h2 className="form-card__title is-borderless">
            {verifyAddress
              ? foundAddress.invalid
                ? t("application.contact.couldntLocateAddress")
                : t("application.contact.verifyAddressTitle")
              : t("application.contact.title", { firstName: application.applicant.firstName })}
          </h2>
        </div>

        {Object.entries(errors).length > 0 && (
          <AlertBox type="alert" inverted closeable>
            {t("errors.errorsToResolve")}
          </AlertBox>
        )}

        <Form id="applications-address" onSubmit={handleSubmit(onSubmit, onError)}>
          <div style={{ display: verifyAddress ? "none" : "block" }}>
            <div className="form-card__group border-b">
              <PhoneField
                label={t("application.contact.yourPhoneNumber")}
                caps={true}
                required={true}
                id="applicant.phoneNumber"
                name="applicant.phoneNumber"
                placeholder={clientLoaded && noPhone ? t("t.none") : null}
                error={!noPhone ? errors.applicant?.phoneNumber : false}
                errorMessage={t("errors.phoneNumberError")}
                controlClassName="control"
                control={control}
                defaultValue={application.applicant.phoneNumber}
                disabled={clientLoaded && noPhone}
                dataTestId={"app-primary-phone-number"}
              />

              <Select
                id="applicant.phoneNumberType"
                name="applicant.phoneNumberType"
                placeholder={t("application.contact.phoneNumberTypes.prompt")}
                label={t("application.contact.phoneNumberTypes.prompt")}
                labelClassName="sr-only"
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
                    label={t("application.contact.yourAdditionalPhoneNumber")}
                    required={true}
                    caps={true}
                    error={errors.additionalPhoneNumber}
                    errorMessage={t("errors.phoneNumberError")}
                    control={control}
                    defaultValue={application.additionalPhoneNumber}
                    controlClassName="control"
                    dataTestId={"app-primary-additional-phone-number"}
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
                    placeholder={t("application.contact.phoneNumberTypes.prompt")}
                    label={t("application.contact.phoneNumberTypes.prompt")}
                    labelClassName={"sr-only"}
                    options={phoneNumberKeys}
                    keyPrefix="application.contact.phoneNumberTypes"
                    dataTestId={"app-primary-additional-phone-number-type"}
                  />
                </>
              )}
            </div>

            <div className="form-card__group border-b">
              <fieldset>
                <legend className="field-label--caps">{t("application.contact.address")}</legend>

                <p className="field-note mb-4">
                  {t("application.contact.addressWhereYouCurrentlyLive")}
                </p>

                <Field
                  id="addressStreet"
                  name="applicant.address.street"
                  label={t("application.contact.streetAddress")}
                  placeholder={t("application.contact.streetAddress")}
                  defaultValue={application.applicant.address.street}
                  validation={{ required: true }}
                  error={errors.applicant?.address?.street}
                  errorMessage={t("errors.streetError")}
                  register={register}
                  dataTestId={"app-primary-address-street"}
                />

                <Field
                  id="addressStreet2"
                  name="applicant.address.street2"
                  label={t("application.contact.apt")}
                  placeholder={t("application.contact.apt")}
                  defaultValue={application.applicant.address.street2}
                  register={register}
                  dataTestId={"app-primary-address-street2"}
                />

                <div className="flex max-w-2xl">
                  <Field
                    id="addressCity"
                    name="applicant.address.city"
                    label={t("application.contact.cityName")}
                    placeholder={t("application.contact.cityName")}
                    defaultValue={application.applicant.address.city}
                    validation={{ required: true }}
                    error={errors.applicant?.address?.city}
                    errorMessage={t("errors.cityError")}
                    register={register}
                    dataTestId={"app-primary-address-city"}
                  />

                  <Select
                    id="addressState"
                    name="applicant.address.state"
                    label={t("application.contact.state")}
                    validation={{ required: true }}
                    error={errors.applicant?.address?.state}
                    errorMessage={t("errors.stateError")}
                    register={register}
                    controlClassName="control"
                    options={stateKeys}
                    keyPrefix="states"
                    dataTestId={"app-primary-address-state"}
                  />
                </div>
                <Field
                  id="addressZipCode"
                  name="applicant.address.zipCode"
                  label={t("application.contact.zip")}
                  placeholder={t("application.contact.zipCode")}
                  defaultValue={application.applicant.address.zipCode}
                  validation={{ required: true }}
                  error={errors.applicant?.address?.zipCode}
                  errorMessage={t("errors.zipCodeError")}
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
            </div>

            {clientLoaded && (sendMailToMailingAddress || application.sendMailToMailingAddress) && (
              <div className="form-card__group border-b">
                <fieldset>
                  <legend className="field-label--caps">
                    {t("application.contact.mailingAddress")}
                  </legend>

                  <p className="field-note mb-4">
                    {t("application.contact.provideAMailingAddress")}
                  </p>

                  <Field
                    id="mailingAddressStreet"
                    name="mailingAddress.street"
                    placeholder={t("application.contact.streetAddress")}
                    defaultValue={application.mailingAddress.street}
                    validation={{ required: true }}
                    error={errors.mailingAddress?.street}
                    errorMessage={t("errors.streetError")}
                    register={register}
                    dataTestId={"app-primary-mailing-address-street"}
                  />

                  <Field
                    id="mailingAddressStreet2"
                    name="mailingAddress.street2"
                    label={t("application.contact.apt")}
                    placeholder={t("application.contact.apt")}
                    defaultValue={application.mailingAddress.street2}
                    register={register}
                    dataTestId={"app-primary-mailing-address-street2"}
                  />

                  <div className="flex max-w-2xl">
                    <Field
                      id="mailingAddressCity"
                      name="mailingAddress.city"
                      label={t("application.contact.cityName")}
                      placeholder={t("application.contact.cityName")}
                      defaultValue={application.mailingAddress.city}
                      validation={{ required: true }}
                      error={errors.mailingAddress?.city}
                      errorMessage={t("errors.cityError")}
                      register={register}
                      dataTestId={"app-primary-mailing-address-city"}
                    />

                    <Select
                      id="mailingAddressState"
                      name="mailingAddress.state"
                      label={t("application.contact.state")}
                      defaultValue={application.mailingAddress.state}
                      validation={{ required: true }}
                      error={errors.mailingAddress?.state}
                      errorMessage={t("errors.stateError")}
                      register={register}
                      controlClassName="control"
                      options={stateKeys}
                      keyPrefix="states"
                      dataTestId={"app-primary-mailing-address-state"}
                    />
                  </div>

                  <Field
                    id="mailingAddressZipCode"
                    name="mailingAddress.zipCode"
                    label={t("application.contact.zip")}
                    placeholder={t("application.contact.zipCode")}
                    defaultValue={application.mailingAddress.zipCode}
                    validation={{ required: true }}
                    error={errors.mailingAddress?.zipCode}
                    errorMessage={t("errors.zipCodeError")}
                    register={register}
                    dataTestId={"app-primary-mailing-address-zip"}
                  />
                </fieldset>
              </div>
            )}
            <div className="form-card__group border-b">
              <fieldset>
                <legend className="field-label--caps">
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
            </div>

            <div className="form-card__group">
              <fieldset>
                <legend className="field-label--caps">
                  {t("application.contact.doYouWorkIn", { county: listing?.countyCode })}
                </legend>

                <p className="field-note mb-4">{t("application.contact.doYouWorkInDescription")}</p>

                <Field
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

                <ErrorMessage
                  id="applicant.workInRegion-error"
                  error={errors.applicant?.workInRegion}
                >
                  {t("errors.selectOption")}
                </ErrorMessage>
              </fieldset>

              {(workInRegion == "yes" ||
                (!workInRegion && application.applicant.workInRegion == "yes")) && (
                <div className="form-card__group mx-0 px-0 mt-2">
                  <fieldset>
                    <legend className="field-label--caps">
                      {t("application.contact.workAddress")}
                    </legend>

                    <Field
                      id="workAddressStreet"
                      name="applicant.workAddress.street"
                      placeholder={t("application.contact.streetAddress")}
                      defaultValue={application.applicant.workAddress.street}
                      validation={{ required: true }}
                      error={errors.applicant?.workAddress?.street}
                      errorMessage={t("errors.streetError")}
                      register={register}
                      dataTestId={"app-primary-work-address-street"}
                    />

                    <Field
                      id="workAddressStreet2"
                      name="applicant.workAddress.street2"
                      label={t("application.contact.apt")}
                      placeholder={t("application.contact.apt")}
                      defaultValue={application.applicant.workAddress.street2}
                      register={register}
                      dataTestId={"app-primary-work-address-street2"}
                    />

                    <div className="flex max-w-2xl">
                      <Field
                        id="workAddressCity"
                        name="applicant.workAddress.city"
                        label={t("application.contact.cityName")}
                        placeholder={t("application.contact.cityName")}
                        defaultValue={application.applicant.workAddress.city}
                        validation={{ required: true }}
                        error={errors.applicant?.workAddress?.city}
                        errorMessage={t("errors.cityError")}
                        register={register}
                        dataTestId={"app-primary-work-address-city"}
                      />

                      <Select
                        id="workAddressState"
                        name="applicant.workAddress.state"
                        label={t("application.contact.state")}
                        defaultValue={application.applicant.workAddress.state}
                        validation={{ required: true }}
                        error={errors.applicant?.workAddress?.state}
                        errorMessage={t("errors.stateError")}
                        register={register}
                        controlClassName="control"
                        options={stateKeys}
                        keyPrefix="states"
                        dataTestId={"app-primary-work-address-state"}
                      />
                    </div>

                    <Field
                      id="workAddressZipCode"
                      name="applicant.workAddress.zipCode"
                      label={t("application.contact.zip")}
                      placeholder={t("application.contact.zipCode")}
                      defaultValue={application.applicant.workAddress.zipCode}
                      validation={{ required: true }}
                      error={errors.applicant?.workAddress?.zipCode}
                      errorMessage={t("errors.zipCodeError")}
                      register={register}
                      dataTestId={"app-primary-work-address-zip"}
                    />
                  </fieldset>
                </div>
              )}
            </div>
          </div>

          {verifyAddress && (
            <AddressValidationSelection
              {...{ foundAddress, newAddressSelected, setNewAddressSelected, setVerifyAddress }}
            />
          )}

          <div className="form-card__pager">
            <div className="form-card__pager-row primary">
              <Button
                styleType={AppearanceStyleType.primary}
                onClick={() => {
                  conductor.returnToReview = false
                  conductor.setNavigatedBack(false)
                }}
                data-test-id={"app-next-step-button"}
              >
                {t("t.next")}
              </Button>
            </div>

            {conductor.canJumpForwardToReview() && (
              <div className="form-card__pager-row">
                <Button
                  unstyled={true}
                  className="mb-4"
                  onClick={() => {
                    conductor.returnToReview = true
                    conductor.setNavigatedBack(false)
                  }}
                >
                  {t("application.form.general.saveAndReturn")}
                </Button>
              </div>
            )}
          </div>
        </Form>
      </FormCard>
    </FormsLayout>
  )
}

export default ApplicationAddress
