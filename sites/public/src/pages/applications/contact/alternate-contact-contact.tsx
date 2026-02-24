import React, { useContext, useEffect } from "react"
import { useForm } from "react-hook-form"
import { Field, Form, PhoneField, Select, t } from "@bloom-housing/ui-components"
import { CardSection } from "@bloom-housing/ui-seeds/src/blocks/Card"
import {
  OnClientSide,
  PageView,
  pushGtmEvent,
  stateKeys,
  AuthContext,
  emailRegex,
} from "@bloom-housing/shared-helpers"
import { useFormConductor } from "../../../lib/hooks"
import { UserStatus } from "../../../lib/constants"
import ApplicationFormLayout, {
  ApplicationAlertBox,
  LockIcon,
  onFormError,
} from "../../../layouts/application-form"
import FormsLayout from "../../../layouts/forms"

const ApplicationAlternateContactContact = () => {
  const { profile } = useContext(AuthContext)
  const { conductor, application, listing } = useFormConductor("alternateContactInfo")
  const currentPageSection = 1
  const isAdvocate = !!conductor.config?.isAdvocate

  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { control, register, handleSubmit, errors, trigger } = useForm<Record<string, any>>({
    shouldFocusError: false,
  })
  const onSubmit = async (data) => {
    const validation = await trigger()
    if (!validation) return

    if (!isAdvocate) {
      application.alternateContact.phoneNumber = data.phoneNumber
      application.alternateContact.emailAddress = data.emailAddress || null
      application.alternateContact.address.street = data.mailingAddress.street
      application.alternateContact.address.street2 = data.mailingAddress.street2
      application.alternateContact.address.state = data.mailingAddress.state
      application.alternateContact.address.zipCode = data.mailingAddress.zipCode
      application.alternateContact.address.city = data.mailingAddress.city
    }
    conductor.completeSection(1)
    conductor.sync()
    conductor.routeToNextOrReturnUrl()
  }
  const onError = () => {
    onFormError()
  }

  useEffect(() => {
    if (!isAdvocate || !profile) return
    application.alternateContact.phoneNumber = profile.phoneNumber || ""
    application.alternateContact.emailAddress = profile.email || null

    // TODO (Advocate): replace this with the profile address when available
    application.alternateContact.address = {
      ...application.alternateContact.address,
      street: "street",
      street2: "street2",
      city: "Angelopolis",
      state: "CA",
      zipCode: "90210",
    }
    // if (profile.address) {
    //   application.alternateContact.address = {
    //     ...application.alternateContact.address,
    //     street: profile.address.street || "",
    //     street2: profile.address.street2 || "",
    //     city: profile.address.city || "",
    //     state: profile.address.state || "",
    //     zipCode: profile.address.zipCode || "",
    //   }
    // }

    conductor.sync()
  }, [isAdvocate, profile, application, conductor])

  useEffect(() => {
    pushGtmEvent<PageView>({
      event: "pageView",
      pageTitle: "Application - Alternate Contact",
      status: profile ? UserStatus.LoggedIn : UserStatus.NotLoggedIn,
    })
  }, [profile])

  return (
    <FormsLayout
      pageTitle={`${t("pageTitle.alternateContactDetails")} - ${t(
        "listings.apply.applyOnline"
      )} - ${listing?.name}`}
    >
      <Form id="applications-contact-alternate-contact" onSubmit={handleSubmit(onSubmit, onError)}>
        <ApplicationFormLayout
          listingName={listing?.name}
          heading={t("application.alternateContact.contact.title")}
          subheading={t("application.alternateContact.contact.description")}
          progressNavProps={{
            currentPageSection: currentPageSection,
            completedSections: application.completedSections,
            labels: conductor.config.sections.map((label) => t(`t.${label}`)),
            mounted: OnClientSide(),
          }}
          backLink={{
            url: conductor.determinePreviousUrl(),
          }}
          conductor={conductor}
        >
          <ApplicationAlertBox errors={errors} />
          <CardSection divider={"inset"}>
            <label className="text__caps-spaced" htmlFor="phoneNumber">
              <LockIcon locked={isAdvocate} />
              {t("application.alternateContact.contact.phoneNumberFormLabel")}
            </label>
            <PhoneField
              id="phoneNumber"
              name="phoneNumber"
              label={t("application.alternateContact.contact.phoneNumberFormLabel")}
              readerOnly={true}
              required={!isAdvocate}
              error={errors.phoneNumber}
              errorMessage={t("errors.phoneNumberError")}
              controlClassName="control"
              control={control}
              defaultValue={application.alternateContact.phoneNumber}
              disabled={isAdvocate}
              dataTestId={"app-alternate-phone-number"}
              subNote={t("application.contact.number.subNote")}
            />
          </CardSection>
          <CardSection divider={"inset"}>
            <label className="text__caps-spaced" htmlFor="emailAddress">
              <LockIcon locked={isAdvocate} />
              {t("application.alternateContact.contact.emailAddressFormLabel")}
            </label>
            <Field
              id="emailAddress"
              name="emailAddress"
              label={t("application.alternateContact.contact.emailAddressFormLabel")}
              readerOnly={true}
              defaultValue={application.alternateContact.emailAddress || null}
              disabled={isAdvocate}
              register={register}
              type="email"
              validation={isAdvocate ? undefined : { pattern: emailRegex }}
              error={errors.emailAddress}
              errorMessage={t("errors.emailAddressError")}
              dataTestId={"app-alternate-email"}
              subNote={"example@mail.com"}
            />
          </CardSection>
          <CardSection divider={"flush"} className={"border-none"}>
            <fieldset>
              <legend className="text__caps-spaced">
                <LockIcon locked={isAdvocate} />
                {t("application.alternateContact.contact.contactMailingAddressLabel")}
              </legend>
              <p className="field-note mb-4">
                {t("application.alternateContact.contact.contactMailingAddressHelperText")}
              </p>
              <Field
                id="mailingAddress.street"
                name="mailingAddress.street"
                label={t("application.contact.streetAddress")}
                defaultValue={application.alternateContact.address.street}
                disabled={isAdvocate}
                register={register}
                dataTestId={"app-alternate-mailing-address-street"}
                error={errors.mailingAddress?.street}
                validation={isAdvocate ? undefined : { maxLength: 64 }}
                errorMessage={t("errors.maxLength", { length: 64 })}
              />
              <Field
                id="mailingAddress.street2"
                name="mailingAddress.street2"
                label={t("application.contact.apt")}
                register={register}
                dataTestId={"app-alternate-mailing-address-street2"}
                defaultValue={application.alternateContact.address.street2}
                disabled={isAdvocate}
                error={errors.mailingAddress?.street2}
                validation={isAdvocate ? undefined : { maxLength: 64 }}
                errorMessage={t("errors.maxLength", { length: 64 })}
              />
              <div className="flex max-w-2xl">
                <Field
                  id="mailingAddress.city"
                  name="mailingAddress.city"
                  defaultValue={application.alternateContact.address.city}
                  label={t("application.contact.city")}
                  register={register}
                  dataTestId={"app-alternate-mailing-address-city"}
                  disabled={isAdvocate}
                  error={errors.mailingAddress?.city}
                  validation={isAdvocate ? undefined : { maxLength: 64 }}
                  errorMessage={t("errors.maxLength", { length: 64 })}
                />

                <Select
                  id="mailingAddress.state"
                  name="mailingAddress.state"
                  label={t("application.contact.state")}
                  defaultValue={application.alternateContact.address.state}
                  register={register}
                  controlClassName="control"
                  options={stateKeys}
                  keyPrefix="states"
                  dataTestId={"app-alternate-mailing-address-state"}
                  disabled={isAdvocate}
                  error={errors.mailingAddress?.state}
                  validation={isAdvocate ? undefined : { maxLength: 64 }}
                  errorMessage={t("errors.maxLength", { length: 64 })}
                />
              </div>
              <Field
                id="mailingAddress.zipCode"
                name="mailingAddress.zipCode"
                label={t("application.contact.zip")}
                defaultValue={application.alternateContact.address.zipCode}
                disabled={isAdvocate}
                register={register}
                dataTestId={"app-alternate-mailing-address-zip"}
                error={errors.mailingAddress?.zipCode}
                validation={isAdvocate ? undefined : { maxLength: 10 }}
                errorMessage={t("errors.maxLength", { length: 10 })}
              />
            </fieldset>
          </CardSection>
        </ApplicationFormLayout>
      </Form>
    </FormsLayout>
  )
}

export default ApplicationAlternateContactContact
