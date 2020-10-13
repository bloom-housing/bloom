/*
1.4 - Alternate Contact
Type of alternate contact
*/
import {
  AlertBox,
  Button,
  Form,
  Field,
  FormCard,
  ProgressNav,
  t,
} from "@bloom-housing/ui-components"
import FormsLayout from "../../../layouts/forms"
import { useForm } from "react-hook-form"
import { Select } from "@bloom-housing/ui-components/src/forms/Select"
import { PhoneField } from "@bloom-housing/ui-components/src/forms/PhoneField"
import { stateKeys } from "@bloom-housing/ui-components/src/helpers/formOptions"
import FormBackLink from "../../../src/forms/applications/FormBackLink"
import { useFormConductor } from "../../../lib/hooks"

export default () => {
  const { conductor, application, listing } = useFormConductor("alternateContactInfo")
  const currentPageSection = 1

  /* Form Handler */
  const { control, register, handleSubmit, errors, watch } = useForm<Record<string, any>>({
    shouldFocusError: false,
  })
  const onSubmit = (data) => {
    application.alternateContact.phoneNumber = data.phoneNumber
    application.alternateContact.emailAddress = data.emailAddress
    application.alternateContact.mailingAddress.street = data.mailingAddress.street
    application.alternateContact.mailingAddress.state = data.mailingAddress.state
    application.alternateContact.mailingAddress.zipCode = data.mailingAddress.zipCode
    application.alternateContact.mailingAddress.city = data.mailingAddress.city
    conductor.completeSection(1)
    conductor.sync()
    conductor.routeToNextOrReturnUrl()
  }
  const onError = () => {
    window.scrollTo(0, 0)
  }

  return (
    <FormsLayout>
      <FormCard header={listing?.name}>
        <ProgressNav
          currentPageSection={currentPageSection}
          completedSections={application.completedSections}
          labels={conductor.config.sections}
        />
      </FormCard>
      <FormCard>
        <FormBackLink url={conductor.determinePreviousUrl()} />

        <div className="form-card__lead border-b">
          <h2 className="form-card__title is-borderless">
            {t("application.alternateContact.contact.title")}
          </h2>
          <p className="field-note my-4">{t("application.alternateContact.contact.description")}</p>
        </div>

        {Object.entries(errors).length > 0 && (
          <AlertBox type="alert" inverted closeable>
            {t("t.errorsToResolve")}
          </AlertBox>
        )}

        <Form
          id="applications-contact-alternate-contact"
          onSubmit={handleSubmit(onSubmit, onError)}
        >
          <div className="form-card__group border-b">
            <label className="field-label--caps" htmlFor="phoneNumber">
              {t("application.alternateContact.contact.phoneNumberFormLabel")}
            </label>
            <PhoneField
              name="phoneNumber"
              label={t("application.alternateContact.contact.phoneNumberFormLabel")}
              readerOnly={true}
              error={errors.phoneNumber}
              errorMessage={t("application.contact.phoneNumberError")}
              controlClassName="control"
              control={control}
              defaultValue={application.alternateContact.phoneNumber}
            />
          </div>
          <div className="form-card__group border-b">
            <h3 className="field-label--caps">
              {t("application.alternateContact.contact.emailAddressFormLabel")}
            </h3>
            <Field
              id="emailAddress"
              name="emailAddress"
              label={t("application.alternateContact.contact.emailAddressFormLabel")}
              readerOnly={true}
              placeholder={t("application.alternateContact.contact.emailAddressFormPlaceHolder")}
              defaultValue={application.alternateContact.emailAddress}
              register={register}
            />
          </div>
          <div className="form-card__group">
            <fieldset>
              <legend className="field-label--caps">
                {t("application.alternateContact.contact.contactMailingAddressLabel")}
              </legend>
              <p className="field-note mb-4">
                {t("application.alternateContact.contact.contactMailingAddressHelperText")}
              </p>
              <Field
                id="mailingAddress.street"
                name="mailingAddress.street"
                label={t("application.alternateContact.contact.streetFormPlaceholder")}
                placeholder={t("application.alternateContact.contact.streetFormPlaceholder")}
                defaultValue={application.alternateContact.mailingAddress.street}
                register={register}
              />

              <div className="flex max-w-2xl">
                <Field
                  id="mailingAddress.city"
                  name="mailingAddress.city"
                  label={t("application.alternateContact.contact.cityFormLabel")}
                  placeholder={t("application.alternateContact.contact.cityFormPlaceholder")}
                  defaultValue={application.alternateContact.mailingAddress.city}
                  register={register}
                />

                <Select
                  id="mailingAddress.state"
                  name="mailingAddress.state"
                  label={t("application.alternateContact.contact.stateFormLabel")}
                  defaultValue={application.alternateContact.mailingAddress.state}
                  register={register}
                  controlClassName="control"
                  options={stateKeys}
                  keyPrefix="application.form.options.states"
                />
              </div>
              <Field
                id="mailingAddress.zipCode"
                name="mailingAddress.zipCode"
                label={t("application.alternateContact.contact.zipcodeFormLabel")}
                placeholder={t("application.alternateContact.contact.zipcodeFormPlaceholder")}
                defaultValue={application.alternateContact.mailingAddress.zipCode}
                register={register}
              />
            </fieldset>
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
