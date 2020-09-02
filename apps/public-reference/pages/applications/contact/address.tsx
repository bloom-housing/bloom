/*
1.3 - Contact
Primary applicant contact information
https://github.com/bloom-housing/bloom/issues/256
*/
import Link from "next/link"
import {
  Button,
  ErrorMessage,
  Field,
  FormCard,
  ProgressNav,
  t,
  mergeDeep,
  contactPreferencesKeys,
  Form,
} from "@bloom-housing/ui-components"
import FormsLayout from "../../../layouts/forms"
import { useForm } from "react-hook-form"
import { AppSubmissionContext, blankApplication } from "../../../lib/AppSubmissionContext"
import ApplicationConductor from "../../../lib/ApplicationConductor"
import React, { useContext, useMemo, Fragment } from "react"
import { Select } from "@bloom-housing/ui-components/src/forms/Select"
import { PhoneField } from "@bloom-housing/ui-components/src/forms/PhoneField"
import { phoneNumberKeys, stateKeys } from "@bloom-housing/ui-components/src/helpers/formOptions"

export default () => {
  const { conductor, application, listing } = useContext(AppSubmissionContext)
  const currentPageStep = 1

  /* Form Handler */
  const { control, register, handleSubmit, setValue, trigger, watch, errors } = useForm<
    Record<string, any>
  >({
    defaultValues: {
      noPhone: application.applicant.noPhone,
      additionalPhone: application.additionalPhone,
      sendMailToMailingAddress: application.sendMailToMailingAddress,
      workInRegion: application.applicant.workInRegion,
    },
  })
  const onSubmit = (data) => {
    mergeDeep(application, data)
    if (application.applicant.noPhone) {
      application.applicant.phoneNumber = ""
      application.applicant.phoneNumberType = ""
    }
    if (!application.additionalPhone) {
      application.additionalPhoneNumber = ""
      application.additionalPhoneNumberType = ""
    }
    if (!application.sendMailToMailingAddress) {
      application.mailingAddress = blankApplication().mailingAddress
    }
    if (!application.applicant.workInRegion) {
      application.applicant.workAddress = blankApplication().applicant.workAddress
    }
    conductor.sync()

    conductor.routeToNextOrReturnUrl("/applications/contact/alternate-contact-type")
  }

  const noPhone = watch("applicant.noPhone", application.applicant.noPhone)
  const additionalPhone = watch("additionalPhone", application.additionalPhone)
  const sendMailToMailingAddress = watch(
    "sendMailToMailingAddress",
    application.sendMailToMailingAddress
  )
  const workInRegion = watch("applicant.workInRegion", application.applicant.workInRegion)

  return (
    <FormsLayout>
      <FormCard header={listing?.name}>
        <ProgressNav
          currentPageStep={currentPageStep}
          completedSteps={application.completedStep}
          labels={["You", "Household", "Income", "Preferences", "Review"]}
        />
      </FormCard>

      <FormCard>
        <p className="form-card__back">
          <strong>
            <Link href="/applications/contact/name">
              <a>{t("t.back")}</a>
            </Link>
          </strong>
        </p>

        <div className="form-card__lead border-b">
          <h2 className="form-card__title is-borderless">
            {t("application.contact.title", { firstName: application.applicant.firstName })}
          </h2>
        </div>

        <Form id="applications-address" onSubmit={handleSubmit(onSubmit)}>
          <div className="form-card__group border-b">
            <label className="field-label--caps" htmlFor="applicant.phoneNumber">
              {t("application.contact.yourPhoneNumber")}
            </label>

            <PhoneField
              name="applicant.phoneNumber"
              error={!noPhone ? errors.applicant?.phoneNumber : false}
              errorMessage={t("application.contact.phoneNumberError")}
              controlClassName="control"
              control={control}
              defaultValue={application.applicant.phoneNumber}
              disabled={noPhone}
            />

            <Select
              id="applicant.phoneNumberType"
              name="applicant.phoneNumberType"
              placeholder={t("application.contact.phoneNumberTypes.prompt")}
              label={t("application.contact.phoneNumberTypes.prompt")}
              defaultValue={application.applicant.phoneNumberType}
              disabled={noPhone}
              validation={{ required: !noPhone }}
              error={!noPhone && errors.applicant?.phoneNumberType}
              errorMessage={t("application.contact.phoneNumberTypeError")}
              register={register}
              controlClassName="control"
              options={phoneNumberKeys}
              keyPrefix="application.contact.phoneNumberTypes"
            />

            <div className="field">
              <input
                type="checkbox"
                id="noPhone"
                name="applicant.noPhone"
                defaultChecked={application.applicant.noPhone}
                ref={register}
                onChange={(e) => {
                  if (e.target.checked) {
                    setValue("phoneNumber", "")
                    setTimeout(() => {
                      trigger("phoneNumber")
                      trigger("phoneNumberType")
                    }, 1)
                  }
                }}
              />
              <label htmlFor="noPhone" className="text-primary font-semibold">
                {t("application.contact.noPhoneNumber")}
              </label>
            </div>

            <div className="field">
              <input
                type="checkbox"
                id="additionalPhone"
                name="additionalPhone"
                defaultChecked={application.additionalPhone}
                ref={register}
              />
              <label htmlFor="additionalPhone" className="text-primary font-semibold">
                {t("application.contact.additionalPhoneNumber")}
              </label>
            </div>

            {additionalPhone && (
              <>
                <PhoneField
                  name="additionalPhoneNumber"
                  error={errors.additionalPhoneNumber}
                  errorMessage={t("application.contact.phoneNumberError")}
                  control={control}
                  defaultValue={application.additionalPhoneNumber}
                  controlClassName="control mt-2"
                />
                <div className={"field " + (errors.additionalPhoneNumberType ? "error" : "")}>
                  <div className="control">
                    <select
                      id="additionalPhoneNumberType"
                      name="additionalPhoneNumberType"
                      className="w-full"
                      defaultValue={application.additionalPhoneNumberType}
                      ref={register({ required: true })}
                    >
                      {["prompt", "work", "home", "cell"].map((key) => (
                        <option
                          key={key}
                          value={key === "prompt" ? "" : key[0].toUpperCase() + key.slice(1)}
                        >
                          {t(`application.contact.phoneNumberTypes.${key}`)}
                        </option>
                      ))}
                    </select>
                    <ErrorMessage error={errors?.additionalPhoneNumberType}>
                      {t("application.contact.phoneNumberTypeError")}
                    </ErrorMessage>
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="form-card__group border-b">
            <label className="field-label--caps" htmlFor="street">
              {t("application.contact.address")}
            </label>

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
              errorMessage={t("application.contact.streetError")}
              register={register}
            />

            <Field
              id="addressStreet2"
              name="applicant.address.street2"
              label={t("application.contact.apt")}
              placeholder={t("application.contact.apt")}
              defaultValue={application.applicant.address.street2}
              register={register}
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
                errorMessage={t("application.contact.cityError")}
                register={register}
              />

              <Select
                id="addressState"
                name="applicant.address.state"
                label={t("application.contact.state")}
                defaultValue={application.applicant.address.state}
                validation={{ required: true }}
                error={errors.applicant?.address?.state}
                errorMessage={t("application.contact.stateError")}
                register={register}
                controlClassName="control"
                options={stateKeys}
                keyPrefix="application.form.options.states"
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
              errorMessage={t("application.contact.zipCodeError")}
              register={register}
            />

            <div className="field">
              <input
                type="checkbox"
                id="sendMailToMailingAddress"
                name="sendMailToMailingAddress"
                defaultChecked={application.sendMailToMailingAddress}
                ref={register}
              />
              <label htmlFor="sendMailToMailingAddress" className="text-primary font-semibold">
                {t("application.contact.sendMailToMailingAddress")}
              </label>
            </div>
          </div>

          {(sendMailToMailingAddress || application.sendMailToMailingAddress) && (
            <div className="form-card__group border-b">
              <label className="field-label--caps" htmlFor="street">
                {t("application.contact.mailingAddress")}
              </label>

              <p className="field-note mb-4">{t("application.contact.provideAMailingAddress")}</p>

              <Field
                id="mailingAddressStreet"
                name="mailingAddress.street"
                placeholder={t("application.contact.streetAddress")}
                defaultValue={application.mailingAddress.street}
                validation={{ required: true }}
                error={errors.mailingAddress?.street}
                errorMessage={t("application.contact.streetError")}
                register={register}
              />

              <Field
                id="mailingAddressStreet2"
                name="mailingAddress.street2"
                label={t("application.contact.apt")}
                placeholder={t("application.contact.apt")}
                defaultValue={application.mailingAddress.street2}
                register={register}
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
                  errorMessage={t("application.contact.cityError")}
                  register={register}
                />

                <Select
                  id="mailingAddressState"
                  name="mailingAddress.state"
                  label={t("application.contact.state")}
                  defaultValue={application.mailingAddress.state}
                  validation={{ required: true }}
                  error={errors.mailingAddress?.state}
                  errorMessage={t("application.contact.stateError")}
                  register={register}
                  controlClassName="control"
                  options={stateKeys}
                  keyPrefix="application.form.options.states"
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
                errorMessage={t("application.contact.zipCodeError")}
                register={register}
              />
            </div>
          )}
          <div className="form-card__group border-b">
            <label className="field-label--caps mb-4" htmlFor="contactPreference">
              {t("application.contact.contactPreference")}
            </label>
            <div className={"field " + (errors.contactPreferences ? "error" : "")}>
              {contactPreferencesKeys.map((preference) => {
                return (
                  <Fragment key={preference}>
                    <div className="field">
                      <input
                        type="checkbox"
                        name="contactPreferences"
                        id={"contactPreferences" + preference}
                        value={preference}
                        defaultChecked={application.contactPreferences.includes(preference)}
                        ref={register({ required: true })}
                      />
                      <label
                        htmlFor={"contactPreferences" + preference}
                        className="font-semibold"
                        key={preference}
                      >
                        {t("application.form.options.contact." + preference)}
                      </label>
                    </div>
                  </Fragment>
                )
              })}
              <ErrorMessage error={errors.contactPreferences}>
                {t("application.form.errors.selectAtLeastOne")}
              </ErrorMessage>
            </div>
          </div>

          <div className="form-card__group">
            <label className="field-label--caps" htmlFor="street">
              {t("application.contact.doYouWorkIn")}
            </label>

            <p className="field-note mb-4">{t("application.contact.doYouWorkInDescription")}</p>

            <div className={"field " + (errors.applicant?.workInRegion ? "error" : "")}>
              <input
                type="radio"
                id="workInRegionYes"
                name="applicant.workInRegion"
                value="yes"
                defaultChecked={application.applicant.workInRegion == "yes"}
                ref={register({ required: true })}
              />
              <label className="font-semibold" htmlFor="workInRegionYes">
                Yes
              </label>
            </div>
            <div className={"field " + (errors.applicant?.workInRegion ? "error" : "")}>
              <input
                type="radio"
                id="workInRegionNo"
                name="applicant.workInRegion"
                value="no"
                defaultChecked={application.applicant.workInRegion == "no"}
                ref={register({ required: true })}
              />
              <label className="font-semibold" htmlFor="workInRegionNo">
                No
              </label>

              <ErrorMessage error={errors.applicant?.workInRegion}>
                Please select an option
              </ErrorMessage>
            </div>

            {(workInRegion == "yes" ||
              (!workInRegion && application.applicant.workInRegion == "yes")) && (
              <>
                <div className="mt-8 mb-3">
                  <label className="field-label--caps" htmlFor="street">
                    {t("application.contact.workAddress")}
                  </label>
                </div>

                <Field
                  id="workAddressStreet"
                  name="applicant.workAddress.street"
                  placeholder={t("application.contact.streetAddress")}
                  defaultValue={application.applicant.workAddress.street}
                  validation={{ required: true }}
                  error={errors.applicant?.workAddress?.street}
                  errorMessage={t("application.contact.streetError")}
                  register={register}
                />

                <Field
                  id="workAddressStreet2"
                  name="applicant.workAddress.street2"
                  label={t("application.contact.apt")}
                  placeholder={t("application.contact.apt")}
                  defaultValue={application.applicant.workAddress.street2}
                  register={register}
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
                    errorMessage={t("application.contact.cityError")}
                    register={register}
                  />

                  <Select
                    id="workAddressState"
                    name="applicant.workAddress.state"
                    label={t("application.contact.state")}
                    defaultValue={application.applicant.workAddress.state}
                    validation={{ required: true }}
                    error={errors.applicant?.workAddress?.state}
                    errorMessage={t("application.contact.stateError")}
                    register={register}
                    controlClassName="control"
                    options={stateKeys}
                    keyPrefix="application.form.options.states"
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
                  errorMessage={t("application.contact.zipCodeError")}
                  register={register}
                />
              </>
            )}
          </div>

          <div className="form-card__pager">
            <div className="form-card__pager-row primary">
              <Button
                filled={true}
                onClick={() => {
                  conductor.returnToReview = false
                }}
              >
                {t("t.next")}
              </Button>
            </div>

            {conductor.canJumpForwardToReview() && (
              <div className="form-card__pager-row">
                <Button
                  className="button is-unstyled mb-4"
                  onClick={() => {
                    conductor.returnToReview = true
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
