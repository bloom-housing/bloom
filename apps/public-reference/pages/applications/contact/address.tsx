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
} from "@bloom-housing/ui-components"
import FormsLayout from "../../../layouts/forms"
import { useForm, Controller } from "react-hook-form"
import { AppSubmissionContext, blankApplication } from "../../../lib/AppSubmissionContext"
import ApplicationConductor from "../../../lib/ApplicationConductor"
import FormStep from "../../../src/forms/applications/FormStep"
import React, { useContext } from "react"
import { StateSelect } from "@bloom-housing/ui-components/src/forms/StateSelect"
import { PhoneField } from "@bloom-housing/ui-components/src/forms/PhoneField"

export default () => {
  const context = useContext(AppSubmissionContext)
  const { application } = context
  const conductor = new ApplicationConductor(application, context)
  const currentPageStep = 1

  /* Form Handler */
  const { control, register, handleSubmit, setValue, triggerValidation, watch, errors } = useForm<
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
      application.workAddress = blankApplication().workAddress
    }
    conductor.sync()

    Router.push("/applications/contact/alternate-contact-type").then(() => window.scrollTo(0, 0))
  }

  const noPhone = watch("applicant.noPhone")
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
              name="phoneNumber"
              error={errors.phoneNumber}
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
                      triggerValidation("phoneNumber")
                      triggerValidation("phoneNumberType")
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
                name="address.state"
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

            {(workInRegion == "yes" || application.applicant.workInRegion == "yes") && (
              <>
                <div className="mt-8 mb-3">
                  <label className="field-label--caps" htmlFor="street">
                    {t("application.contact.workAddress")}
                  </label>
                </div>

                <Field
                  id="workAddressStreet"
                  name="workAddress.street"
                  placeholder={t("application.contact.streetAddress")}
                  defaultValue={context.application.workAddress.street}
                  validation={{ required: true }}
                  error={errors.workAddress?.street}
                  errorMessage={t("application.contact.streetError")}
                  register={register}
                />

                <Field
                  id="workAddressStreet2"
                  name="workAddress.street2"
                  label={t("application.contact.apt")}
                  placeholder={t("application.contact.apt")}
                  defaultValue={context.application.workAddress.street2}
                  register={register}
                />

                <div className="flex max-w-2xl">
                  <Field
                    id="workAddressCity"
                    name="workAddress.city"
                    label={t("application.contact.cityName")}
                    placeholder={t("application.contact.cityName")}
                    defaultValue={context.application.workAddress.city}
                    validation={{ required: true }}
                    error={errors.workAddress?.city}
                    errorMessage={t("application.contact.cityError")}
                    register={register}
                  />

                  <div className={"field " + (errors.workAddress?.state ? "error" : "")}>
                    <label htmlFor="stuff">State</label>
                    <div className="control">
                      <select
                        id="workAddressState"
                        name="workAddress.state"
                        defaultValue={context.application.workAddress.state}
                        ref={register({ required: true })}
                      >
                        <option value="">Select One</option>
                        <option value="AL">Alabama</option>
                        <option value="AK">Alaska</option>
                        <option value="AZ">Arizona</option>
                        <option value="AR">Arkansas</option>
                        <option value="CA">California</option>
                        <option value="CO">Colorado</option>
                        <option value="CT">Connecticut</option>
                        <option value="DE">Delaware</option>
                        <option value="DC">District Of Columbia</option>
                        <option value="FL">Florida</option>
                        <option value="GA">Georgia</option>
                        <option value="HI">Hawaii</option>
                        <option value="ID">Idaho</option>
                        <option value="IL">Illinois</option>
                        <option value="IN">Indiana</option>
                        <option value="IA">Iowa</option>
                        <option value="KS">Kansas</option>
                        <option value="KY">Kentucky</option>
                        <option value="LA">Louisiana</option>
                        <option value="ME">Maine</option>
                        <option value="MD">Maryland</option>
                        <option value="MA">Massachusetts</option>
                        <option value="MI">Michigan</option>
                        <option value="MN">Minnesota</option>
                        <option value="MS">Mississippi</option>
                        <option value="MO">Missouri</option>
                        <option value="MT">Montana</option>
                        <option value="NE">Nebraska</option>
                        <option value="NV">Nevada</option>
                        <option value="NH">New Hampshire</option>
                        <option value="NJ">New Jersey</option>
                        <option value="NM">New Mexico</option>
                        <option value="NY">New York</option>
                        <option value="NC">North Carolina</option>
                        <option value="ND">North Dakota</option>
                        <option value="OH">Ohio</option>
                        <option value="OK">Oklahoma</option>
                        <option value="OR">Oregon</option>
                        <option value="PA">Pennsylvania</option>
                        <option value="RI">Rhode Island</option>
                        <option value="SC">South Carolina</option>
                        <option value="SD">South Dakota</option>
                        <option value="TN">Tennessee</option>
                        <option value="TX">Texas</option>
                        <option value="UT">Utah</option>
                        <option value="VT">Vermont</option>
                        <option value="VA">Virginia</option>
                        <option value="WA">Washington</option>
                        <option value="WV">West Virginia</option>
                        <option value="WI">Wisconsin</option>
                        <option value="WY">Wyoming</option>
                      </select>
                    </div>
                    <ErrorMessage error={errors.workAddress?.state}>
                      {t("application.contact.stateError")}
                    </ErrorMessage>
                  </div>
                </div>

                <Field
                  id="workAddressZipCode"
                  name="workAddress.zipCode"
                  label="Zip"
                  placeholder="ZipCode"
                  defaultValue={context.application.workAddress.zipCode}
                  validation={{ required: true }}
                  error={errors.workAddress?.zipCode}
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
