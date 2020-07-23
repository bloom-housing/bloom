/*
1.3 - Contact
Primary applicant contact information
https://github.com/bloom-housing/bloom/issues/256
*/
import Link from "next/link"
import Router from "next/router"
import {
  Button,
  ErrorMessage,
  Field,
  FormCard,
  ProgressNav,
  t,
  mergeDeep,
  contactPreferencesKeys,
} from "@bloom-housing/ui-components"
import FormsLayout from "../../../layouts/forms"
import { useForm } from "react-hook-form"
import { AppSubmissionContext, blankApplication } from "../../../lib/AppSubmissionContext"
import ApplicationConductor from "../../../lib/ApplicationConductor"
import React, { useContext } from "react"
import { StateSelect } from "@bloom-housing/ui-components/src/forms/StateSelect"
import { PhoneField } from "@bloom-housing/ui-components/src/forms/PhoneField"

export default () => {
  const context = useContext(AppSubmissionContext)
  const { application, listing } = context
  const conductor = new ApplicationConductor(application, listing, context)
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

    Router.push("/applications/contact/alternate-contact-type").then(() => window.scrollTo(0, 0))
  }

  const noPhone = watch("applicant.noPhone") || false
  const additionalPhone = watch("additionalPhone")
  const sendMailToMailingAddress = watch("sendMailToMailingAddress")
  const workInRegion = watch("applicant.workInRegion")

  return (
    <FormsLayout>
      <FormCard header="LISTING">
        <ProgressNav
          currentPageStep={currentPageStep}
          completedSteps={application.completedStep}
          totalNumberOfSteps={conductor.totalNumberOfSteps()}
          labels={["You", "Household", "Income", "Preferences", "Review"]}
        />
      </FormCard>

      <FormCard>
        <p className="form-card__back">
          <strong>
            <Link href="/applications/contact/name">Back</Link>
          </strong>
        </p>

        <div className="form-card__lead border-b">
          <h2 className="form-card__title is-borderless">
            {t("application.contact.title", { firstName: application.applicant.firstName })}
          </h2>
        </div>

        <form id="applications-address" onSubmit={handleSubmit(onSubmit)}>
          <div className="form-card__group border-b">
            <label className="field-label--caps" htmlFor="phoneNumber">
              {t("application.contact.yourPhoneNumber")}
            </label>

            <PhoneField
              name="applicant.phoneNumber"
              error={errors.applicant?.phoneNumber}
              errorMessage={t("application.contact.phoneNumberError")}
              controlClassName="control"
              control={control}
              defaultValue={application.applicant.phoneNumber}
              disabled={noPhone}
            />

            <div className={"field " + (errors.applicant?.phoneNumberType ? "error" : "")}>
              <div className="control">
                <select
                  id="applicant.phoneNumberType"
                  name="applicant.phoneNumberType"
                  className="w-full"
                  defaultValue={application.applicant.phoneNumberType}
                  disabled={noPhone}
                  ref={register({
                    validate: {
                      selectionMade: (v) => {
                        const dropdown = document.querySelector<HTMLSelectElement>(
                          "#applicant\\.phoneNumberType"
                        )
                        if (dropdown.disabled) return true
                        return v != ""
                      },
                    },
                  })}
                >
                  <option value="">What type of number is this?</option>
                  <option>Work</option>
                  <option>Home</option>
                  <option>Cell</option>
                </select>
                <ErrorMessage error={errors.applicant?.phoneNumberType}>
                  {t("application.contact.phoneNumberTypeError")}
                </ErrorMessage>
              </div>
            </div>

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
                      <option value="">What type of number is this?</option>
                      <option value="Work">Work</option>
                      <option value="Home">Home</option>
                      <option value="Cell">Cell</option>
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
              placeholder={t("application.contact.streetAddress")}
              defaultValue={context.application.applicant.address.street}
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
              defaultValue={context.application.applicant.address.street2}
              register={register}
            />

            <div className="flex max-w-2xl">
              <Field
                id="addressCity"
                name="applicant.address.city"
                label={t("application.contact.cityName")}
                placeholder={t("application.contact.cityName")}
                defaultValue={context.application.applicant.address.city}
                validation={{ required: true }}
                error={errors.address?.city}
                errorMessage={t("application.contact.cityError")}
                register={register}
              />

              <StateSelect
                id="addressState"
                name="applicant.address.state"
                label="State"
                defaultValue={context.application.applicant.address.state}
                validation={{ required: true }}
                error={errors.applicant?.address?.state}
                errorMessage={t("application.contact.stateError")}
                register={register}
                controlClassName="control"
              />
            </div>
            <Field
              id="addressZipCode"
              name="applicant.address.zipCode"
              label="Zip"
              placeholder="ZipCode"
              defaultValue={context.application.applicant.address.zipCode}
              validation={{ required: true }}
              error={errors.applicant?.address?.zipCode}
              errorMessage="Please enter your ZipCode"
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
                defaultValue={context.application.mailingAddress.street}
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
                defaultValue={context.application.mailingAddress.street2}
                register={register}
              />

              <div className="flex max-w-2xl">
                <Field
                  id="mailingAddressCity"
                  name="mailingAddress.city"
                  label={t("application.contact.cityName")}
                  placeholder={t("application.contact.cityName")}
                  defaultValue={context.application.mailingAddress.city}
                  validation={{ required: true }}
                  error={errors.mailingAddress?.city}
                  errorMessage={t("application.contact.cityError")}
                  register={register}
                />

                <StateSelect
                  id="mailingAddressState"
                  name="mailingAddress.state"
                  label="State"
                  defaultValue={context.application.mailingAddress.state}
                  validation={{ required: true }}
                  error={errors.mailingAddress?.state}
                  errorMessage={t("application.contact.stateError")}
                  register={register}
                  controlClassName="control"
                />
              </div>

              <Field
                id="mailingAddressZipCode"
                name="mailingAddress.zipCode"
                label="Zip"
                placeholder="ZipCode"
                defaultValue={context.application.mailingAddress.zipCode}
                validation={{ required: true }}
                error={errors.mailingAddress?.zipCode}
                errorMessage="Please enter your ZipCode"
                register={register}
              />
            </div>
          )}
          <div className="form-card__group border-b">
            <label className="field-label--caps" htmlFor="contactPreference">
              {t("application.contact.contactPreference")}
            </label>
            <div className={"field " + (errors.contactPreferences ? "error" : "")}>
              {contactPreferencesKeys.map((preference) => {
                return (
                  <>
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
                  </>
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
                  defaultValue={context.application.applicant.workAddress.street}
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
                  defaultValue={context.application.applicant.workAddress.street2}
                  register={register}
                />

                <div className="flex max-w-2xl">
                  <Field
                    id="workAddressCity"
                    name="applicant.workAddress.city"
                    label={t("application.contact.cityName")}
                    placeholder={t("application.contact.cityName")}
                    defaultValue={context.application.applicant.workAddress.city}
                    validation={{ required: true }}
                    error={errors.applicant?.workAddress?.city}
                    errorMessage={t("application.contact.cityError")}
                    register={register}
                  />

                  <StateSelect
                    id="workAddressState"
                    name="applicant.workAddress.state"
                    label="State"
                    defaultValue={context.application.applicant.workAddress.state}
                    validation={{ required: true }}
                    error={errors.applicant?.workAddress?.state}
                    errorMessage={t("application.contact.stateError")}
                    register={register}
                    controlClassName="control"
                  />
                </div>

                <Field
                  id="workAddressZipCode"
                  name="applicant.workAddress.zipCode"
                  label="Zip"
                  placeholder="ZipCode"
                  defaultValue={context.application.applicant.workAddress.zipCode}
                  validation={{ required: true }}
                  error={errors.applicant?.workAddress?.zipCode}
                  errorMessage="Please enter your ZipCode"
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
                  //
                }}
              >
                Next
              </Button>
            </div>
          </div>
        </form>
      </FormCard>
    </FormsLayout>
  )
}
