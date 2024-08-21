import React, { useContext, useEffect } from "react"
import { useForm } from "react-hook-form"
import { emailRegex, Field, Form, PhoneField, Select, t } from "@bloom-housing/ui-components"
import { CardSection } from "@bloom-housing/ui-seeds/src/blocks/Card"
import { Alert } from "@bloom-housing/ui-seeds"
import {
  OnClientSide,
  PageView,
  pushGtmEvent,
  stateKeys,
  AuthContext,
} from "@bloom-housing/shared-helpers"
import { useFormConductor } from "../../../lib/hooks"
import { UserStatus } from "../../../lib/constants"
import ApplicationFormLayout from "../../../layouts/application-form"
import FormsLayout from "../../../layouts/forms"
import styles from "../../../layouts/application-form.module.scss"

const ApplicationAlternateContactContact = () => {
  const { profile } = useContext(AuthContext)
  const { conductor, application, listing } = useFormConductor("alternateContactInfo")
  const currentPageSection = 1

  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { control, register, handleSubmit, errors, trigger } = useForm<Record<string, any>>({
    shouldFocusError: false,
  })
  const onSubmit = async (data) => {
    const validation = await trigger()
    if (!validation) return

    application.alternateContact.phoneNumber = data.phoneNumber
    application.alternateContact.emailAddress = data.emailAddress || null
    application.alternateContact.address.street = data.mailingAddress.street
    application.alternateContact.address.street2 = data.mailingAddress.street2
    application.alternateContact.address.state = data.mailingAddress.state
    application.alternateContact.address.zipCode = data.mailingAddress.zipCode
    application.alternateContact.address.city = data.mailingAddress.city
    conductor.completeSection(1)
    conductor.sync()
    conductor.routeToNextOrReturnUrl()
  }
  const onError = () => {
    window.scrollTo(0, 0)
  }

  useEffect(() => {
    pushGtmEvent<PageView>({
      event: "pageView",
      pageTitle: "Application - Alternate Contact",
      status: profile ? UserStatus.LoggedIn : UserStatus.NotLoggedIn,
    })
  }, [profile])

  return (
    <FormsLayout>
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

          <CardSection divider={"inset"}>
            <label className="text__caps-spaced" htmlFor="phoneNumber">
              {t("application.alternateContact.contact.phoneNumberFormLabel")}
            </label>
            <PhoneField
              id="phoneNumber"
              name="phoneNumber"
              label={t("application.alternateContact.contact.phoneNumberFormLabel")}
              readerOnly={true}
              required={true}
              error={errors.phoneNumber}
              errorMessage={t("errors.phoneNumberError")}
              controlClassName="control"
              control={control}
              defaultValue={application.alternateContact.phoneNumber}
              dataTestId={"app-alternate-phone-number"}
              subNote={t("application.contact.number.subNote")}
            />
          </CardSection>
          <CardSection divider={"inset"}>
            <h3 className="text__caps-spaced">
              {t("application.alternateContact.contact.emailAddressFormLabel")}
            </h3>
            <Field
              id="emailAddress"
              name="emailAddress"
              label={t("application.alternateContact.contact.emailAddressFormLabel")}
              readerOnly={true}
              defaultValue={application.alternateContact.emailAddress || null}
              register={register}
              type="email"
              validation={{ pattern: emailRegex }}
              error={errors.emailAddress}
              errorMessage={t("errors.emailAddressError")}
              dataTestId={"app-alternate-email"}
              subNote={"example@mail.com"}
            />
          </CardSection>
          <CardSection divider={"flush"} className={"border-none"}>
            <fieldset>
              <legend className="text__caps-spaced">
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
                register={register}
                dataTestId={"app-alternate-mailing-address-street"}
                error={errors.mailingAddress?.street}
                validation={{ maxLength: 64 }}
                errorMessage={t("errors.maxLength", { length: 64 })}
              />
              <Field
                id="mailingAddress.street2"
                name="mailingAddress.street2"
                label={t("application.contact.apt")}
                register={register}
                dataTestId={"app-alternate-mailing-address-street2"}
                defaultValue={application.alternateContact.address.street2}
                error={errors.mailingAddress?.street2}
                validation={{ maxLength: 64 }}
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
                  error={errors.mailingAddress?.city}
                  validation={{ maxLength: 64 }}
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
                  error={errors.mailingAddress?.state}
                  validation={{ maxLength: 64 }}
                  errorMessage={t("errors.maxLength", { length: 64 })}
                />
              </div>
              <Field
                id="mailingAddress.zipCode"
                name="mailingAddress.zipCode"
                label={t("application.contact.zip")}
                defaultValue={application.alternateContact.address.zipCode}
                register={register}
                dataTestId={"app-alternate-mailing-address-zip"}
                error={errors.mailingAddress?.zipCode}
                validation={{ maxLength: 10 }}
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
